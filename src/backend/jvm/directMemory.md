# 直接内存

直接内存是位于 JVM 堆外的一块内存，其大小是由 -XX:MaxDirectMemorySize 参数来控制的。并且直接内存不由 GC 所控制。

## 用途

1. 提高性能：
   对于某些 I/O 密集型的应用，比如网络通信和文件 I/O 操作，使用直接内存可以减少数据在 Java 堆和操作系统之间的复制次数，从而提升性能。例如，在进行网络传输时，数据可以从网卡直接写入到直接内存中，然后由应用程序读取，而不必先将数据复制到 Java 堆中。
2. 与本地方法联合使用：
   当我们调用本地方法时，会通过`java.nio.ByteBuffer.allocateDirect`在直接内存中开辟一块内存空间，然后由`DirectByteBuffer`的地址返回给本地方法，这样就可以减少数据在 Java 堆和本地方法之间的复制。

## 如何释放内存？

因为直接内存在堆外，不受 GC 管理，那么到底是如何释放内存的呢？

1. 引用计数算法：
   1. 当使用`allocateDirect`方法分配直接内存时，JVM 会创建一个`DirectByteBuffer`来管理这个区域，也就是说`DirectByteBuffer`持有直接内存的一个指针。
   2. 如果堆中没有对`DirectByteBuffer`的引用，就会使其变成可被 GC 的对象。
2. Cleaner
   1. 每个`DirectByteBuffer`都关联了一个`Cleaner`对象，当`DirectByteBuffer`被回收的时候`Cleaner`就会被激活。这个`Cleaner`会被放到一个队列中。然后，一个守护线程会定期检查这个队列，并调用 Cleaner 的 clean 方法来释放直接内存。
3. 手动显示释放
   调用`java.nio.ByteBuffer#cleaner().clean()`方法，但是有可能会导致释放掉还正在使用的内存，所以要谨慎使用。
