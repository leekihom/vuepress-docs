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
`@PathVariable`用于获取路径参数({}中的参数)，`@RequestParam`用于获取查询参参数(请求地址?后面的参数)。
```java :no-line-numbers
@GetMapping("/user/{name}")
public List<User> GetUserList(
	@PathVariable("name") String name,
	@RequestParam(value = "sex") char sex){
		...
}

//URL:/user/leezihong?sex=0

```
获取到的数据：`name:leezihong,sex：0`

#### 2. @RequestBody
用于读取Request请求(除GET请求，因为GET请求没有请求体即body部分)的body部分并且Content-Type 为 application/json 格式的数据，接收到的数据会自动绑定到Java对象上面。其中起到转换绑定作用的就是`HttpMessageConverter`。
```Java :no-line-numbers
@PostMapping("/sign")
public ResponseEntity sign(@RequestBody User user){
	userService.sign(user);
	...
	return ResponseEntity.OK.build();
}
```
> 一般情况下，或者说是系统设计正确的情况下，一个请求方法只能有一个`@RequestBody`

### 5.配置文件相关
#### 1. @Value
直接读取配置文件的参数`@Value("${property}")`
#### 2. @ConfigurationProperties
`@ConfigurationProperties`读取配置是配置读取相对比较安全的方式，主要通过`prefix`来读取匹配到前缀的所有参数，注解常作用于类中，将配置参数读取为一个类，此时也可以使用`@Component`将该类注册为一个组件。也可作用于方法，常用场景为读写分离。
```yml :no-line-numbers
students:
  school: school1
  user:
    - id: 1
      name: echo
    - id: 2
      name: leezihong
```
- 使用在类上
  
``` java :no-line-numbers

@Data
@Component
@ConfigurationProperties(prefix = "students")
public class Stubase {
    private String school;
    private List<User> user;
}

```
- 使用在方法上，需要结合`@Bean`和`@Configuration`来使用，需要先使用`@Configuration`将类注册为一个配置类
``` java :no-line-numbers
@RestController
@Configuration
public class exp {

    @Bean
    @ConfigurationProperties(prefix = "students")
    public Stubase stubase() {
        return  new Stubase();
    }
    /**
     * 在方法上使用
     */
    @GetMapping("/getInfo")
    public Stubase geting()  {
        return stubase();
    }
}

```
![20220916150208](https://blog-1253887276.cos.ap-chongqing.myqcloud.com/vscodeblog/20220916150208.png)

#### 3. @PropertySource
`@PropertySource`读取指定 properties 文件
```java :no-line-numbers
@PropertySource("classpath:website.properties")
```

### 6. 参数校验
#### 1. @Validated

使用在类上，如果一个类包含另一个类，也可以使用`@Validated`

### 7. 异常处理
[SpringBoot全局异常处理](SpringBoot全局异常处理.md)

### 8. 数据持久相关


## 参考

1. Java架构师宝典 [Spring 最常用的 7 大类注解](https://mp.weixin.qq.com/s/zLK-2jAPBfjuJgDv10n8vA)
2. Java全栈知识体系[SpringBoot入门 - 开发中还有哪些常用注解 | Java 全栈知识体系 (pdai.tech)](https://pdai.tech/md/spring/springboot/springboot-x-hello-anno.html#springboot入门---开发中还有哪些常用注解)
3. JavaGuide [Spring&SpringBoot常用注解总结 | JavaGuide](https://javaguide.cn/system-design/framework/spring/spring-common-annotations.html#_0-前言)

