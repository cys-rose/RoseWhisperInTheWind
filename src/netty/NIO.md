# NIO 基础

non-blocking IO / New IO（同步非阻塞 IO）

## 核心组件

1. Channel：可以同时用于读写数据的，非阻塞的数据通道。
2. Buffer：缓冲区，读到的数据要写入数据都先进入 buffer 中。很常见比如 OS 的用户空间、内核空间进行数据交换时也使用 buffer
3. Selector：一个 thread 使用一个 selector，一个 selector 管理多个 channel，当某个 channel 上有事件发生时，selector 可以立刻监听到。所以这些 channel 是非阻塞模式的。

## Channel 和 Buffer 的使用

下面的 buffer 为什么要调用 flip()和 clear()呢？

```java
    try (FileChannel channel = new FileInputStream("data.txt").getChannel()) {
        // 准备缓冲区
        ByteBuffer buffer = ByteBuffer.allocate(10);
        while (true) {
            // 从channel读取数据，写到buffer
            int len = channel.read(buffer);
            log.debug("读取到的字节数 {}",len);
            if (len == -1) {// channel中无内容了
                break;
            }
            buffer.flip(); // 切换buffer读模式
            while (buffer.hasRemaining()) {
                byte b = buffer.get();
                log.debug("读取到的是{}",(char)b);
            }
            buffer.clear();// 切换到写模式
        }
    } catch (IOException e) {
    }
```

我感觉 ByteBuffer 的设计很巧，它有三个重要的参数：capacity，limit，position。而且 ByteBuffer 就是一个数组。

1. capacity：表示缓冲区能容纳的最大元素个数。
2. limit：表示缓冲区中可以操作元素的最大索引位置，`limit==capacity` 表示缓冲区中可以操作所有元素。
3. position：表示缓冲区中当前可以操作元素的索引位置，`position==limit` 表示缓冲区中没有可以操作的元素。读 buffer 和写 buffer 都需要使用它。
   所以呢，写入 buffer 时，position 后移。然后当你想读的时候，你不还得是用到 position 嘛，所以 `flip()`就是把 position 移动到 0 索引，并把 limit 设置为原来 position 的位置，这样你就可以读 buffer 了。而 `clear()`是把 position 移动到 0，而 limit 移动到 capacity。
4. 还有一个方法叫`compact()`这是在你的 buffer 没读完的时候，你想写入数据。这个方法会把 position 到 limit 之间的数据拷贝到 buffer 的 0 到 limit 之间，然后把 position 设置为 limit，limit 设置为 capacity。

## Channel 事件类型

1. accept - 会在有连接请求时触发
2. connect - 客户端在连接成功时触发
3. read - 可读事件
4. write - 可写事件

## Selector 的使用

1. Selector 中会维护一个 SelectionKey 集合`Set<SelectionKey> selectionKeys = selector.selectedKeys();`每当有一个事件触发了就会往这个集合中添加一个 SelectionKey。这个 SelectionKey 相当于 channel 的管理员，它负责管理 channel 的事件。
2. 详细地说：
   1. SelectionKey 是一个代表 Channel 在 Selector 中的注册状态和事件就绪状态的对象。当一个 Channel 注册到 Selector 时，会返回一个 SelectionKey,并且记录了该 Channel 感兴趣的事件是 OP_READ（表示可读事件）。
   ```java
        SelectionKey scKey = sc.register(selector, 0, null);
        scKey.interestOps(SelectionKey.OP_READ);
   ```
3. 处理消息边界问题：客户端传来的消息长度是不一定的，也许比你服务端的 ByteBuffer 更长（没装下，半包），也许也可能更小。有可能一个 ByteBuffer 里保存了多个消息（粘包）。所以应该怎么处理呢？
   **答：**使用`LTV`格式，L 表示消息的长度，T 表示消息的类型，V 表示消息的内容。客户端先传来消息长度和消息类型（LT），再传实际的内容（V）。

## Selector 的坑

1. 每当我们使用完一个 SelectionKey 后，应该把其从 SelectionKey 集合中移除，否则下次循环遍历到它时，就会对相同的事件进行重复处理。
2. 在客户端断开连接时会产生一个 read 事件，需要我们手动处理，看看是正常断开还是异常断开
