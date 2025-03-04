# 类加载过程

加载 -> 链接（验证->准备->解析）->初始化

## 加载

1. 通过类的全限定名来获取定义这个类的二进制字节流。
2. 将此字节流的静态存储转化为方法区的运行时数据结构。
3. 再内存中生成一个代表这个类的 java.lang.Class 对象。

## 链接

1. 验证
   1. 文件格式验证
   2. 元数据验证
   3. 字节码验证
2. 准备
   为静态变量赋初始值。**注意！！！**是赋初始值。比如 int 类型的赋为 0，long 类型的 0L char 类型的'\u0000'等。
3. 解析
   将常量池中的符号引用转换为直接引用。
   1. 符号引用：比如 a->b(a 指向 b)
   2. 直接引用：比如 a->b 的内存地址(a 指向 b 的对象所在内存中的真正位置)

## 初始化

1. 执行&lt;clinit&gt;()方法。即给所有的静态变量（类变量）赋值，并且执行静态代码块中的内容。
2. &lt;clinit&gt;不需要像&lt;init&gt;那样显示地调用父类构造器，Java 虚拟机会保证子类的&lt;clinit&gt;执行之前，父类的&lt;clinit&gt;已经执行完毕。并且&lt;clinit&gt;也不是必须存在的，如果没有第一条的需求就没有&lt;clinit&gt;方法。
3. 还有一件事：&lt;clinit&gt;在多线程环境中会被正确地加锁同步（只有一个线程可以执行这个方法，而其他线程线程只能阻塞）。
