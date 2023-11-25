---
title: SpringSecurity-授权
date: 2023-01-17
breadcrumb: false
pageInfo: false
category:
- Spring
- Springboot
- SpringSecurity
tag:
- SpringSecurity
- 权限
sticky: 2023-01-17
---

## 简介
之前将[SpringSecurity的认证](SpringSecurity-认证)部分写了，现在将剩下的`授权`的基本操作归纳，同时完善之前`认证`遗留下的问题。  
在以前进行权限验证时，可以交给前端来操作，判断用户拥有哪些权限就显示对应的操作按钮，这种操作在某些时候确实可以起到权限验证的作用，但是一旦用户知道了对应功能的接口就会出现安全隐患。所以我们在后台也需要进行权限的验证。

## 授权的基本流程
在SpringSecurity中，会使用默认的FilterSecurityInterceptor来进行权限校验。在FilterSecurityInterceptor中会从SecurityContextHolder获取其中的Authentication，然后获取其中的权限信息。当前用户是否拥有访问当前资源所需的权限。[官方-Authorize HttpServletRequest with FilterSecurityInterceptor](https://docs.spring.io/spring-security/reference/servlet/authorization/authorize-requests.html)  
所以我们在项目中只需要把当前登录用户的权限信息也存入Authentication。

## 实现
### 限制访问资源的权限
想要我们的相关方法生效，需要在我们之前的配置方法上面加上`@EnableGlobalMethodSecurity`注解  
```java
@EnableGlobalMethodSecurity(prePostEnabled = true)
```
`prePostEnabled = true`这个就是开启权限配置生效。需要设置为`true`，后面的`@PreAuthorize`注解才会生效。  
现在写一个接口，用来测试是权限验证成功。  
```java
@RestController
public class HelloController {

    @RequestMapping("/hello")
    @PreAuthorize("@ex.hasAuthority('system:dept:list')")
    public String hello() {
        return "hello";
    }
}
```
`@PreAuthorize`里面是一个自定义方法，可以认为是验证权限的规则。  
```java
@Component("ex")
public class ExpressionRoot {

    public boolean hasAuthority(String authority){
        //获取当前用户的权限
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        LoginUser loginUser = (LoginUser) authentication.getPrincipal();
        List<String> permissions = loginUser.getPermissions();
        //判断用户权限集合中是否存在authority
        return permissions.contains(authority);
    }
}
```
我们先获取`SecurityContextHolder`中的权限对象，然后解析得到一个`LoginUser`对象，因为重写了`UserDetailsService`的实现类，返回的时候重新构建的`LoginUser`类已经包含了权限集合`permissions`，所以直接判断传递过来的权限值是否存在于该用户的权限集合中。

### 自定义失败处理
在SpringSecurity中，如果我们在认证或者授权的过程中出现了异常会被ExceptionTranslationFilter捕获到。在ExceptionTranslationFilter中会去判断是认证失败还是授权失败出现的异常。  
如果是认证过程中出现的异常会被封装成AuthenticationException然后调用**AuthenticationEntryPoint**对象的方法去进行异常处理。  
如果是授权过程中出现的异常会被封装成AccessDeniedException然后调用**AccessDeniedHandler**对象的方法去进行异常处理。  

```java
@Component
public class AccessDeniedHandlerImpl implements AccessDeniedHandler {
    @Override
    public void handle(HttpServletRequest request, HttpServletResponse response, AccessDeniedException accessDeniedException) throws IOException, ServletException {
        ResponseResult result = new ResponseResult(HttpStatus.FORBIDDEN.value(),"您的权限不足");
        String json = JSON.toJSONString(result);
        //处理异常
        WebUtils.renderString(response,json);
    }
}
```
```java
@Component
public class AuthenticationEntryPointImpl implements AuthenticationEntryPoint {
    @Override
    public void commence(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, AuthenticationException e) throws IOException, ServletException {
        //处理异常
        ResponseResult result = new ResponseResult(HttpStatus.UNAUTHORIZED.value(),"认证失败!");

        WebUtils.renderString(httpServletResponse, JSON.toJSONString(result));
    }
}
```
将异常处理器配置到我们的配件类`SecurityConfig`中
```java
@Autowired
private AuthenticationEntryPoint authenticationEntryPoint;

@Autowired
private AccessDeniedHandler accessDeniedHandler;

```
然后配置在`configure()`中
```java
http.exceptionHandling()
                .accessDeniedHandler(accessDeniedHandler)
                .authenticationEntryPoint(authenticationEntryPoint);
```

## 总结

这里只是做了一个基础的上手体验，其中的很多功能的实现其实不止一种，在官方文档里面都写得很清楚，所以这里只是将比较重要的部分写出来了

