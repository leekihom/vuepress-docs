---
title: 如何优雅的去掉if-else
date: 2023-12-10
breadcrumb: false
pageInfo: false
category:
- 策略模式
- 反射
tag:
- 策略模式
- 反射
sticky: 2023-12-10
---

## 前言

最近都在不停的CRUD，属实很难，想着自己的编码风格属实需要提高，同时也感觉自己应该尝试一下在写代码时，尝试一下使用新的方式来`优化`自己的代码

因为最近在做一个数据统计的需求，需要根据不同的类型去统计数据，因为有两个地方需要的是相同的数据，所以就想着把每个数据都写成一个方法，并且也是因为每个数据的统计规则不同，那么问题来了，核心数据统计直接每个方法都执行，然后取出数据就好了，但是统计图的显示就需要判断，获取的是哪个数据

![20231210172723](https://blog-1253887276.cos.ap-chongqing.myqcloud.com/vscodeblog/20231210172723.png)![20231210172835](https://blog-1253887276.cos.ap-chongqing.myqcloud.com/vscodeblog/20231210172835.png)

## 方案

### if-else

最为常用的方式就是if-else了，这种方式也有优点就是简单易读，if-else可谓是从我们刚开始学习编程就开始接触，这也是所有判断最简单，最常用的，可读性也是很强的，缺点就是看起来不太`高级`并且会让代码看起来很“冗余”，这种方式只需要每次判断一下请求的类型，然后进行相应的处理就行了

### 策略模式

抽象一个策略接口

```java

public interface TaskStrategy {

    String getMode();
    void doAction();
}

```

然后使用一个统一的入口来管理策略，`taskStrategyList`这里就是存放的所有实现了策略接口的具体策略，我们，使用`@Autowired`将所有的具体策略注入到集合中

```java

@Component
public class TaskContext {

    private final Map<String, TaskStrategy> strategyMap = new ConcurrentHashMap<>();


    @Autowired
    public TaskContext(List<TaskStrategy> taskStrategyList){
        for (TaskStrategy taskStrategy : taskStrategyList) {
            strategyMap.put(taskStrategy.getMode(),taskStrategy);
        }
    }

    public void executeStrategy(String mode){
        TaskStrategy strategy = this.strategyMap.get(mode);
        if (strategy == null){
            throw new RuntimeException("策略为空");
        }
        strategy.doAction();
    }
}

```

然后在具体需要使用策略的地方来进行调用对应的策略就可以了，这里可以使用`HashMap`来搭配使用

```java

 private static Map<String, Method> methodMap = new HashMap<>();

    @Override
    public void afterPropertiesSet() throws Exception {
        methodMap = initializeMethodMap();
    }

    public Map<String, Method> getMethodMap() {
        return methodMap;
    }

    private Map<String, Method> initializeMethodMap() {
        Map<String, Method> map = new HashMap<>();
        try {
            map.put("MODE", new TaskStrategyService());
            ...
            ... 
        } catch (NoSuchMethodException e) {
            e.printStackTrace();
        }
        return map;
    }

```

根据传入的`mode`类型来获取对应的方法就行了

### Map+反射

Map+反射，也是我最后采用的方式，因为接口里面的内容并不复杂，懒得为了实现策略模式而新建及格类，所以就是直接为每个接口的实现单独抽象了方法，然后维护了一张方法的执行表就行了

这里需要注意，`afterPropertiesSet()`需要方法实现`InitializingBean`接口，因为我是在实现类中操作的，所以我需要在接口注入时，初始化表的数据

```java

    private static Map<String, Method> methodMap = new HashMap<>();

    @Override
    public void afterPropertiesSet() throws Exception {
        methodMap = initializeMethodMap();
    }

    public Map<String, Method> getMethodMap() {
        return methodMap;
    }

    private Map<String, Method> initializeMethodMap() {
        Map<String, Method> map = new HashMap<>();
        try {
            map.put("amountTotal", this.getClass().getMethod("getAmountTotal", Long.class, Date.class, Date.class, Integer.class));
            map.put("ordersTotal", this.getClass().getMethod("getOrdersTotal", Long.class, Date.class, Date.class, Integer.class));
            map.put("buyerTotal", this.getClass().getMethod("getBuyerTotal", Long.class, Date.class, Date.class, Integer.class));
            map.put("forceTax", this.getClass().getMethod("getForceTax", Long.class, Date.class, Date.class, Integer.class));
            map.put("visitUsers", this.getClass().getMethod("getVisitUsers", Long.class, Date.class, Date.class, Integer.class));
            map.put("visitTotal", this.getClass().getMethod("getVisitTotal", Long.class, Date.class, Date.class, Integer.class));
            map.put("newBuyerTotal", this.getClass().getMethod("getNewBuyerTotal", Long.class, Date.class, Date.class, Integer.class));
            map.put("refundAmount", this.getClass().getMethod("getRefundAmount", Long.class, Date.class, Date.class, Integer.class));
            map.put("newMemberTotal", this.getClass().getMethod("getNewMemberTotal", Long.class, Date.class, Date.class, Integer.class));
            map.put("newSaleTotal", this.getClass().getMethod("getNewSaleTotal", Long.class, Date.class, Date.class, Integer.class));
        } catch (NoSuchMethodException e) {
            e.printStackTrace();
        }
        return map;
    }


```

然后根据前端传入的查询类型来表中查询出对应的方法，并且使用反射来执行就可以了

```java

Method method = getMethodMap().get(vo.getDataType());
String value = method.invoke(this,mbrId,startTime,_endTime,vo.getType()).toString();

```

### 总结

emmmmmm...我自己平常使用的就是这三种，当然肯定不止这几种方式，其实核心都是一样的，需要一个地方来判断需要具体执行哪部分代码，然后执行就行。

还看到有使用函数式接口来实现，过两天补上剩下的几种方法





