---
title: SpringBoot全局异常处理
date: 2022-09-17
breadcrumb: false
pageInfo: false
category:
- Spring
- Springboot
tag:
- 异常处理
---

## 前言
最近在整理关于[Spring&Springboot的注解](Spring&SpringBoot常用注解总结)知识时,看到了以前没有接触过的全局异常处理，于是学习并且整理了一下大佬的方法和思路。  
在以前我们处理异常的时候都是使用try...catch来进行处理，但是随着项目代码的越来越多，使用try...catch就会使项目失去可维护性，为其他运维同事增加工作量，并且现在的项目基本都是基于spring全家桶来进行构架的，所以当然使用spring提供的全局异常处理注解`@RestControllerAdvice`来统一管理异常的处理方式更加合理并且易于维护。

## 定义一个状态码枚举类
为了统一的管理返回给前端的状态，集中处理状态码，减少代码冗余。先随便定义几个异常状态，可以我这里多添加一个`code`字段，这个字段可以用来返回一些自定义的代码。
```java :no-line-numbers
public enum ResultCode {

    RESOURCE_NOT_FOUNDCODE(404, HttpStatus.NOT_FOUND,"资源未找到"),
    USERNAME_OR_PASSWORD_ERROR(1002,HttpStatus.UNAUTHORIZED,"账户或密码错误"),
    SUCCESS(200,HttpStatus.OK,"请求成功"),
    INTERNAL_SERVER_ERROR(500,HttpStatus.INTERNAL_SERVER_ERROR,"服务器错误");

    @Getter
    private final int code;//自定义代码

    @Getter
    private final String message;//自定义返回消息

    @Getter
    private final HttpStatus httpStatus;

    ResultCode(int code,HttpStatus httpStatus, String message) {
        this.code = code;
        this.message = message;
        this.httpStatus = httpStatus;
    }

    @Override
    public String toString() {
        return "ResultCode{" +
                "code=" + code +
                ", message='" + message + '\'' +
                ", httpStatus=" + httpStatus +
                '}';
    }
}

```
## 封装返回的对象
状态码罗列之后，现在就是需要封装返回给前端的对象了，就是为了统一返回的风格，所以当然就是用一个对象来包装一下参数。
``` java :no-line-numbers
@Data
@ToString
public class ResultData<T> {
    private HttpStatus status;
    private int code;
    private String message;
    private T data;
    private long timestamp;

    public ResultData (){
        this.timestamp = System.currentTimeMillis();
    }


    public static <T> ResultData<T> success(T data) {
        ResultData<T> resultData = new ResultData<>();
        resultData.setCode(HttpStatus.OK.value());
        resultData.setStatus(ResultCode.SUCCESS.getHttpStatus());
        resultData.setMessage(ResultCode.SUCCESS.getMessage());
        resultData.setData(data);
        return resultData;
    }

    public static <T> ResultData<T> fail(int code,HttpStatus status, String message) {
        ResultData<T> resultData = new ResultData<>();
        resultData.setCode(code);
        resultData.setStatus(status);
        resultData.setMessage(message);
        return resultData;
    }
    public static <T> ResultData<T> fail(ResultCode resultCode) {
        ResultData<T> resultData = new ResultData<>();
        resultData.setCode(resultCode.getCode());
        resultData.setStatus(resultCode.getHttpStatus());
        resultData.setMessage(resultCode.getMessage());
        return resultData;
    }

}

```
构造方法里面可以自己自定义添加参数，现在就是在无参构造里面只返回一个时间戳。  

## 定义调用入口
返回的值有了，现在就是请求的入口了
``` java :no-line-numbers
@RestController
@RequestMapping("/api")
public class ExceptionController {

    @GetMapping("/result")
    public ResultData result(){
        return ResultData.success("success!");
    }
}

```
先请求一下试试，看返回的对象有无问题   
![20220923175951](https://blog-1253887276.cos.ap-chongqing.myqcloud.com/vscodeblog/20220923175951.png)
OK，现在返回的对象没有问题，那么就是应该来拦截处理异常了。

## 定义一个异常处理类
`@RestControllerAdvice`注解就是将`@ControllerAdvice`+`@ResponseBody`的集合体，将类注册为一个异常处理类并且使用JSON格式返回响应。  
``` java :no-line-numbers
@RestControllerAdvice
public class ResponseAdvice implements ResponseBodyAdvice<Object> {
    @Autowired
    private ObjectMapper objectMapper;

    //是否开启全局处理
    @Override
    public boolean supports(MethodParameter methodParameter, Class<? extends HttpMessageConverter<?>> aClass) {
        return true;
    }

    @SneakyThrows
    @Override
    public Object beforeBodyWrite(Object o, MethodParameter methodParameter, MediaType mediaType, Class<? extends HttpMessageConverter<?>> aClass, ServerHttpRequest serverHttpRequest, ServerHttpResponse serverHttpResponse) {
        if(o instanceof String){
            return objectMapper.writeValueAsString(ResultData.success(o));
        }
        if(o instanceof ResultData){
            return o;
        }
        if (o instanceof IllegalArgumentException) {
            return new ResultData();
        }
        return ResultData.success(o);
    }


}

```
再次请求一个报错的接口，看看返回报错的情况是什么
![20221006170242](https://blog-1253887276.cos.ap-chongqing.myqcloud.com/vscodeblog/20221006170242.png)
emm.....感觉好像有点问题，这个接口本来是报错的，但是为啥外层还是请求成功，想想其实也合理，请求是链接上的，并且已经处理了，但是返回给前端使用的话这样就是有问题的

## 全局异常处理
定义一个全局异常处理类,用来全局处理异常,`@ExceptionHandler`用于接收指定的异常类型,`@ResponseStatus`指定客户端收到的http状态码
```java :no-line-numbers

//接受服务器异常
    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ResultData<String> exception(Exception e) {
        return ResultData.fail(ResultCode.INTERNAL_SERVER_ERROR);
    }

```

## 异常接入返回的标准格式

`beforeBodyWrite`类在异常处理的时候，将异常分一下类，如果是我们自己已经封装了的异常对象，就直接返回，如果没有封装的就进行封装一下。
![20221006172911](https://blog-1253887276.cos.ap-chongqing.myqcloud.com/vscodeblog/20221006172911.png)

## 总结
全局异常处理，主要是将返回对象的标准制定好，然后再使用`@RestControllerAdvice`注解来全局异常拦截，最后在返回的时候将返回对象归类，未被封装的对象要封装，封装好的对象直接返回。