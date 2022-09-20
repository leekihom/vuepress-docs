---
title: Java 并发 - 理论基础
date: 2022-08-29
breadcrumb: false
pageInfo: false
category:
    - Java
    - 后端
tag:
    - 并发
    - Java
---

# Java并发-理论基础

## Java并发常见面试题

- 并发出现线程不安全的本质什么? 可见性，原子性和有序性
- Java是怎么解决并发问题的? 3个关键字，JMM和8个Happens-Before
- 线程安全有哪些实现思路?
- 如何理解并发和并行的区别?

## 并发出现问题的原因：并发的三要素

### 可见性：CPU缓存引起

可见性：一个线程对共享变量的修改，另一个线程能够立刻看到
在 Java 中，可以借助 `synchronized` 、`volatile` 以及各种 `Lock` 实现可见性。

如果我们将变量声明为 `volatile` ，这就指示 JVM，这个变量是共享且不稳定的，每次使用它都到主存中进行读取。

```java :no-line-numbers
//thread 1
int i = 0;
i = 2;

//thread 2
j = i;
```

如果先执行线程1的是CPU1，会把int i = 0;加载到CPU1，然后再给i赋值2，但是还未将结果写入主存之中，如果此时CPU2执行线程2，就先去读取主存的数据，j=2;线程修改数据之后，其他的线程并没有立即看到修改后的值。

### 原子性：分时复用引起

原子性：即一个操作或者多个操作 要么全部执行并且执行的过程不会被任何因素打断，要么就都不执行。即使在多个线程一起执行的时候，一个操作一旦开始，就不会被其他线程所干扰。

```java :no-line-numbers
int i = 1;
//线程1执行
i += 1;

//线程2执行
i += 1;
```

如果要执行`i += 1`需要三条CPU指令

1.将变量i读取到CPU寄存器  
2.在CPU寄存器中执行i + 1操作  
3.将最后的结果i写入内存(缓存机制导致可能写入的是CPU缓存而不是内存)  

由于CPU分时复用(线程切换)的存在，线程1在执行着第一条CPU指令在之后，切换到线程2执行完整的三条指令，然后等到线程2执行后再让线程1继续执行，将造成最后写入内存的i不是3而是2。
在 Java 中，可以借助`synchronized` 、各种 `Lock` 以及各种原子类实现原子性。

`synchronized` 和各种 `Lock` 可以保证任一时刻只有一个线程访问该代码块，因此可以保障原子性。各种原子类是利用 CAS (compare and swap) 操作（可能也会用到 `volatile`或者`final`关键字）来保证原子操作。

### 有序性：重排序引起

有序性：即程序执行的顺序按照代码的先后顺序执行。但是由于指令重排序，所以代码的执行顺序未必就是编写代码时的顺序。

在执行程序时为了提高性能，编译和处理器常常会对指令做重排序。重排序分三种类型：

- 编译器优化重排序：编译器（包括 JVM、JIT 编译器等）在不改变单线程程序语义的前提下，重新安排语句的执行顺序
- 指令并行重排序：现代处理器采用了指令级并行技术(Instruction-Level Parallelism，ILP)来将多条指令重叠执行。如果不存在数据依赖性，处理器可以改变语句对应机器指令的执行顺序
- 内存系统重排序：由于处理器使用缓存和读 / 写缓冲区，这使得加载和存储操作看上去可能是在乱序执行

> 指令重排序可以保证串行语义一致，但是没有义务保证多线程间的语义也一致 ，所以在多线程下，指令重排序可能会导致一些问题。

从源码到最终执行会的过程：  
![java-jmm-3](https://blog-1253887276.cos.ap-chongqing.myqcloud.com/vscodeblog/java-jmm-3.png)

## Java是怎么解决并发问题的：JMM（Java内存模型）

CPU在执行指令的时候首先将数据写入Cache中，但是当多线程执行的时候，多个线程读取Cache中数据处理后返回到主存中是，会造成数据不一致的问题，Java Memory Model(JMM Java内存模型)就此应运而生，Java为了解决在并发编程时内存不一致的问题定义了一些规范来解决这些问题，对开发人员而言就是:  
- [volatile、synchronized 和 final 三个关键字](/src/info.md)
- happens-before 原则
  
Java内存模型确保的在基础 读取/赋值 是原子性操作，但是其他的操作如果也需要保持原子性的话就需要使用`synchronized`,`Lock`来实现，因为`synchronized`,`Lock`能够保证在同一时刻只有一个线程来操作代码(块)从而能够在大范围的实现原子性；`synchronized`,`Lock`也可以保证可见性，因为加锁后会清空工作内存中的值,解锁之后就会从新将值刷新到主存中，使用`volatile`修饰共享变量可以在变量被修改之后立即刷新到主存中。

## happens-before 原则

happens-before原则表达的意义是不管前一个操作和后一个操作是否在同一线程中，前一个线程的结果对于下一个操作都是可见的。

> tips:下面这几个原则名字不重要，翻译不同而已，理解核心意思即可！！！！

1.程序顺序原则(Program Order Rule):程序书写的顺序即是运行的顺序  
2.管程锁定原则(Monitor Lock Rule):一个 解锁 操作先行发生于后面对`同一个锁`的 加锁 操作  
3.volatile 变量原则(Volatile Variable Rule):一个volatile变量的写操作发生在读操作之前  
4.线程启动原则(Thread Start Rule):Thread对象的任何操作都在start()之后    
5.线程加入规则(Thread Join Rule):Thread 对象的结束先行发生于其他线程的join() 方法返回之前  
6.线程中断原则(Thread Interruption Rule):对线程 interrupt () 方法的调用先行发生于被中断线程的代码检测到中断事件的发生，可以通过 Thread.interrupted () 方法检测到是否有中断发生   
7.对象终结原则(Finalizer Rule):一个对象的初始化完成(构造函数执行结束)先行发生于它的 finalize() 方法的开始    
8.传递性(Transitivity):操作的发生顺序具有传递性，如果操作 A 先行发生于操作 B，操作 B 先行发生于操作 C，那么操作 A 先行发生于操作 C   

> tips: continue------->


## 参考

1. JavaGuide <https://javaguide.cn/java/concurrent/jmm.html>
2. Java 并发 - 理论基础 | Java 全栈知识体系 <https://www.pdai.tech/md/java/thread/java-thread-x-theorty.html>
3. 多线程篇-线程安全-原子性、可见性、有序性解析 <https://zhuanlan.zhihu.com/p/142929863>
