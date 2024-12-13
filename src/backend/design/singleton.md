---
# 此页面会在文章列表置顶
sticky: true
star: true
order: 1
tag:
  - 技术
category:
  - Java
date: 2024-12-06
---

# 你知道单例模式有很多种写法吗？

## **什么是单例模式？**

在我学习 JUC 之前认为单例模式就是额。。。一个类在整个程序中只能存在一个实例。因此我们要保证他只能被创建一次，所以就要有个 private static final 的自己作为成员变量、private 的构造方法还要有个 final 修饰类。嗯这是我在上设计模式这堂课中学到的哈哈哈也算是背下来的。但是其实考虑到多线程环境和 Java 的指令重排序的话，只知道这点是不够的。下面我来给大家写出所有的单例代码，让大家更加深刻了解单例模式。

## **饿汉单例**

所谓饿汉嘛，就是要马上吃饭！！！所以我们要马上给这个类创建出来。

OK 了家人们代码就是这么简单，但是我想问大家（以下问题来自黑马程序员视频课）：

```java
// 问题1. 知道为什么类上要加 final 嘛？
// 问题2：如果实现了序列化接口, 还要做什么来防止反序列化破坏单例
public final class Singleton1 implements Serializable {

    // 问题3：这样初始化是否能保证单例对象创建时的线程安全?
    private static final Singleton1 INSTANCE = new Singleton1();

    // 问题4：为什么设置为私有? 是否能防止反射创建新的实例?
    private Singleton1() {}

    public static Singleton1 getInstance() {
        return INSTANCE;
    }
}
```

答案我写在最后喽，请大家先进行思考哈~

## **懒汉单例**

见名知意，就是一个大懒蛋，你需要我的时候我再去实例化自己，要不然我就好好呆着 (为 null)。

```java
public final class Singleton2 {

    private static Singleton2 INSTANCE = null;

    private Singleton2() {}

    // 问题1：分析这里有没有线程安全问题？并说明这么写有什么缺点？
    public static synchronized Singleton2 getInstance() {
        if (INSTANCE != null) {
            return INSTANCE;
        }
        INSTANCE = new Singleton2();
        return INSTANCE;
    }
}
```

答案我写在最后喽，请大家先进行思考哈~

## **枚举单例**

```java
// 问题1：枚举单例是如何限制实例个数的
// 问题2：枚举单例在创建时是否有并发问题
// 问题3：枚举单例能否被反射破坏单例
// 问题4：枚举单例能否被反序列化破坏单例
// 问题5：枚举单例属于懒汉式还是饿汉式
public enum SingletonEnum {

    INSTANCE;

    private String data;

    private SingletonEnum() {
        this.data = "Initial Data";
    }

    public String getData() {
        return data;
    }

    public void setData(String data) {
        this.data = data;
    }
}
```

答案我写在最后喽，请大家先进行思考哈~

## **DCL 懒汉单例**

即双重检查锁定单例！听着高级吧哈哈哈哈，代码也确实巧妙

```java
public final class Singleton3 {

    // 问题1：解释为什么要加 volatile ?
    private static volatile Singleton3 INSTANCE = null;

    private Singleton3(){}

    private static Singleton3 getInstance() {
        if (INSTANCE != null) {
            return INSTANCE;
        }
        // 问题2：为什么还要在这里加为空判断, 之前不是判断过了吗？
        synchronized (Singleton3.class) {
            if (INSTANCE != null) {
                return INSTANCE;
            }
            INSTANCE = new Singleton3();
            return INSTANCE;
        }
    }
}
```

答案我写在最后喽，请大家先进行思考哈~

## **静态内部类懒汉单例**

最后一个喽，哥要装酷，不解释。

```java
public class Singleton4 {

    public Singleton4() {}

    // 问题1：属于懒汉式还是饿汉式
    private static class LazyHolder {
        static final Singleton4 INSTANCE = new Singleton4();
    }
    // 问题2：在创建时是否有并发问题
    public static Singleton4 getInstance() {
        return LazyHolder.INSTANCE;
    }
}
```

答案我写在最后喽，请大家先进行思考哈~

## **解答环节** 🎉

### **懒汉单例解答** 🌟

1. 问题 1：final 意味着这个类不能被继承，所以有以下几点 🤔

   - 因为如果允许继承，子类可能会创建新的实例，从而破坏单例的唯一性。🚫
   - 潜在的安全风险，比如防止恶意代码通过继承来绕过某些保护机制。🛡️
   - JVM 可以对 final 类进行一些优化，因为不需要考虑子类的存在。

2. 问题 2：如果实现了序列化接口，每次反序列化的时候都会创建一个新的对象实例。为了防止单例模式被破坏我们要提供一个私有的 readResolve( )方法。这个方法会在反序列化过程中被调用，并返回现有的单例实例，而不是创建新的实例。

   ```java
   private Object readResolve() {
       return INSTANCE;
   }
   ```

3. 问题 3：这样直接初始化包线程安全啊铁汁~ 因为静态成员初始化是在 JVM 的类加载阶段完成的。唉什么是类加载啊？别急哥要是火起来了，哥包给你写一篇关于类加载的文章啊铁汁~🚀
4. 问题 4：私有化构造方法就可以防止外部代码进行 new 操作创建实例了。但是无法防止反射进行创建实例的，反射仍然可以通过 setAccessible(true) 绕过私有构造函数的限制。

### **懒汉单例解答** 🌟

1.  问题 1：线程肯定是安全的，都加了 synchronized 关键字了能不安全嘛哥们。但是这个方法的性能就会有所影响。想一想我们使用单例模式的初衷：我们是为了防止这个类被多次创建，所以我们只要在创建的时候加锁就可以了呀。获取实例的时候随便并发，反正就这一个。专业术语：锁的粒度太粗了。

### **枚举单例解答** 🌟

1. 问题 1：枚举单例是通过 Java 枚举机制来限制实例个数的，每个枚举类型在 JVM 中都是唯一的。
2. 问题 2：枚举单例在创建时没有并发问题，因为枚举类型的实例是在类加载时由 JVM 创建的，🌐 而类加载过程本身是线程安全的。
3. 问题 3：Java 的枚举类型有特殊的保护机制，防止通过反射创建新的实例。具体来说，Enum 类的构造函数是私有的，并且 Enum 类还重写了 clone 方法，使其抛出 CloneNotSupportedException。
4. 问题 4：Java 的 Enum 类重写了 readResolve 方法，该方法在反序列化过程中被调用，确保返回的是已经存在的枚举实例，而不是创建一个新的实例。
5. 问题 5：枚举单例实际上是一种饿汉式单例模式 💡。这是因为枚举常量的初始化是在类加载阶段完成的，而不是在第一次访问时才创建。

### **DCL 懒汉单例解答** 🌟

1. 问题 1：volatile 为了解决指令重排问题和可见性问题嘛，所以我们先要知道对象创建分几个步骤：分配内存 -> 初始化成员变量 -> 执行构造函数体 -> 发布对象引用。那么如果线程 A 把第四步提前到了第二步或第三步之前了，这时候线程 B 发现这个 INSTANCE 不为 null，就把这个还没有完全初始化的对象返回了，🚫 就会产生问题。而可见性呢是因为在 Java 内存模型(JMM)所抽象出的线程和主内存之间的关系（嗯对就是那个图，我就当你知道。我懒得画了哈哈哈哈），如果不加 volatile 的话可能出现一个线程对这个共享变量修改后，而其他线程无法感知（还用自己线程中的值，不知道别的线程已经把这个值修改了） 🤔 的问题。加上 volatile 后，当这个共享变量被修改后，其他线程也会得到通知，把自己线程内存中的这个变量替换成主内存（因为线程修改共享变量后，肯定要同步到主内存嘛）的值。
2. 问题 2：为了减少同步开销，只有在没被实例化的时候才会获取锁。同时还可以保证多线程清空下的线程安全问题。比如有两个线程进入这个方法了，都发现这个 INSTANCE 是 null，所以他俩都要获取锁。但只有一个线程能获取锁，并创建对象。当对象创建好后另一个线程才能获取锁，进入同步代码块中发现 INSTANCE 已经不是 null 了，💡 直接返回就好喽。

### **静态内部类懒汉单例解答** 🌟

1.  问题 1：因为对于静态内部类，JVM 只会在第一次访问该类的静态成员或静态代码块时，才会加载并初始化它们。所以是懒汉模式。
2.  问题 2：无线程安全问题，因为静态内部类的加载是由 JVM 控制的， Java 的类加载机制保证了静态变量的初始化是线程安全的。
