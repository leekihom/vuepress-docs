---
title: Spring Cloud入门之Feign篇
date: 2022-09-17
breadcrumb: false
pageInfo: false
category:
- Spring Cloud
tag:
- Spring Cloud
- 微服务
- OpenFeign
sticky: 2022-09-17
---

## 前言

上一篇《[Spring Cloud入门之Ribbon篇](Spring%20Cloud入门-Ribbon篇.md)》中使用了Ribbon来进行服务调用，但是在请求的时候需要自己拼接请求的URL，显然这种方式不太实用，如果服务名字更改了，那么消费端的代码也需要跟着修改。  
所以引入`Feign`来解决这个问题。2019 年 Netflix 公司宣布 Feign 组件正式进入停更维护状态，于是 Spring 官方便推出了一个名为 OpenFeign 的组件作为 Feign 的替代方案。

## OpenFeign
OpenFeign 全称 Spring Cloud OpenFeign，它是 Spring 官方推出的一种声明式服务调用与负载均衡组件，它的出现就是为了替代进入停更维护状态的 Feign。

## 实现
和`Ribbon`案例的创建方式一样，需要在发起请求调用的服务上面添加`OpenFeign`的依赖。
```yml
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-openfeign</artifactId>
        </dependency>
```
然后在yml中将服务名字更改一下，然后在请求端新建一个请求接口

```java
@RestController
public class UserController {


    /**
     *
     */
    @Autowired
    public UserOrderFeign userOrderFeign;

    /**
     * feign远程调用有时间的限制，默认 1s
     * @return
     */
    @GetMapping("userDoOrder")
    public String userDoOrder(){

        System.out.println("USER IN");
        String s = userOrderFeign.doOrder();
        return  s;
    }
}

```
UserOrderFeign：`@FeignClient`注解就是实现服务绑定，当我们请求`/userDoOrder`时，调用`userOrderFeign.doOrder()`，这是`OpenFeign`会根据配置的服务名字去`Eureka`的服务列表中查找服务，然后根据我们配置的负载均衡策略去调用服务。

```java
@FeignClient(value = "order-service")
public interface UserOrderFeign {

    /**
     * 需要调用哪个接口就直接匹配上对应的名称就可以调用
     * OrderController --> doOrder
     */

    @GetMapping("doOrder")
    public String doOrder();
}
```
然后我们需要在服务实例上面实现这个请求的调用

```java
@RestController
public class OrderController {

    @GetMapping("doOrder")
    public String doOrder(){
        return "OrderService --> doOrder() 进来了";
    }
}

```

启动

![20230208095055](https://blog-1253887276.cos.ap-chongqing.myqcloud.com/vscodeblog/20230208095055.png)  

多次刷新，会看到请求更改  

## 优化

### 请求超时
因为OpenFeign底层还是使用的Ribbon，而Ribbon的默认超时时间时1s，所以就会出现，如果网络卡顿的话就很容易请求超时。
![20230208100110](https://blog-1253887276.cos.ap-chongqing.myqcloud.com/vscodeblog/20230208100110.png)  

所以我们需要在请求调用的时候配置上请求超时的时间

```yml

ribbon:
  ReadTimeout: 3000 #读取延时3s
  ConnectTimeout: 3000 #连接超时
  NFLoadBalancerRuleClassName: com.netflix.loadbalancer.RandomRule #负载均衡策略

```
然后验证一下，让请求休眠1s，模拟一下网络卡顿

```java
@RestController
public class OrderController {

    @GetMapping("doOrder")
    public String doOrder(){
        try{
            TimeUnit.SECONDS.sleep(1);
        }catch(InterruptedException e){
            e.printStackTrace();
        }
        return "OrderService --> doOrder() 进来了";
    }
}

```

### 通讯连接优化

`OpenFeign`默认的通讯组件是`JDK自带的URLConnection`对象进行HTTP请求的,我们可以将其更改为性能更好的通讯组件。  

![20230208102909](https://blog-1253887276.cos.ap-chongqing.myqcloud.com/vscodeblog/20230208102909.png)

添加依赖  

```xml
<dependency>
    <groupId>io.github.openfeign</groupId>
    <artifactId>feign-httpclient</artifactId>
</dependency>

```

配置信的通讯组件

```yml
spring:
  application:
    name: user-service
  cloud:
    feign:
      client:
        httpclient:
          enable: true

```
可以看到，新配置的通讯组件已经更改成功了

![20230208103504](https://blog-1253887276.cos.ap-chongqing.myqcloud.com/vscodeblog/20230208103504.png)

### 数据压缩

`OpenFeign`默认不会开启数据压缩功能，但我们可以手动的开启它的`Gzip`压缩功能，这样可以极大的提高宽带利用率和加速数据的传输速度，在项目配置文件`application.yml`中添加以下配置：

```yml

feign:
  compression:
    request:
      enabled: true  # 开启请求数据的压缩功能
      mime-types: text/xml,application/xml, application/json  # 压缩类型
      min-request-size: 1024  # 最小压缩值标准，当数据大于 1024 才会进行压缩
    response:
      enabled: true  # 开启响应数据压缩功能

```

:::info
如果服务消费端的CPU资源比较紧张的话，建议不要开启数据的压缩功能，因为数据压缩和解压都需要消耗CPU的资源，这样反而会给CPU增加了额外的负担，也会导致系统性能降低。
:::

### 负载均衡策略

因为OpenFeign底层还是使用的Ribbon，所以负载均衡策略按照Ribbon的策略配置即可。

### 调用日志级别优化

OpenFeign 提供了日志增强功能，它的日志级别有以下几个：

- NONE【性能最佳，适用于生产】：  默认的，不显示任何日志。
- BASIC【适用于生产环境追踪问题】：  仅记录请求方法、URL、响应状态码及执行时间。
- HEADERS【适用于需查看请求头信息】：  除了BASIC中定义的信息之外，还有请求和响应的头信息。
- FULL【比较适用于开发级测试环境定位问题】：  除了HEADERS中定义的信息之外，还有请求和响应的正文及元数据。

可以通过配置文件设置日志级别，配置信息如下：
```yml
logging:
  level:
    com.jacklin.mamba.contentcenter.post.feignClient.UserCenterFeignClient: debug # feign的自定义接口

```

## 总结
1. 远程服务调用对于请求超时的配置很重要，需要合理配置超时时间
2. 对于负载均衡策略，需要根据具体的业务需求和系统架构来进行选择
3. 防止无效的日志输出
4. 可以为`OpenFeign`更换高性能的通讯组件


## 参考
1. [Spring Cloud OpenFeign远程调用性能优化](https://juejin.cn/post/7134223913176793101)
