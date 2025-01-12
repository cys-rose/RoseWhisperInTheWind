# ReentrantLock 中的 AQS

在很多八股文中都是把 ReentrantLock 和 Synchronized 对比着讲解，但是大多八股文都是只讲解到它俩特点上的区别，显得比较空，所以我整理了一些关于 ReentrantLock 代码层面的东西，希望对你有所帮助。

## 使用样例

先给大家写一个简关于 ReentrantLock 的使用代码案例，先大致看一下 ReentrantLock 的流程后再往下深入了解。

```java
public class ProducerConsumerExample {
    private static final int MAX_SIZE = 5;
    private final Queue<Integer> queue = new LinkedList<>();
    private final ReentrantLock lock = new ReentrantLock();
    private final Condition notFull = lock.newCondition();
    private final Condition notEmpty = lock.newCondition();

    // 生产者线程类
    private class Producer implements Runnable {
        @Override
        public void run() {
            int value = 0;
            while (true) {
                lock.lock();
                try {
                    while (queue.size() == MAX_SIZE) {
                        System.out.println("队列已满，生产者等待...");
                        // await()会释放当前线程获得的锁资源
                        notFull.await();
                    }
                    value++;
                    queue.add(value);
                    System.out.println("生产者生产: " + value);
                    notEmpty.signal();
                } catch (InterruptedException e) {
                    e.printStackTrace();
                } finally {
                    lock.unlock();
                }
            }
        }
    }

    // 消费者线程类
    private class Consumer implements Runnable {
        @Override
        public void run() {
            while (true) {
                lock.lock();
                try {
                    while (queue.isEmpty()) {
                        System.out.println("队列为空，消费者等待...");
                        notEmpty.await();
                    }
                    int value = queue.poll();
                    System.out.println("消费者消费: " + value);
                    notFull.signal();
                } catch (InterruptedException e) {
                    e.printStackTrace();
                } finally {
                    lock.unlock();
                }
            }
        }
    }
}
```

## ReentrantLock 的挂起逻辑

在我的`Synchronized`讲解中提到了`Synchronized`的挂起逻辑，其实对比着看，就会发现 ReentrantLock 的挂起逻辑也和它差不多。WaitSet 就相当于 Condition 单向链表，EntryList 就相当于 AQS 队列。先来介绍一下`ReentrantLock`的相关的数据结构吧！

### ReentrantLock 的结构

ReentrantLock 是基于 AQS 实现的，在 AQS 中有一个双向链表（结点为 Node 对象），还有一个 Condition 的单向链表。其是如下定义的：

```java
// extends 和 implements 省略
public abstract class AbstractQueuedSynchronizer{

    static final class Node {
        volatile Node prev;
        volatile Node next;

        // 注意结点状态，下面会用
        /** waitStatus value to indicate thread has cancelled */
        static final int CANCELLED =  1;
        /** waitStatus value to indicate successor's thread needs unparking */
        static final int SIGNAL    = -1;
        /** waitStatus value to indicate thread is waiting on condition */
        static final int CONDITION = -2;
        /**
         * waitStatus value to indicate the next acquireShared should
         * unconditionally propagate
         */
        static final int PROPAGATE = -3;
    }
    // 用这俩构成个双向链表
    private transient volatile Node head;

    private transient volatile Node tail;

    // AQS中内部类
    public class ConditionObject implements Condition {
        // 与上面是同一个Node
        // 虽然定义了前驱节点，但是并没有前序遍历过，所以还是个单向的
        private transient Node firstWaiter;

        private transient Node lastWaiter;
    }
}
```

上面介绍的 AQS 双向链表是用于存放没有获得锁资源的线程，而 Condition 单向链表存放的是等待被唤醒的线程。下面是相关代码：

- 首先看看挂起读逻辑

```java
    public class ConditionObject implements Condition {

        public final void await() throws InterruptedException {
            // 如果线程被中断了
            if (Thread.interrupted())
                throw new InterruptedException();
            // 将当前线程封装成Node，加入到Condition单向链表的末尾
            Node node = addConditionWaiter();
            // 释放当前线程的锁资源!!!! 返回线程重入次数
            int savedState = fullyRelease(node);
            // int interruptMode = 0;
            // 如果这个线程不在AQS双向链表中，因为可能会出现并发问题，所以检查一下
            while (!isOnSyncQueue(node)) {
                // 挂起
                LockSupport.park(this); // 阻塞在这里等待被唤醒
                // 三种情况
                // 1. 被signal() 唤醒 interruptMode == 0
                // 2. 被interrupt() 唤醒 修改Node状态，并放入到AQS双向链表
                // 3. 被signal() 唤醒后，又 interrupt()了 确保当前node放入AQS双向链表，再执行后面逻辑
                if ((interruptMode = checkInterruptWhileWaiting(node)) != 0)
                    break;
            }
            // acquireQueued(node, savedState) 尝试获取锁
            // 省略
        }

        private Node addConditionWaiter() {
            Node t = lastWaiter;
            // If lastWaiter is cancelled, clean out.
            if (t != null && t.waitStatus != Node.CONDITION) {
                unlinkCancelledWaiters();
                t = lastWaiter;
            }
            Node node = new Node(Thread.currentThread(), Node.CONDITION);
            if (t == null)
                firstWaiter = node;
            else // Condition单向链表加到末尾
                t.nextWaiter = node;
            lastWaiter = node;
            return node;
        }
    }
```

- 下面时唤醒的逻辑

```java
public class ConditionObject implements Condition {
    // 唤醒操作
    public final void signal() {
        if (!isHeldExclusively())
            throw new IllegalMonitorStateException();
        Node first = firstWaiter;
        if (first != null)
            // 从头节点开始唤醒
            doSignal(first);
    }

    private void doSignal(Node first) {
        do {
            // 将头节点移出Condition单向链表
            if ( (firstWaiter = first.nextWaiter) == null)
                lastWaiter = null;
            first.nextWaiter = null;
            // 往下看
        } while (!transferForSignal(first) &&(first = firstWaiter) != null);
    }

    final boolean transferForSignal(Node node) {
        // 将Node结点状态由-2变为0
        if (!compareAndSetWaitStatus(node, Node.CONDITION, 0))
            return false;

        // 将该node节点放入AQS的双向链表中，（插到尾部）
        Node p = enq(node); // p是插入node后，node的prev
        int ws = p.waitStatus; // ws是p的状态，就是Node的哪几个常量
        // 如果p的状态是1（被取消，无效结点）
        // 或者p不是无效结点的话，将p的状态设置为SIGNAL（-1）如果改失败了才执行if的逻辑
        //      就是提醒p：记得自己拿到锁后，把我(node)唤醒。
        // 就是增强代码健壮性，防止node无人唤醒
        if (ws > 0 || !compareAndSetWaitStatus(p, ws, Node.SIGNAL))
            // 自己唤醒自己
            LockSupport.unpark(node.thread);
        return true;
    }
}
```
