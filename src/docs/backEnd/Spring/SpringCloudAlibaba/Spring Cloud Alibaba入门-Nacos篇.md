---
title: Spring Cloud Alibaba入门之Nacos篇
date: 2022-10-25
breadcrumb: false
pageInfo: false
category:
- Spring Cloud Alibaba
tag:
- Spring Cloud Alibaba
- 微服务
- Nacos
sticky: 2022-10-25
---

## 前言

对于Spring Cloud这一套架构规范共有两套符合规范的集成方案：`Spring Cloud Netflix`和`Spring Cloud Alibaba`，我们通常说的Spring Cloud基本就是基于网飞的这套集成方案，但是由于网飞这套方案中的大部分组件已经停止维护，所以现在已经开始逐渐采用`Spring Cloud Alibaba`这套方案。

**Spring Cloud Alibaba 组件**
- Nacos：阿里巴巴开源产品，一个更易于构建云原生应用的动态服务发现,配置管理和服务管理平台。
- Sentinel：阿里巴巴开源产品，把流量作为切入点,从流量控制,熔断降级,系统负载保护等多个维度保护服务的稳定性。
- RocketMQ：一款开源的分布式消息系统，基于高可用分布式集群技术，提供低延时的、高可靠的消息发布与订阅服务。
- Seata：阿里巴巴开源产品，一个易于使用的高性能微服务分布式事务解决方案。
- Alibaba Cloud OSS: 阿里云对象存储服务（Object Storage Service，简称 OSS），是阿里云提供的海量、安全、低成本、高可靠的云存储服务。您可以在任何应用、任何时间、任何地点存储和访问任意类型的数据。
- Alibaba Cloud SchedulerX: 阿里中间件团队开发的一款分布式任务调度产品，提供秒级、精准、高可靠、高可用的定时（基于 Cron 表达式）任务调度服务。
- Alibaba Cloud SMS: 覆盖全球的短信服务，友好、高效、智能的互联化通讯能力，帮助企业迅速搭建客户触达通道。

`Spring Cloud Alibaba`的全景架构图:

![20230213112808](https://blog-1253887276.cos.ap-chongqing.myqcloud.com/vscodeblog/20230213112808.png)

这篇文章就是我在学习`Nacos`时的一些记录。

## 简介

[**Nacos**](https://nacos.io/zh-cn/docs/v2/what-is-nacos.html)是构建以“服务”为中心的现代应用架构 (例如微服务范式、云原生范式) 的服务基础设施,它提供了一组简单易用的特性集，帮助您快速实现动态服务发现、服务配置、服务元数据及流量管理，让我们能够更敏捷和容易地构建、交付和管理微服务平台。

**Nacos**的架构：  

![20230213112540](https://blog-1253887276.cos.ap-chongqing.myqcloud.com/vscodeblog/20230213112540.png)

`Nacos`和`Eureka`不同的是`Nacos`需要单独的客户端，而不是像`Eureka`一样集成在代码中的。

在使用`Nacos`时我们需要注意一下它与`Spring Boot`以及`Spring Cloud`的依赖版本。[**版本说明**](https://github.com/alibaba/spring-cloud-alibaba/wiki/%E7%89%88%E6%9C%AC%E8%AF%B4%E6%98%8E)  

## 入门实战

首先我们去[**下载**](https://github.com/alibaba/nacos/releases)客户端，我们需要将`nacos-mysql.sql`文件导入MySQL中创建相关的表，这些表里面就是存放着`Nacos`的相关配置数据，然后修改`conf`里面的`application.properties`的配置参数。

![20230213120432](https://blog-1253887276.cos.ap-chongqing.myqcloud.com/vscodeblog/20230213120432.png)

配置好数据库的参数之后，需要修改一下`bin`下面的启动文件的参数，需要自己根据系统来选择对应的配置文件，我们修改`startup.cmd`文件。

因为我们现在是一台服务，所以我们就不使用集群模式启动，使用单机模式，所以需要将MODE设置成standalone模式，`set MODE="standalone"`，当然也可以使用cmd启动的时候使用 `startup.cmd -m standalone`来使用单机模式

![20230213115931](https://blog-1253887276.cos.ap-chongqing.myqcloud.com/vscodeblog/20230213115931.png)

启动后，默认账户密码都是`Nacos`。

### 注册服务

新建两个服务，将其注册到`Nacos`中，同时需要在启动方法中开启服务发现，使用`@EnableDiscoveryClient`注解， `pom.xml`中的版本依赖一定要按照官方的版本来选择

```xml
<dependency>
    <groupId>com.alibaba.cloud</groupId>
    <artifactId>spring-cloud-starter-alibaba-nacos-discovery</artifactId>
</dependency>
```
然后添加yml中的参数：  

**server-addr**: 就是我们需要注册的`Nacos`的地址,这里和`Eureka`的区别就是只能注册一个地址，如果写多个只能默认注册到第一个。

**namespace**: 命名空间的Id,命名空间默认是`public`
![20230213131923](https://blog-1253887276.cos.ap-chongqing.myqcloud.com/vscodeblog/20230213131923.png)  

**group**: 给服务一个自定义的组别  
**service** : 服务名，默认就是应用名

```yml
# 应用名称
server:
  port: 8081
spring:
  application:
    name: nacos-client-a
  cloud:
    nacos:
      server-addr: localhost:8848
      username: nacos #登录名
      password: nacos #登录密码
      discovery:
        namespace: caa904e6-48a1-4e96-bd0c-3954838a96a1
        group: A_group
        service: ${spring.application.name}


```
可以看到已经成功注册进去了，然后去控制台看一下  

![20230213132204](https://blog-1253887276.cos.ap-chongqing.myqcloud.com/vscodeblog/20230213132204.png)


![20230213132232](https://blog-1253887276.cos.ap-chongqing.myqcloud.com/vscodeblog/20230213132232.png)


### 集成OpenFeign

添加`OpenFeign`的依赖
```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-openfeign</artifactId>
</dependency>
```

`nacos-client-a`服务的启动类上面使用注解`@EnableFeignClients`开启`OpenFeign`客户端功能  

在`nacos-client-b`上写一个请求接口

```java
@RestController
public class OpenFeignTest {

    @GetMapping("/openFeign")
    public String FeignTest() {
        return "OpenFeign GET Pass";
    }
}
```
请求端上配置  

```java
@FeignClient(value = "nacos-client-b")
public interface TestFeign {

    @GetMapping("/openFeign")
    public String FeignTest();
}
```

```java
@RestController
public class TestController {

    @Autowired
    public DiscoveryClient discoveryClient;

    @Autowired
    public TestFeign testFeign;

    @GetMapping("test")
    public String test() {
        List<ServiceInstance> serviceInstanceList = discoveryClient.getInstances("nacos-client-b");

        return serviceInstanceList.get(0).toString();
    }

    @GetMapping("testfeign")
    public String getTestFeign() {
        return testFeign.FeignTest();
    }
}

```

发起请求  

![20230213132913](https://blog-1253887276.cos.ap-chongqing.myqcloud.com/vscodeblog/20230213132913.png)  

OK,请求成功  

:::info
`注意：`，我们刚才在配置的时候，将两个服务都注册到同一个命名空间的用一个组别之中，如果不是同一个命名空间和同一个组别的话，是无法请求求成功的。
:::

### 集成Gateway

在启动类上开启服务发现，`@EnableDiscoveryClient`,然后配置yml文件，同样的我们需要将服务注册到刚才的几个服务一个组别里面，我创建了两个名字为`nacos-client-b`的服务，用来做负载均衡，然后就是正常配置

```yml
server:
  port: 80
spring:
  application:
    name: gateway
  cloud:
    nacos:
      server-addr: localhost:8848
      username: nacos
      password: nacos
      discovery:
        namespace: caa904e6-48a1-4e96-bd0c-3954838a96a1
        group: A_group
    gateway:
      discovery:
        routes:
          - id: nacos-gateway-route #唯一标识。默认是一个UUID
            uri: lb://nacos-client-b
        locator:
          lower-case-service-id: true
          enabled: true #开启动态路由
```
然后启动，看一下效果  

![20230213142643](https://blog-1253887276.cos.ap-chongqing.myqcloud.com/vscodeblog/20230213142643.png)  
![20230213142723](https://blog-1253887276.cos.ap-chongqing.myqcloud.com/vscodeblog/20230213142723.png)

刷新一下就可以看到负载均衡已经生效了，这里的配置和之前写的[Gateway](./../SpringCloud/Spring%20Cloud入门-Gateway篇.md)的操作几乎是一样的。

### Nacos配置中心

新建一个配置中心，添加依赖，同时为启动方法开启服务发现

```xml
<dependency>
    <groupId>com.alibaba.cloud</groupId>
    <artifactId>spring-cloud-starter-alibaba-nacos-config</artifactId>
</dependency>
<dependency>
    <groupId>com.alibaba.cloud</groupId>
    <artifactId>spring-cloud-starter-alibaba-nacos-discovery</artifactId>
</dependency>
```

在控制中心，`配置管理`>`配置列表`中新建一个配置  

![20230213154116](https://blog-1253887276.cos.ap-chongqing.myqcloud.com/vscodeblog/20230213154116.png)

新建一个`bootstrap.yml`文件，如果新建项目的时候是从阿里云拉取的框架的话里面会自带这个文件  

**prefix**：需要读取哪个配置列表 DATA ID  
**file-extension**: 配置文件的类型  
**server-addr**： 注册中心的地址  

```yml
server:
  port: 8080
spring:
  application:
    name: nacos-config-a
  cloud:
    nacos:
      config:
        username: nacos
        password: nacos
        prefix: nacos-config-a 
        file-extension:  yml
        server-addr: localhost:8848
```
配置中心的地址和注册中心的地址可以不同，

```yml
cloud:
    nacos:
      discovery:
        server-addr: localhost:8848 #Nacos服务注册中心地址
      config:
        server-addr: localhost:8848 #Nacos作为配置中心地址
        file-extension: yml #指定yaml格式的配置
```

新建一个请求接口，`@RefreshScope`这个注解的作用就是，如果在后台修改了配置参数之后，需要重启服务才能接收到新的配置，但是对于生产环境，不可能想重启就重启，所以加上这个注解之后就能不重启而接收到的新的配置参数。

```java
@RestController
@RefreshScope  
public class NacosConfig {

    @Value("${info.user}")
    private String user;

    @Value("${info.name}")
    private String name;

    @GetMapping("getInfo")
    public String getInfo(){


        return "user: " + user+"----- name: " + name;
    }
}

```

然后起送请求一下 

![20230213151407](https://blog-1253887276.cos.ap-chongqing.myqcloud.com/vscodeblog/20230213151407.png)  

成功  

**多环境配置文件读取：**

```yml
  profiles:
    active: dev
```

**不在一个命名空间的配置读取：**在配置中加上命名空间的参数就行了，`namespace: xxxx`

**读取同一个命名空间下面的不同组：**  
```yml
namespace: caa904e6-48a1-4e96-bd0c-3954838a96a1
    extension-configs: #读取同一个命名空间下面的不同组
        - dataId: nacos-config-a
        group: DEFAULT_GROUP
        refresh: true #动态刷新
        - dataId: nacos-config
        group: DEFAULT_GROUP
        refresh: true #动态刷新

```

**共享配置读取：**  

```yml

shared-configs: #共享配置文件
    - application-dev.yml #这个文件只能存放在DEFAULT_GROUP

```

### Nacos集群

将`Nacos`的客户端复制3份，然后修改里面的`cluster.conf.example`文件，修改里面的ip和端口   
:::info
注意：端口之间至少间隔2，因为`Nacos`会根据给客户端指定的端口，来开启另一个服务的端口，比如指定给客户端8080，那么8081会被占用
:::

![20230213162453](https://blog-1253887276.cos.ap-chongqing.myqcloud.com/vscodeblog/20230213162453.png)

然后给三个客户端分别指定，3333，4444，5555这几个端口号，然后修改每个客户端以`集群模式`启动  

![20230213162820](https://blog-1253887276.cos.ap-chongqing.myqcloud.com/vscodeblog/20230213162820.png)

当然也可以使用ngnix来把3个端口全部监听，做一个负载均衡。




