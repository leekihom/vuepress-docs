---
title: Netty的基本使用方法
date: 2023-03-04
breadcrumb: false
pageInfo: false
category: 
- Netty
tag:
- Netty
- 网络通信
---

## 前言

最近在补充自己的知识，一直想学习一下网络编程，于是乎就开始了对于`Netty`的学习，因为在Java网络编程领域基本上就会立即想到`Netty`这个网络框架。对于`Netty`应用最广的就是`网络聊天`😀，因为一想到网络编程首先就会想到聊天室😂。我们入手就从一个简单的聊天案例开始。

## Java的网络编程模型

在Java当中有三种编程模型：`BIO`，`NIO`，`AIO`

- `BIO`: 同步并阻塞，服务器实现模式为一个连接一个线程，即客户端有连接请求时服务器端就需要启动一个线程进行处理，如果这个连接不做任何事情会造成不必要的线程开销  
  ![20230305234008](https://blog-1253887276.cos.ap-chongqing.myqcloud.com/vscodeblog/20230305234008.png)
  
- `NIO`: 同步非阻塞，服务器实现模式为一个线程处理多个请求（连接），即客户端发送的连接请求都会注册到多路复用器上，多路复用器轮询到连接有 I/O 请求就进行处理，Netty就是基于Java原生的NIO进行封装的框架
  ![20230305234042](https://blog-1253887276.cos.ap-chongqing.myqcloud.com/vscodeblog/20230305234042.png)

- `AIO`：异步非阻塞，AIO 引入异步通道的概念，采用了 Proactor 模式，简化了程序编写，有效的请求才启动线程，它的特点是先由操作系统完成后才通知服务端程序启动线程去处理，一般适用于连接数较多且连接时间较长的应用

## Netty架构模型

![20230305235427](https://blog-1253887276.cos.ap-chongqing.myqcloud.com/vscodeblog/20230305235427.png)

1.`Netty`抽象出两组线程，`BossGroup`专门负责接收客户端的连接，`WorkerGroup`专门负责网络业务的处理  

2.`NioEventLoopGroup` 相当于一个事件循环组，这个组中含有多个事件循环，每一个事件循环是 `NioEventLoop`  

3.`NioEventLoop` 表示一个不断循环的执行处理任务的线程，每个 `NioEventLoop` 都有一个 `Selector`，用于监听绑定在其上的`socket`  的网络通讯  

4.`NioEventLoopGroup` 可以有多个线程，即可以含有多个 `NioEventLoop`  

5.每个 `BossNioEventLoop` 循环执行的步骤有 3 步
 - 轮询 `accept` 事件
 - 处理 `accept` 事件，与 `client` 建立连接，生成 `NioScocketChannel`，并将其注册到某个 `worker` `NIOEventLoop` 上的 `Selector`
 - 处理任务队列的任务，即 `runAllTasks`
  
6.每个 `Worker` `NIOEventLoop` 循环执行的步骤
 - 轮询 `read`，`write` 事件
 - 处理 I/O 事件，即 `read`，`write` 事件，在对应 `NioScocketChannel` 处理
 - 处理任务队列的任务，即 `runAllTasks`
  
8.每个 `Worker` `NIOEventLoop` 处理业务时，会使用 `pipeline（管道）`，`pipeline` 中包含了 `channel`，即通过 `pipeline` 可以获取到对应通道，管道中维护了很多的处理器


## Netty的核心模块组件

#### `Bootstrap`、`ServerBootstrap`

1.`Bootstrap`、`ServerBootstrap`是两个引导类，`Bootstrap`是客户端引导类，`ServerBootstrap`是服务端引导类

2.常见方法：
- `public ServerBootstrap group(EventLoopGroup parentGroup, EventLoopGroup childGroup)`，该方法用于服务器端，用来设置两个 `EventLoop`,一般就是用来设置两个线程组`BossGroup`和`WorkerGroup`
- `public B group(EventLoopGroup group)`，该方法用于客户端，用来设置一个 `EventLoop`
- `public B channel(Class<? extends C> channelClass)`，该方法用来设置一个服务器端的通道实现
- `public <T> B option(ChannelOption<T> option, T value)`，用来给 `ServerChannel` 添加配置
- `public <T> ServerBootstrap childOption(ChannelOption<T> childOption, T value)`，用来给接收到的通道添加配置
- `public ServerBootstrap childHandler(ChannelHandler childHandler)`，该方法用来设置业务处理类（自定义的handler）
- `public ChannelFuture bind(int inetPort)`，该方法用于服务器端，用来设置占用的端口号
- `public ChannelFuture connect(String inetHost, int inetPort)`，该方法用于客户端，用来连接服务器端