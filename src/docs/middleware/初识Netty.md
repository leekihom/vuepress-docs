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
sticky: 2023-03-04
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

#### 启动器`Bootstrap`、`ServerBootstrap`

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

#### 通道`Channel`

1.`Netty` 网络通信的组件，能够用于执行网络 I/O 操作

2.通过 `Channel` 可获得当前网络连接各种信息

3.`Channel` 提供异步的网络 `I/O` 操作(如建立连接，读写，绑定端口)，异步调用意味着任何 `I/O` 调用都将立即返回，并且不保证在调用结束时所请求的 `I/O` 操作已完成
4.调用立即返回一个 `ChannelFuture` 实例，通过注册监听器到 `ChannelFuture` 上，可以 I/O 操作成功、失败或取消时回调通知调用方
5.不同协议、不同的阻塞类型的连接都有不同的 `Channel` 类型与之对应，常用的 `Channel` 类型：
- `NioSocketChannel`，异步的客户端 `TCP` `Socket` 连接
- `NioServerSocketChannel`，异步的服务器端 `TCP` `Socket` 连接
- `NioDatagramChannel`，异步的 `UDP` 连接
- `NioSctpChannel`，异步的客户端 `Sctp` 连接
- `NioSctpServerChannel`，异步的 `Sctp` 服务器端连接，这些通道涵盖了 `UDP` 和 `TCP` 网络 `IO` 以及文件 `IO`


#### `Selector`

1.`Netty`的多路复用就是基于`Selector`来实现的，通过`Selector`实现一个线程可以监听多个连接的`Channel`

2.当向一个 `Selector` 中注册 `Channel` 后，`Selector` 内部的机制就可以自动不断地查询（Select）这些注册的 `Channel` 是否有已就绪的 I/O 事件（例如可读，可写，网络连接完成等），这样程序就可以很简单地使用一个线程高效地管理多个 `Channel`

#### 核心组件-通道处理器 `Handler`

1.`ChannelHandler`是一个接口，我们通常使用的就是它子类的实现类，如：`ChannelInboundHandlerAdapter`，`ChannelOutboundHandlerAdapter`，一个是用于处理入站事件（服务端），一个是用于出站事件（客户端）  

![20230306154022](https://blog-1253887276.cos.ap-chongqing.myqcloud.com/vscodeblog/20230306154022.png)  

- 常用的方法:

- `public void channelRegistered(ChannelHandlerContext ctx)`，会在当前`Channel`通道注册到选择器时触发（与`EventLoop`绑定时触发）
- `public void channelUnregistered(ChannelHandlerContext ctx)`，会在选择器移除当前`Channel`通道时触发（与`EventLoop`解除绑定时触发）
- `public void channelActive(ChannelHandlerContext ctx)`，会在通道准备就绪后触发（`Pipeline处理器`添加完成、绑定`EventLoop`后触发）
- `public void channelInactive(ChannelHandlerContext ctx)`，会在通道关闭时触发
- `public void channelRead(ChannelHandlerContext ctx, Object msg)`，会在收到客户端数据时触发（每当有数据时都会调用该方法，表示有数据可读）
- `public void channelReadComplete(ChannelHandlerContext ctx)`，会在一次数据读取完成后触发
- `public void userEventTriggered(ChannelHandlerContext ctx, Object evt)`，当通道上的某个事件被触发时，这个方法会被调用
- `public void channelWritabilityChanged(ChannelHandlerContext ctx)`，当通道的可写状态发生改变时被调用（一般在发送缓冲区超出限制时调用）
- `public void exceptionCaught(ChannelHandlerContext ctx, Throwable cause)`，当通道在读取过程中抛出异常时，当前方法会被触发调用

2.处理器链`Pipeline` 和 `ChannelPipeline`: 
- 一个处理器被称为`Handler`，而一个`Handler`添加到一个通道上之后，则被称之为`ChannelHandler`，而一个通道上的所有`ChannelHandler`全部连接起来，则被称之为`ChannelPipeline`处理器链,链表上面的处理器是在出站和入站时处理的顺序是相反的，互不干扰
- 常用方法：  
  `ChannelPipeline addFirst(ChannelHandler... handlers)`，把一个业务处理类（handler）添加到链中的第一个位置  

  `ChannelPipeline addLast(ChannelHandler... handlers)`，把一个业务处理类（handler）添加到链中的最后一个位置

#### 事件组-`EventLoopGroup`和`EventLoop`

1.`EventLoop`理解成有一条线程专门维护的`Selector`选择器，而`EventLoopGroup`则可以理解成一个有序的定时调度线程池，负责管理所有的`EventLoop`  

2.在实际使用时，通常需要定义连个组，一个用于处理连接事件，一个用于处理I/O处理

3.通常使用也是`EventLoopGroup`的实现类的子类`NioEventLoopGroup`



## Netty的空闲监测与心跳机制

`Netty`的服务端和客户端通常都是使用的长连接，在长时间的连接时，就会出现明明客户端已经掉线了，但是服务端还是没有断开网络连接。可是`Netty`不是有`handlerRemoved()`来监测连接是否断开么？是的，对于像网络信号延迟或者断连这种是不会被监测的，所以就需要对客户端进行心跳检测。心跳机制其实就是定时对客户端进行空闲监测，如果未响应次数超过一个阈值就将其断开，节省资源  

### Netyy的网络参数(ChannelOption)

在进行服务初始化时就需要对网络进行一些相应的配置  

- `ALLOCATOR`：`ByteBuf`缓冲区的分配器，默认值为`ByteBufAllocator.DEFAULT`
- `RCVBUF_ALLOCATOR`：通道接收数据的`ByteBuf`分配器，默认为`AdaptiveRecvByteBufAllocator.DEFAULT`
- `MESSAGE_SIZE_ESTIMATOR`：消息大小估算器，默认为`DefaultMessageSizeEstimator.DEFAULT`
- `CONNECT_TIMEOUT_MILLIS`：设置客户端的连接超时时间，默认为`3000ms`，超出会断开连接
- `MAX_MESSAGES_PER_READ`：一次Loop最大读取的消息数,`ServerChannel/NioChannel`默认16，其他类型的Channel默认为1
- `WRITE_SPIN_COUNT`：一次Loop最大写入的消息数，默认为16,一个数据16次还未写完，需要提交一个新的任务给EventLoop，防止数据量较大的场景阻塞系统
- `WRITE_BUFFER_HIGH_WATER_MARK`：写高水位标记，默认为64K，超出时`Channel.isWritable()`返回Flase
- `WRITE_BUFFER_LOW_WATER_MARK`：写低水位标记，默认为32K，超出高水位又下降到低水位时，isWritable()返回True
- `WRITE_BUFFER_WATER_MARK`：写水位标记，如果写的数据量也超出该值，依旧返回Flase
- `ALLOW_HALF_CLOSURE`：一个远程连接关闭时，是否半关本地连接，默认为Flase,Flase表示自动关闭本地连接，为True会触发入站处理器的`userEventTriggered()`方法
- `AUTO_READ`：自动读取机制，默认为True，通道上有数据时，自动调用`channel.read()`读取数据
- `AUTO_CLOSE`：自动关闭机制，默认为Flase，发生错误时不会断开与某个通道的连接
- `SO_BROADCAST`：设置广播机制，默认为Flase，为True时会开启Socket的广播消息
- `SO_KEEPALIVE`：开启长连接机制，一次数据交互完后不会立马断开连接
- `SO_SNDBUF`：发送缓冲区，用于保存要发送的数据，未收到接收数据的ACK之前，数据会存在这里
- `SO_RCVBUF`：接受缓冲区，用户保存要接受的数据
- `SO_REUSEADDR`：是否复用IP地址与端口号，开启后可重复绑定同一个地址
- `SO_LINGER`：设置延迟关闭，默认为-1
  - -1：表示禁用该功能，当调用close()方法后会立即返回，底层会先处理完数据
  - 0：表示禁用该功能，调用后立即返回，底层会直接放弃正在处理的数据
  - 大于0的正整数：关闭时等待n秒，或数据处理完成才正式关闭
- `SO_BACKLOG`：指定服务端的连接队列长度，当连接数达到该值时，会拒绝新的连接请求
- `SO_TIMEOUT`：设置接受数据时等待的超时时间，默认为0，表示无限等待
- `IP_TOS`：
- `IP_MULTICAST_ADDR`：设置IP头的`Type-of-Service`字段，描述IP包的优先级和QoS选项
- `IP_MULTICAST_IF`：对应IP参数`IP_MULTICAST_IF`，设置对应地址的网卡为多播模式
- `IP_MULTICAST_TTL`：对应IP参数I`P_MULTICAST_IF2`，同上但支持IPv6
- `IP_MULTICAST_LOOP_DISABLED`：对应IP参数`IP_MULTICAST_LOOP`，设置本地回环地址的多播模式
- `TCP_NODELAY`：开启TCP的Nagle算法，会将多个小包合并成一个大包发送
- `DATAGRAM_CHANNEL_ACTIVE_ON_REGISTRATION`：`DatagramChannel`注册的`EventLoop`即表示已激活
- `SINGLE_EVENTEXECUTOR_PER_GROUP`：Pipeline是否由单线程执行，默认为True，所有处理器由一条线程执行，无需经过线程上下文切换

实现心跳机制需要在处理器链中加入`IdleStateHandler`,这个就是`Netty`提供的空闲检测处理器，最后将自定义的心跳处理器放在最后，最好是放在所有处理器处理完成之后再进行心跳检测，对于客户端而言就是检测写空闲，服务端就是读空闲  

```java
public class HeartBeatHandler extends ChannelInboundHandlerAdapter {

    private int lossConnectCount = 0;
    @Override
    public void userEventTriggered(ChannelHandlerContext ctx, Object evt) throws Exception {
        if (evt instanceof IdleStateEvent){
            IdleStateEvent event = (IdleStateEvent)evt;
            if (event.state()== IdleState.READER_IDLE){
                lossConnectCount ++;
                if (lossConnectCount > 2){
                    ctx.channel().close();
                }
            }
        }else {
            super.userEventTriggered(ctx,evt);
        }
    }

    public void channelRead(ChannelHandlerContext ctx, Object msg) throws Exception {
        // 如果收到的是心跳包，则给客户端做出一个回复
        if ("I am Alive".equals(msg)){
            ctx.channel().writeAndFlush("I know");
        }
        System.out.println("收到客户端消息：" + msg);
        super.channelRead(ctx, msg);
    }

}

```

```java

@Override
protected void initChannel(SocketChannel socketChannel) throws Exception {
    ChannelPipeline pipeline = socketChannel.pipeline();
    pipeline.addLast(new IdleStateHandler(5 , 0, 0, TimeUnit.SECONDS));
    pipeline.addLast(new HttpServerCodec());
    pipeline.addLast(new ChunkedWriteHandler());
    pipeline.addLast(new HttpObjectAggregator(1024*64));
    pipeline.addLast(new WebSocketServerProtocolHandler("/ws"));
    pipeline.addLast(new ServerListenerHandler());
    pipeline.addLast(new HeartBeatHandler());
}

```

## 实践

对于Netty的基础只是就是这些，然后我们进行一个简单的实践，来实现一个简单的聊天demo，对于聊天软件的群聊，群消息等都是在单聊的基础上进行的，所以我们这这次实现一个简单的单聊，使用一个简单的html用websocket来连接服务端的netty服务  

### 服务端配置

因为Netty在连接和绑定操作都是异步的，多以需要在端口时需要加上`sync()`用来同步阻塞，目的就是阻塞通道直到成功建立连接之后才继续操作。当然我们在初始化`boosGroup`和`workerGroup`两个线程组的时候也可以为它们指定线程的数量

```java

@Component
@Slf4j
public class Server  {
    
    NioEventLoopGroup boosGroup = new NioEventLoopGroup();
    NioEventLoopGroup workerGroup = new NioEventLoopGroup();

    public void start() throws InterruptedException {
        
        
        
        ServerBootstrap serverBootstrap = new ServerBootstrap();
        serverBootstrap
                .group(boosGroup,workerGroup)   // 指定使用的线程组
                .channel(NioServerSocketChannel.class) // 指定使用的通道
                .option(ChannelOption.CONNECT_TIMEOUT_MILLIS,6000) // 指定连接超时时间
                .childHandler(new ChannelInitializer<SocketChannel>() {

                    @Override
                    protected void initChannel(SocketChannel socketChannel) throws Exception {
                        ChannelPipeline pipeline = socketChannel.pipeline();
                        pipeline.addLast(new IdleStateHandler(0 ,5,0, TimeUnit.MILLISECONDS));
                        pipeline.addLast(new HttpServerCodec());
                        pipeline.addLast(new ChunkedWriteHandler());
                        pipeline.addLast(new HttpObjectAggregator(1024*64));
                        pipeline.addLast(new WebSocketServerProtocolHandler("/ws"));
                        pipeline.addLast(new ServerListenerHandler());
                        pipeline.addLast(new HeartBeatHandler());
                    }
                });
        // 绑定端口启动
        serverBootstrap.bind(9000).sync();
        serverBootstrap.bind(9010).sync();
        log.info("启动Netty多端口服务器: {} {}",9000,9010);

    }
    /**
     * 开启一个新的线程来启动服务端
     */
    @PostConstruct
    private void init() throws Exception {
        new Thread(() ->{
            try {
                start();
            }catch (Exception e){
                e.printStackTrace();
            }
        }).start();
    }

    @PreDestroy
    public void close() throws InterruptedException {
        log.info("关闭Netty服务器");
        boosGroup.shutdownGracefully();
        workerGroup.shutdownGracefully();
    }
}

```

### 用户-通道数据池

建一个类，里面放一些用户和通道对应关系的数据

```java

public class UserConnectPool {

    //主要是为了广播消息
    private static volatile ChannelGroup channelGroup = null;

    /**
     * 存放请求ID与channel的对应关系
     */
    private static volatile ConcurrentHashMap<String, Channel> channelMap = null;



    /**
     * 定义两把锁
     */
    private static final Object lock1 = new Object();
    private static final Object lock2 = new Object();


    public static ChannelGroup getChannelGroup() {
        if (null == channelGroup) {
            synchronized (lock1) {
                if (null == channelGroup) {
                    channelGroup = new DefaultChannelGroup(GlobalEventExecutor.INSTANCE);
                }
            }
        }
        return channelGroup;
    }

    public static ConcurrentHashMap<String, Channel> getChannelMap() {
        if (null == channelMap) {
            synchronized (lock2) {
                if (null == channelMap) {
                    channelMap = new ConcurrentHashMap<>();
                }
            }
        }
        return channelMap;
    }

    public static Channel getChannel(String userId) {
        if (null == channelMap) {
            return getChannelMap().get(userId);
        }
        return channelMap.get(userId);
    }

}

```


### 消息实体类

```java

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ChatMsg implements Serializable {
    private String senderId;
    private String receiverId;
    private String msg;
    private String msgId;
    private ConnectType type;
}

```

### 工具类


```java

public class JsonUtils {

    // 定义jackson对象
    private static final ObjectMapper MAPPER = new ObjectMapper();

    /**
     * 将对象转换成json字符串。
     * <p>Title: pojoToJson</p>
     * <p>Description: </p>
     * @param data
     * @return
     */
    public static String objectToJson(Object data) {
        try {
            String string = MAPPER.writeValueAsString(data);
            return string;
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }
        return null;
    }

    /**
     * 将json结果集转化为对象
     *
     * @param jsonData json数据
     * @param beanType 对象类型
     * @return
     */
    public static <T> T jsonToPojo(String jsonData, Class<T> beanType) {
        try {
            T t = MAPPER.readValue(jsonData, beanType);
            return t;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    /**
     * 将json数据转换成pojo对象list
     * <p>Title: jsonToList</p>
     * <p>Description: </p>
     * @param jsonData
     * @param beanType
     * @return
     */
    public static <T> List<T> jsonToList(String jsonData, Class<T> beanType) {
        JavaType javaType = MAPPER.getTypeFactory().constructParametricType(List.class, beanType);
        try {
            List<T> list = MAPPER.readValue(jsonData, javaType);
            return list;
        } catch (Exception e) {
            e.printStackTrace();
        }

        return null;
    }

}

```

### 服务端监听处理器

`@ChannelHandler.Sharable`实际的作用就是标识这个`ChannelHandler`是可以共享的，只需要初始化一次就行了  

```java

@Component
@ChannelHandler.Sharable
@Slf4j
public class ServerListenerHandler extends SimpleChannelInboundHandler<TextWebSocketFrame> {

    /**
     * 当建立链接时将Channel放置在Group当中
     */
    @Override
    public void handlerAdded(ChannelHandlerContext ctx) throws Exception {
        log.info("有新的客户端链接：[{}]", ctx.channel().id().asLongText());
        // 添加到channelGroup 通道组
        UserConnectPool.getChannelGroup().add(ctx.channel());
    }

    /**
     * 读取数据
     */
    @Override
    protected void channelRead0(ChannelHandlerContext ctx, TextWebSocketFrame msg) throws Exception {
        /**
         * 1.接受到msg
         * 2.将msg转化为实体类
         * 3.解析消息类型
         * 将实体类当中的userid和连接的Channel进行对应
         * */
        log.info("服务器收到消息：{}",msg.text());
        ChatMsg chatMsg = JsonUtils.jsonToPojo(msg.text(),ChatMsg.class);

        String senderId = chatMsg.getSenderId();
        UserConnectPool.getChannelMap().put(senderId,ctx.channel());

        ConnectType type= chatMsg.getType();


        switch (type){
            case REGISTER:
                // 将用户ID作为自定义属性加入到channel中，方便随时channel中获取用户ID
                AttributeKey<String> key = AttributeKey.valueOf("userId");
                ctx.channel().attr(key).setIfAbsent(senderId);
                break;
            case CHAT_TO_ONE:
                String receiverId = chatMsg.getReceiverId();
                Channel findChannel = UserConnectPool.getChannelMap().get(receiverId);
                if (findChannel == null) {
                    //用户没在map里面，离线
                    log.warn("{}  ----用户离线",receiverId);
                    UserConnectPool.getChannel(senderId).writeAndFlush(new TextWebSocketFrame("该用户离线"));
                    break;
                }
                UserConnectPool.getChannel(receiverId).writeAndFlush(new TextWebSocketFrame(chatMsg.getMsg()));
                break;
            case CHAT_TO_GROUP:
                ChannelGroup findChannelGroup = UserConnectPool.getChannelGroup();
                if (findChannelGroup.isEmpty()) {
                    log.warn("群组不存在!");
                    break;
                }
                UserConnectPool.getChannelGroup().writeAndFlush(new TextWebSocketFrame(chatMsg.getMsg()));
                break;
        }

    }

    @Override
    public void handlerRemoved(ChannelHandlerContext ctx) throws Exception {
        log.info("用户下线了:{}", ctx.channel().id().asLongText());
        // 删除通道
        UserConnectPool.getChannelGroup().remove(ctx.channel());
        removeUserId(ctx);
    }

    @Override
    public void exceptionCaught(ChannelHandlerContext ctx, Throwable cause) throws Exception {
        //打印异常
        log.info("异常：{}", cause.getMessage());
        // 删除通道
        UserConnectPool.getChannelGroup().remove(ctx.channel());
        removeUserId(ctx);
        ctx.close();
    }

    /**
     * 删除用户与channel的对应关系
     */
    private void removeUserId(ChannelHandlerContext ctx) {
        AttributeKey<String> key = AttributeKey.valueOf("userId");
        String userId = ctx.channel().attr(key).get();
        UserConnectPool.getChannelMap().remove(userId);
    }
}

```

## 测试

![20230306182738](https://blog-1253887276.cos.ap-chongqing.myqcloud.com/vscodeblog/20230306182738.png)

成功启动

![20230306182904](https://blog-1253887276.cos.ap-chongqing.myqcloud.com/vscodeblog/20230306182904.png)

消息发送成功


连接上后，不做任何处理，空闲次数达到一定阈值，直接强制下线

![20230306184202](https://blog-1253887276.cos.ap-chongqing.myqcloud.com/vscodeblog/20230306184202.png)


## 总结

这是自己初次学习Netty做的一个简单的记录，其中还有很多知识都没有深入了解，比如缓冲区，在后续的学习中会继续补充


