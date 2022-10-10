---
title: Stream流
date: 2022-09-28
breadcrumb: false
pageInfo: false
category:
- Java
tag:
- Java 8
- Stream
---

## 前言
在Java8中引入了许多新的特性，其中Stream流就是最重要的特性之一，它配合上Lambda表达式能极大地简化对批量数据的处理，在优雅地处理数据的同时也能够也能够减少代码的数量，不仅在实用性也在简洁性上得到巨大的改变。

## Stream操作
Stream的操作一般就是创建流，处理流数据，终止或输出。  

- 开始管道  
主要负责创建流，可以是新创建流也可以是基于原本存在的集合对象来创建。

|  API   | 功能说明  |
|  ----  | ----  |
| stream()  | 创建出一个新的stream串行流对象 |
| parallelStream()| 创建出一个可并行执行的stream流对象 |
| Stream.of()|通过给定的一系列元素创建一个新的Stream串行流对象|
