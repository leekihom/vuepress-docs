---
title: Redis分布式锁
date: 2023-03-22
breadcrumb: false
pageInfo: false
category:
- Redis
tag:
- 分布式锁
sticky: 2023-03-22
---

## 前言

之前写了关于[Redis中的缓存击穿，缓存雪崩，缓存穿透](./Redis中的缓存击穿，缓存雪崩，缓存穿透.md)的文章中，提到了分布式的情况下如果需要加锁就需要使用`分布式锁`，于是填坑来了😅

## 什么是分布式锁

对于一些数据安全要求较高的应用，我们在进行数据访问处理的时候，需要让线程依次排起队处理，不然就会出现数据的错误，如果是单机应用我们可以使用`Snchronized`和`ReentrantLock`来实现并发操作，但是在分布式应用不可行，因为分布式应用是将应用散列分布在不同机器上面的，不是在同一个`JVM`中，所以就会导致原有的锁策略失效，于是就需要引用一个全局的，大叫都可以使用的锁，这个就是分布式锁

## 分布式锁的实现方式

对于实现一个分布式锁，常见的方式有三种：
- 基于数据库的分布式锁
- 基于缓存的分布式锁
- 基于`Zookeeper`的分布式锁

### 基于数据库的分布式锁实现

这个很好理解，核心思想就是在数据库中新建一张表用来存储锁信息，当我们需要获取锁的时候，就向表中插入(或者更新)数据，这个时候如果其他线程去尝试获取锁的时候，就会去数据库中操作数据，当它发现操作不成功的时候就清楚当前资在被其他线程使用，这个操作可以是插入或者更新，这就需要我们在建表的时候加上唯一索引，当插入或者更新的操作返回值为0时就说明操作失败了，并且需要对操作加上`事务`保证操作的原子性

**缺点：**因为是基于数据库的所以对于数据库的高可用和性能会有要求，如果没有进行限流处理，在遭到缓存雪崩时，这个时候锁就会迟迟获取不到，并且数据库锁不具备可重入性，因为数据被操作一次后，记录会一直存在，直到锁被释放之前，`任何线程`都不可以再次获取

### 基于Redis的分布式锁

Redis的分布式锁是主流的方案，因为Redis的性能较高，所以在高并发分布式的场景下能够更快的处理锁数据，使用`RedisTemplate`来实现一个简单的分布式锁，在[Redis中的缓存击穿，缓存雪崩，缓存穿透](./Redis中的缓存击穿，缓存雪崩，缓存穿透.md)已经操作过了，这次我们需要使用的就是`Redission`来实现分布式锁

- 配置类
```java
@Configuration
public class RedissonConfig {

    @Value("${redis.host}")
    private String redisHost;

    @Value("${redis.password}")
    private String password;

    @Value("${redis.host}")
    private String host;

    @Value("${redis.port}")
    private String port;

    @Bean
    public RedissonClient getRedisson() {
        Config config = new Config();
        config.useSingleServer().
                setAddress("redis://" + host + ":" + port).
                setPassword(password);
        return Redisson.create(config);
    }

}
```

- 业务使用

```java
    @Resource
    private RedissonClient  redissonClient;


    public void lock(){
        RLock rLock = redissonClient.getLock("lockName");

        try {
            boolean flag = rLock.tryLock(100, TimeUnit.SECONDS);
            if (flag){
                //TODO 获取锁，处理业务
            }
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }finally {
            //释放锁
            rLock.unlock();
        }
    }

```

当然，我们还可以自己将`redissonClient`的方法再次封装

**缺点：**当然Redis分布式锁也不是完美的，如果在Redis主从复制的时候，`master`宕机之后，主备切换，`slave`变为`master，`其他的线程此时对同一个资源加锁，因为数据没有同步完成，其他的线程也是能够加锁成功



### 基于Zookeeper的分布式锁

ZooKeeper是一个为分布式应用提供一致性服务的开源组件，它内部是一个分层的文件系统目录树结构，规定同一个目录下只能有一个唯一文件名。基于ZooKeeper实现分布式锁的步骤如下：

- 创建一个目录lock；
- 线程A想获取锁就在lock目录下创建临时顺序节点；
- 获取lock目录下所有的子节点，然后获取比自己小的兄弟节点，如果不存在，则说明当前线程顺序号最小，获得锁；
- 线程B获取所有节点，判断自己不是最小节点，设置监听比自己次小的节点；
- 线程A处理完，删除自己的节点，线程B监听到变更事件，判断自己是不是最小的节点，如果是则获得锁。

**缺点：**需要频繁删除和创建节点，性能比Redis稍差


## 总结

对于开发人员来说，使用Redisson感觉是比较简单的方式，但是每种方式都有优缺点，总之选择符合实际业务需求的就可以了，这次只了解了基础的使用，后面再来讲理论原理😂