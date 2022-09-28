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


## 定义一个异常处理类
`@RestControllerAdvice`注解就是将`@ControllerAdvice`+`@ResponseBody`的集合体，将类注册为一个异常处理类并且使用JSON格式返回响应。  
