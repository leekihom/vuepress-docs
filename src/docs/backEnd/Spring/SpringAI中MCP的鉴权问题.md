---
title: SpringAI中MCP的鉴权问题
date: 2026-10-06
breadcrumb: false
pageInfo: false
category:
- SpringAI
tag:
- SpringAI
- MCP
sticky: 2026-10-06
---

## 前言

目前SpringAI框架虽然迭代到了2.0.1版本，但是对于很多东西都还是需要自己拓展，对于目前而言MCP的鉴权问题，虽然Spring社区有`mcp-security`模块
但是这个模块目前并不是Spring官方的推荐，所以我个人目前还是倾向于个人拓展。因为和前端交互基本都是响应式的输出，所以一下的操作都是基于返回
`Flux<String>`格式的方案

## 全手动

### 客户端

#### 调用链路

```text
业务线程（MVC，有 SecurityContext）
    │
    │ 1. contextWrite(ctx -> ctx.put("authentication", auth))
    ▼
Reactor Context（响应式上下文存放 authentication）
    │
    │ 2. Spring AI 自动捕获，存入 ToolCallReactiveContextHolder（ThreadLocal）
    ▼
ToolCallReactiveContextHolder
    │
    │ 3. McpTransportAuthCustomizer 中直接 getContext() 读取
    ▼
HTTP 请求头 Authorization: Bearer xxx

```
第一步 就是需要在控制层把接收到鉴权参数，传入的响应式的上下文中，`contextWrite`是Spring WebFlux中的一个操作符，可以把数据写入到响应式上下文中
`contextWrite`只能写在调用链的末尾，并且`contextWrite`只对下游可见
```java
Flux<String> res = dsChatClient.prompt()
                .user(question)
                .advisors(advisorSpec -> advisorSpec.param(ChatMemory.CONVERSATION_ID, key))//传递会话id
                .stream()
                .content()
                .contextWrite(ctx -> ctx.put("authentication","Bearer token-123"));
```
然后需要在`McpTransportAuthCustomizer`把参数获取并注入到请求头中，手动实现时，`ToolCallReactiveContextHolder` 里已经 包含了 Reactor Context 的全部
数据，`McpTransportAuthCustomizer` 可以直接从中读取，不需要额外配置 transportContextProvider 来搬运到 `McpTransportContext`。`McpTransportContext` 是 `mcp-security` 模块方案中的中间容器，手动实现可以跳过


```java
@Component
public class McpTransportAuthCustomizer
        implements McpClientCustomizer<HttpClientStreamableHttpTransport.Builder> {

    @Override
    public void customize(String name, HttpClientStreamableHttpTransport.Builder builder) {

        builder.httpRequestCustomizer((requestBuilder, method, endpoint, body, context) -> {
            var ctx = ToolCallReactiveContextHolder.getContext();
            if (ctx.hasKey("authentication")) {
                requestBuilder.header("Authorization", ctx.get("authentication").toString());
            }
        });
    }
}

```

这样的话客户端就完整地把鉴权地参数，或者一些其他的参数传递给了Mcp服务器了，然后现在需要的就是在服务端获取

### 服务端

服务端就很简单了，只需要在http的请求头中获取参数，然后存放到上下文中，其他的方法就可以直接获取了，重点就是从`TransportContextExtractor`中获取传递过来的参数

```java
@Bean
    public WebMvcStreamableServerTransportProvider streamableTransportProvider() {

        return WebMvcStreamableServerTransportProvider.builder()
                .mcpEndpoint("/mcp")
                .contextExtractor(request -> {
                    // 从 HTTP 请求头中提取 Authorization
                    String authHeader = request.headers()
                            .firstHeader("Authorization");

                    Map<String, Object> context = new HashMap<>();
                    context.put("authorization", authHeader);

                    return McpTransportContext.create(context);
                })
                .build();

    }

```

最后就是在逻辑中校验了，我这里没有登录，所以随便传入的一个字符串作为鉴权的参数,`McpTransportContext`对于`stateless`和`steamable`都支持

```java
@McpTool(description = "根据城市名称查询该城市的实时天气信息，包括天气状况、温度、风向、风力、湿度等")
    public String getWeatherByCity(
            @McpToolParam(description = "城市名称，支持中文（如：北京、上海）或英文（如：Tokyo）") String city,
            McpTransportContext context) {

        String url = "/api/v1/misc/weather?city=" + city;
        // 1. 从上下文中取出 Authorization 头
        String authHeader = (String) context.get("authorization");


        if (!"Bearer token-123".equals(authHeader)) {
            log.warn("鉴权失败：令牌无效");
            return "鉴权失败：令牌无效";
        }

        // 3. 鉴权通过，返回数据
        try {
            String responseBody = restClient.get()
                    .uri(url)
                    .retrieve()
                    .body(String.class);
            return responseBody;
        } catch (Exception e) {
            return "查询天气失败：" + e.getMessage();
        }


    }
```

## 全自动

全自动的话就是需要使用到`mcp-security`模块，这个模块就是把`Spring-Security`的思维使用到了MCP中，用`Spring-Security`的方式来鉴权，核心就是`@PreAuthorize`注解

### 客户端

啊啊啊啊啊，无解了，试了一下午，自动配置始终有问题，要么就是获取不到token，暂时先不写了，后面发现问题了把全自动注入再补上
