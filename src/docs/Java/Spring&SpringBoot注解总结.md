---
title: Spring&SpringBoot常用注解总结
date: 2022-08-29
breadcrumb: false
pageInfo: false
category:

- Spring
tag:
   - Spring
   - Java
---
## 前言

之前在学习Spring时，面对Spring的注解总是容易忘记，导致每次使用的时候都是百度，Spring的不少注解的左右都是有交叉的，同样一个注解的问题使用多个注解搭配或者使用其他的注解在相当的多的时候都是能够解决问题，于是想着将这些注解的一些使用方法整理一下。

## 核心注解
### 1.@SpringBootApplication
所有的springboot项目的启动类都会被加上`@SpringBootApplication`,可以看作是`@Configuration`,`@EnableAutoConfiguration`,`@ComponentScan`注解的集合体。
```java :no-line-numbers
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Inherited
@Configuration
@EnableAutoConfiguration
@ComponentScan
public @interface SpringBootApplication {

	/**
	 * Exclude specific auto-configuration classes such that they will never be applied.
	 * @return the classes to exclude
	 */
	Class<?>[] exclude() default {};

}
```
### 2.Spring Bean相关
1. @Autowired
此注解用于bean的field、setter方法以及构造方法上，显式地声明依赖。使用@Autowired(required = false)可以在没有匹配的bean时也不报错。



## 参考

1. Java架构师宝典 [Spring 最常用的 7 大类注解](https://mp.weixin.qq.com/s/zLK-2jAPBfjuJgDv10n8vA)
2. Java全栈知识体系[SpringBoot入门 - 开发中还有哪些常用注解 | Java 全栈知识体系 (pdai.tech)](https://pdai.tech/md/spring/springboot/springboot-x-hello-anno.html#springboot入门---开发中还有哪些常用注解)
3. JavaGuide [Spring&SpringBoot常用注解总结 | JavaGuide](https://javaguide.cn/system-design/framework/spring/spring-common-annotations.html#_0-前言)

