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
#### 1. @Autowired
此注解用于bean的field、setter方法以及构造方法上，显式地声明依赖。使用@Autowired(required = false)可以在没有匹配的bean时也不报错。

#### 2. @Qualifier
常与@Autowired配合使用，可以为bean指定名称
```java :no-line-numbers
@Component
public Class User{
	@Autowired
	@Qualifier("")
	private Address address;
	...
}
```
#### 3. @Component
通用的注解，将类注册为一个`bean`,与`@Repository`,`@Service`, `@Controller`功能相同,类似于后面三个组件是@Component的具体实现(粗略可以这么理解)。
#### 4. @Repository
持久层(DAO层)使用，表示此组件用于数据库操作，如果一个实体类对应数据库的一个表(字段这些都一致)，就可以使用该组件。
#### 5. @Service
服务层组件，表示该组件是一个服务类，在该层可能使用到DAO层。
#### 6. @Controller
控制层组件，该层的组件主要用于接受请求和调用Service层。
#### 7. @Configuration
声明一个配置类,`@Component`也可以实现同样的功能，但是使用`@Configuration`更加语义化,`@Bean`注解和xml配置中的bean标签的作用是一样的。  
> @Bean的作用相较于 @Component , @Repository , @ Controller , @Service更加广泛，不仅仅局限于自己编写的类，外部三方包的类需要IOC容器的话也可以使用@Bean实现。
```java :no-line-numbers
@Configuration
public Class SpringConfig{

	@Bean
	private User user(){
		return new User();
	}
}
```
### 3.HTTP请求相关
#### 5种常见的请求类型
> https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Methods
- GET:请求一个指定资源的表示形式，使用 GET 的请求应该只被用于获取数据
- POST:用于将实体提交到指定的资源，通常导致在服务器上的状态变化或副作用
- PUT:用请求有效载荷替换目标资源的所有当前表示
- DELETE:删除指定的资源
- PATCH:用于对资源应用部分修改
#### 1. @GetMapping
`@GetMapping("/user")`等价于`@RequestMapping(value="/user",method=RequestMethod.GET)`。用于接受前台的GET请求。
#### 2. @PostMapping
`@PostMapping("/user")`等价于`@RequestMapping(value="/user",method=RequestMethod.POST)`。用于接受前台的POST请求。
#### 3. @PutMapping
`@PutMapping("/user/{userId}")`等价于`@RequestMapping(value="/user/{userId}",method=RequestMethod.PUT)`
#### 4. @DeleteMapping
`@DeleteMapping("/user/{userId}")`等价于`@RequestMapping(value="/user/{userId}",method=RequestMethod.DELETE)`,用于删除符合GET请求参数的数据。
#### 5. @PatchMapping
```java :no-line-numbers
//摘抄自AiXcoder的代码搜索
@PatchMapping(value = "/books/{id}")
public ResponseEntity updatePartially(@PathVariable("id") Long id, @RequestBody Book Book) {
    Book dbBook = bookRepository.findOne(id);
    if (dbBook == null) {
        return new ResponseEntity(HttpStatus.NOT_FOUND);
    }
    dbBook.setName(Book.getName());
    dbBook.setAuthor(Book.getAuthor());
    return new ResponseEntity(dbBook, HttpStatus.OK);
}
```
同样的`@PatchMapping`也等价于`@RequestMapping(method = RequestMethod.PATCH)`,`@PatchMapping`可以看作是对于`@PutMapping`的一种补充，PUT是更新所有的资源，而PATCH是更新局部资源，比如:user拥有包括ID,NAME，ADDRESS在内的若干个字段，而此时因为功能的需求只需要更改NAME字段，如果使用PUT将所有不必要的字段也传入后台将会及极大的浪费带宽，使用PATCH就只会传入需要修改的字段。

### 4. 前后端传值
#### 1. @PathVariable 和 @RequestParam




## 参考

1. Java架构师宝典 [Spring 最常用的 7 大类注解](https://mp.weixin.qq.com/s/zLK-2jAPBfjuJgDv10n8vA)
2. Java全栈知识体系[SpringBoot入门 - 开发中还有哪些常用注解 | Java 全栈知识体系 (pdai.tech)](https://pdai.tech/md/spring/springboot/springboot-x-hello-anno.html#springboot入门---开发中还有哪些常用注解)
3. JavaGuide [Spring&SpringBoot常用注解总结 | JavaGuide](https://javaguide.cn/system-design/framework/spring/spring-common-annotations.html#_0-前言)

