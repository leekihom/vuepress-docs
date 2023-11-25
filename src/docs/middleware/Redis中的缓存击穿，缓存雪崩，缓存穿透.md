---
title: Redis中的缓存击穿，缓存雪崩，缓存穿透
date: 2023-03-22
breadcrumb: false
pageInfo: false
category:
- Redis
tag:
- Redis
- 缓存
sticky: 2023-03-22
---


## 前言

最近学习了一个分布式的秒杀系统，其中大量的使用了`Redis`来做缓存，对于分布式系统基本都会使用`Redis`来缓存数据和做一个分布式的锁，在做缓存的时候时候最常见的就是`缓存击穿`，`缓存雪崩`,`缓存穿透`这几个问题，于是就查了一下资料，补齐了这部分的知识空缺

## 缓存雪崩

缓存雪崩是指大量的请求没有在Redis缓存中得到处理，从而导致请求都涌入到数据库中，导致数据库的压力剧增

引起雪崩的原因可以总结为2个：
- 短时间内大量的数据失效，请求无法命中于是向数据库中进行请求
- 缓存服务器宕机

### 解决办法

- 对于缓存服务宕机可以使用Redis集群的方式实现服务的高可用
- 对缓存业务实现服务的降级限流，进行负载能力的控制
- 将原有的缓存过期时间进行散列分布，不让其在同一个时间段集体失效
- 设置多级缓存`(Guava Cache)`，当`Redis`失效后还可以去下级缓存中查询，不直接去数据库中查询
- 加锁排队请求


## 缓存穿透

缓存穿透是指请求的数据在缓存和数据库中都不存在，所以每次在缓存中都不会命中，于是每次都向数据库请求

导致缓存穿透的原因通常为2中：
- 异常数据或者是数据被删除，导致数据一直无法被命中
- 恶意的请求
  
### 解决办法

- 缓存空数据，缓存未命中的时候去数据库查询，此时如果查询不到值的话就缓存一个空值的key，下次直接在缓存中返回空值
- 布隆过滤器(留坑😀)



## 缓存击穿

缓存击穿和缓存雪崩类似，只不过缓存击穿是部分数据失效，大量的请求需要读取部分数据，但是这部分数据失效了，所以导致请求全部涌入数据库

### 解决办法

- 使用互斥锁，来排队请求
- 为数据设置永不过期(逻辑过期)

#### 互斥锁

如果是分布式应用，就需要使用分布式锁

```java

/**
     * 尝试获取锁
     * @param s
     * @return
     */
    public boolean tryLock(String s){

        Boolean flag = redisTemplate.opsForValue().setIfAbsent(key, keyValue, 10, TimeUnit.SECONDS);
        return Boolean.TRUE.equals(flag);
    }

    /**
     * 删除锁
     * @param s
     */
    public void unlock(String s){
        redisTemplate.delete(key);
    }

    public String queryString(String key){
        /**
         * 缓存未命中
         */
        boolean flag = tryLock(key);
        try {
            if(flag){
                /**
                 * 获获取锁，再次检查缓存是否存在数据，不存在则排队请求，重建缓存
                 */
                
            }
        }catch (Exception e){
            e.printStackTrace();
        }finally {
            /**
             * 释放锁
             */
            unlock(key);
        }

        return "";
    }

```

#### 逻辑过期

在数据中添加一个字段，设置数据的过期时间，如果数据在缓存中命中了数据，根据过期时间字段来判断是否过期，未过期就直接使用，如果过期就重建缓存。
```java

private static final ExecutorService executor = Executors.newFixedThreadPool(10);


    /**
     * 新开线程，重建缓存
     */
    public void db2redis(){
        if(tryLock("key")){
            executor.submit(() -> {
                /**
                 * TODO 缓存重建
                 */
            });
        }

    }

```


## 总结

`缓存雪崩`,`缓存穿透`,`缓存击穿`问题的根本都是需要解决数据库的短时大量访问涌入的问题，在大量请求访问数据库时，核心就是需要降低进入数据库的请求数量，加锁，限流都可以使用。  
这里加锁的方案只针对单体应用，如果是分布式应用则需要使用[分布式锁](./Redis分布式锁.md)