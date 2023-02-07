---
title: Spring Cloud入门之OpenFeign篇
date: 2022-09-17
breadcrumb: false
pageInfo: false
category:
- Spring Cloud
tag:
- Spring Cloud
- 微服务
- OpenFeign
---

## 前言

上一篇《[Spring Cloud入门之Ribbon篇](Spring%20Cloud入门-Ribbon篇.md)》中使用了Ribbon来进行服务调用，但是在请求的时候需要自己拼接请求的URL，显然这种方式不太实用，如果服务名字更改了，那么消费端的代码也需要跟着修改。  
所以引入`Feign`来解决这个问题