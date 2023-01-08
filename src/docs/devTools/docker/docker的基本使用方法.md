---
title: docker的基本使用方法
date: 2023-01-06
breadcrumb: false
pageInfo: false
category:
- Docker
tag:
- Docker
- 容器技术
---
## 前言
最近没事搞了一下微信的公众号的开发，简单的实现了一个[微信每日推送](../../others/微信公众号实现每日推送)，因为害怕在部署的时候干扰其他服务同时也想着学习一下于是使用了Docker来部署，由此为引把一些常用的Docker操作和一些问题汇总记录，以便后面自己随时查阅。

## 基础的操作

### 安装
 
windows: 如果是使用windows安装Docker本地调试的话只需要在Docker的[官网](https://www.docker.com/)下载安装包就可以了

linux: 我们使用Docker的场景大多数使用在linux服务器上的，根据官网的[Docker Engine](https://docs.docker.com/engine/install/centos/)安装操作就可以了

### Dockerfile

Dockerfile就是我们用来构建镜像的指令和说明，比如我们部署java项目多数时候就是使用jar包来部署，这时我们就需要为jar的部署构建空间，首先需要的就是jdk，然后就需要启动指定`java -jar XXX.jar`之类的启动指令
```yml
# 拉取jdk8作为基础镜像
FROM openjdk:8
# 作者
MAINTAINER leezihong
# 添加时区环境变量，亚洲，上海
ENV TimeZone=Asia/Shanghai
# 使用软连接，并且将时区配置覆盖/etc/timezone
RUN ln -snf /usr/share/zoneinfo/$TimeZone /etc/localtime && echo $TimeZone > /etc/timezone
# 添加jar到镜像并命名为wechatpush.jar
ADD wechatpush.jar wechatpush.jar
# 镜像启动后暴露的端口
EXPOSE 8081
# jar运行命令，参数使用逗号隔开
ENTRYPOINT ["java","-jar","wechatpush.jar"]

```

`FROM`: 就是指定我们构建什么样的镜像环境，可以使用`docker search 镜像名`来查询Docker Hub是否存在你需要的镜像

`ENV`: 设置环境变量，使用KEY-VALUE的方式来指定

`RUN`：用来执行后面跟着的指令

`ADD`: 将文件添加到docker的容器中

`EXPOSE`: 将容器中运行程序的端口号映射到指定的端口

`ENTRYPOINT`: 个人理解为就是在容器中使用类似CMD的命令，我们启动jar包，就是使用`java`命令来启动






## 参考


