---
title: Spring Cloud入门之Ribbon篇
date: 2022-09-15
breadcrumb: false
pageInfo: false
category:
- Spring Cloud
tag:
- Spring Cloud
- 微服务
- Ribbon
---

## 前言
上一篇《[Spring Cloud入门之Eureka篇](Spring%20Cloud入门之-Eureka篇.md)》，介绍了Eureka注册中心的基本搭建和服务的调用。

本篇介绍如何使用`Ribbon`来实现负载均衡和服务调用。


## 简介

Ribbon 是 Spring Cloud Netflix 模块的子模块，它是 Spring Cloud 对 Netflix Ribbon 的二次封装。通过它，我们可以将面向服务的 REST 模板（RestTemplate）请求转换为客户端负载均衡的服务调用。

Ribbon 是 Spring Cloud 体系中最核心、最重要的组件之一。它虽然只是一个工具类型的框架，并不像 Eureka Server（服务注册中心）那样需要独立部署，但它几乎存在于每一个使用 Spring Cloud 构建的微服务中。

Spring Cloud 微服务之间的调用，API 网关的请求转发等内容，实际上都是通过 Spring Cloud Ribbon 来实现的，包括OpenFeign 也是基于它实现的。

## 负载均衡

负载均衡就是将客户端的请求平摊到多台服务器上运行，以达到增强数据处理能力，提高系统和网络的高可用性的目的。

常用见的负载均衡有两种：  
- 服务端负载均衡
- 客户端负载均衡

`Ribbon`就是属于客户端负载均衡，其原理图如下：  

![Ribbon负载均衡原理图](https://blog-1253887276.cos.ap-chongqing.myqcloud.com/vscodeblog/20230207151140.png)  

当接收到请求后，Ribbon会查看服务实例清单，然后根据负载均衡算法去寻找一台服务进行访问。其中，Ribbon 提供多种负载均衡策略：如轮询、随机、响应时间加权等。

## Ribbon实现服务调用

### 新建客户端

1. 我们使用之前的Eureka-Server来作为注册中心，启动一个服务端就行
2. 然后我们为了区分，新建两个Eureka客户端，作为测试Ribbon负载均衡的服务实例，按照下面的yml配置两台实例，更改端口就行
```yml
server:
  port: 8080
spring:
  application:
    name: provider
eureka:
  client:
    service-url:
      defaultZone: http://127.0.0.1:8761/eureka
  instance:
    hostname: localhost
    prefer-ip-address: true
    instance-id: ${eureka.instance.hostname}:${spring.application.name}:${server.port}
```
开启客户端功能
```java
@SpringBootApplication
@EnableEurekaClient
public class ProviderAApplication {

    public static void main(String[] args) {
        SpringApplication.run(ProviderAApplication.class, args);
    }
}
```
然后写一个请求接口，两台实例都写，为的是查看调用的是哪一台实例
```java
@RestController
public class ProviderController {

    @GetMapping("/hello")
    public String Hello(){
        return "提供者A";
    }
}
```
3. 然后再建立一台客户端，作为负载均衡器，`NFLoadBalancerRuleClassName`就是我们指定只用的负载均衡规则:
   - 线性轮询策略： RoundRibbonRule
   - 重试策略：RetryRule
   - 加权响应时间策略：WeightedResponseTimeRule
   - 随机策略：RandomRule
   - 客户端配置启动线性轮询策略：ClientConfigEnabledRoundRobbinRule
   - 最空闲策略：BestAvailableRule
   - 过滤性线性轮询策略：PredicateBasedRule
   - 区域感知轮询策略：ZoneAvoidanceRule
   - 可用性过滤策略：AvailabilityFilteringRule
```yml
server:
  port: 8082
spring:
  application:
    name: consumer
eureka:
  client:
    service-url:
      defaultZone: http://127.0.0.1:8761/eureka
  instance:
    hostname: localhost
    prefer-ip-address: true
    instance-id: ${eureka.instance.hostname}:${spring.application.name}:${server.port}
provider:
  ribbon:
    NFLoadBalancerRuleClassName: com.netflix.loadbalancer.RandomRule
```
4. 配置一下请求类,这里我们可以新建一个配置类来进行配置
```java
@SpringBootApplication
@EnableEurekaClient
public class ConsumerApplication {

    public static void main(String[] args) {
        SpringApplication.run(ConsumerApplication.class, args);
    }

    /**
     * 使用@LoadBalanced之后，RestTemplate就会被ribbon接管
     */
    @Bean
    @LoadBalanced
    public RestTemplate restTemplate(){
        return new RestTemplate();
    }
}

```
1. 为负载均衡器建立一个接口
```java
@RestController
public class ConsumerController {

    @Autowired
    private RestTemplate restTemplate;

    @GetMapping("testRibbon")
    public String testRibbon(String serviceName){
        /**
         * restTemplate的bean被ribbon接管之后，ribbon会根据serverName去寻找提供者
         * ribbon先拦截请求
         * 再寻找主机名serviceName
         * 借助eureka来做服务发现
         * 然后根据负载均衡的算法来选取一个服务 获取ip 端口
         * 最后发送请求
         */
        String result = restTemplate.getForObject("http://"+serviceName+"/hello",String.class);
        return result;
    }
}

```
### 启动

将4个服务全部启动后，我们访问一下  
![20230207161943](https://blog-1253887276.cos.ap-chongqing.myqcloud.com/vscodeblog/20230207161943.png)  
我们刷新一个，会看到返回的值在改变，就说明负载均衡器根据我们配置的规则在请求不同的服务实例

### 总结
当然，对于负载均衡的策略也可以直接配置在，配置类中  
```java
    @Bean
	public IRule rule() {
	    return new RandomRule();
	}
```