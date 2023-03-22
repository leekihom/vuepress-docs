#### 进入容器内部

docker exec [OPTIONS] CONTAINER COMMAND [ARG...]
docker exec: 进入容器内部，执行一个命令
[OPTIONS]: 
-d :分离模式: 在后台运行
-i :即使没有附加也保持STDIN 打开
-t :分配一个伪终端

CONTAINER：容器的名字
COMMAND:需要使用终端交互命令

ex: docker exec -it mycontainer bash


####  数据卷

**挂载数据卷**: 
docker run --name 容器名 -p 8080:8080 -v 主机目录:容器目录内 -d 镜像名

docker run --name 容器名 -p 8080:8080 -v 主机目录:容器目录内

#### Dockerfile
