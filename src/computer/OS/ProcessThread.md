# 我对进程和线程的认识 😊

## 我眼中的这俩 🤔

**进程是资源分配的最小单位，也是资源调度的独立单位。💼
线程是资源调度的最小单位。🏃‍♂️**

## 定义 📝

进程是操作系统结构中的一个独立单元，它包含了程序运行所需的所有信息，包括代码、数据、堆栈、打开的文件等。每个进程都有自己独立的地址空间。🏢
线程是进程中的一部分，有时被称为轻量级进程。同一个进程中的多个线程共享该进程的资源，如内存空间、文件句柄等，但每个线程有自己的指令指针、栈和寄存器状态。🧵

## 创建与销毁：🔨

进程的创建和销毁涉及更多的系统开销，因为需要分配和回收资源。💸
线程的创建和销毁相对简单，消耗的资源较少，因此创建和切换速度更快。🚀

## 通信：📡

不同进程之间的通信通常需要通过操作系统提供的特殊机制，如管道、套接字、共享内存等。🔄
同一进程内的线程间通信更为直接，因为它们共享相同的地址空间，可以直接访问彼此的数据。🔗

## 独立性：🛡️

进程是独立的，一个进程的崩溃不会影响到其他进程。🛡️
线程不是完全独立的，如果一个线程崩溃，可能会导致整个进程的异常。