# 运行时数据区

运行时数据区中有这五大区域：程序计数器、Java 虚拟机栈、本地方法栈、堆、方法区。（前三是线程私有的，后二是所有线程共用的）

## 程序计数器

为了线程切换后能恢复到正确的执行位置，每个线程都有自己的程序计数器。这个计数器记录的是正在执行虚拟机字节码指令的地址；如果正在执行 Native 方法，则程序计数器为空。同时这也是唯一不会出现 OOM 的区域。

## Java 虚拟机栈

虚拟机栈描述的是 Java 方法执行的线程内存模型：每个方法在执行时都会创建一个栈帧。如果线程请求的栈的深度大于 虚拟机栈的最大深度，则抛出 StackOverflowError 异常。当栈扩展时无法获得更大的内存时，会出现 OOM。

## 本地方法栈

与虚拟机栈的作用相似，只是这个本地方法栈是为 Native 方法服务的。

## 堆

几乎所有的对象实例都在堆中分配。但其实堆中内存并不是完全共享的，在 Eden 区中，每个线程都有自己的 TLAB（Thread Local Allocate Buffer）

## 方法区

存放被虚拟机加载的类型信息、常量、静态变量、JIT 编译后的代码缓存。
