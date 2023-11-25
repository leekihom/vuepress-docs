---
title: SpringBoot动态定时任务
date: 2022-09-26
breadcrumb: false
pageInfo: false
category: 
- SpringBoot
tag: 
- 定时任务
sticky: 2022-09-26
---

## 前言
在实际需求中经常会使用到定时任务，在java中有一个比较出名的定时任务框架 [Quatrz](http://www.quartz-scheduler.org/) ,哈哈，Quatrz还没怎么接触过，又埋了一个坑。这次只整理在sprinboot下如何使用注解来实现定时任务，以及动态定时任务。

## 启动类
首先创建springbooot项目，然后在启动类上面添加`@EnableScheduling`，但看注解名字就可以理解，此注解能够开启执行计划任务。

``` java :no-line-numbers
@SpringBootApplication
@EnableScheduling
public class EnableSchedulingApplication {

    public static void main(String[] args) {
        SpringApplication.run(EnableSchedulingApplication.class, args);
    }

}
```
## 创建一个定时类 Jobs
创建一个定时类，将其注册成为一个组件，再使用`@Scheduled`来开启定时任务的类型。
- cron：使用[cron](http://cron.ciding.cc/)表达式来执行定时任务
- fixedDelay：执行完成后再间隔多久执行
- fixedRate：每隔多久再次执行
- fixedDelayString：和fixedDelay一样，但是支持字符串格式和配置文件中的参数

```java :no-line-numbers
@Component
public class Jobs {
    //表示方法执行完成后5秒
    @Scheduled(fixedDelay = 5000)
    public void fixedDelayJob() throws InterruptedException {
        System.out.println("fixedDelay 每隔5秒执行" + new Date());
    }

    //表示每隔3秒
    @Scheduled(fixedRate = 3000)
    public void fixedRateJob() {

        System.out.println("fixedRate 每隔3秒执行" + new Date());
    }

    //每10秒执行一次
    @Scheduled(cron = " 0/10 * * * * ? ")
    public void cronJob() {
        System.out.println("每隔10秒执行一次======"+new Date());
    }
}
``` 
![20221007155824](https://blog-1253887276.cos.ap-chongqing.myqcloud.com/vscodeblog/20221007155824.png)

## 动态定时任务
在上面简单使用了`@Scheduled`来创建定时任务，但是有个问题，定时任务有可能会更改执行频率，需求更改时我们希望最好不要动代码，于是就要使用Spring中的`ScheduledTaskRegistrar`了

创建一个动态定时任务类，这里我使用了jpa来创建数据库和Lombok，需要在pom中加入相关依赖。
先继承SchedulingConfigurer定时任务配置类，重写configureTasks，使用addTriggerTask来修改任务。
```java :no-line-numbers
@Data
@Slf4j
@Component
public class ScheduleTask implements SchedulingConfigurer {

    @Value("${printTime-cron}")
    private String cron;

    @Override
    public void configureTasks(ScheduledTaskRegistrar taskRegistrar) {

        taskRegistrar.addTriggerTask(
                () -> log.info("Current time： {}", LocalDateTime.now()),
                triggerContext -> {
                    return new CronTrigger(cron).nextExecutionTime(triggerContext);
                });
    }
}

```

## 使用配置类来修改定时任务类

在实际中更多的是，我们有一个后台，用来管理和调度任务，那么就需要实现在每次后台修改后刷新任务的执行频率。

``` java :no-line-numbers

@Table(name = "config")
@Entity
@Data
public class configEntity {

    @Id
    private Long id;

    private String cron_expression;

    private String cron_description;

}
```

创建一个测试的controller测试一下,每次修改后就会刷新核心，给ScheduleTask赋值新的指令。这样就可以实现修改之后下次调度就会使用新的指令来执行定时任务。

``` java :no-line-numbers
@Slf4j
@RestController
@RequestMapping("/test")
public class TestController {

    private final ScheduleTask scheduleTask;

    @Autowired
    private configRepository configRepository;

    @Autowired
    public TestController(ScheduleTask scheduleTask) {
        this.scheduleTask = scheduleTask;
    }

    @PostMapping ("/updateCron")
    public String updateCron(String cron) {
        log.info("new cron :{}", cron);
        scheduleTask.setCron(cron);
        return "ok";
    }

    @GetMapping("/config/{id}")
    public ResponseEntity modifyConfig(@RequestParam("id") Long id){
        this.updateConfig(id);
        return ResponseEntity.ok().body(id);
    }

    public ResponseEntity updateConfig(Long id){
        Optional<configEntity> configEntity = configRepository.findById(id);
        String cron = configEntity.get().getCron_expression();
        scheduleTask.setCron(cron);
        log.info("新的 cron :{}", cron);
        return ResponseEntity.ok().body(cron);
    }

    @PostMapping("/save")
    public ResponseEntity save(@RequestBody configEntity configEntity) {

        return this.updateConfig(configRepository.save(configEntity).getId());
    }
}

```

## 总结
其实动态定时任务就是需要使用`ScheduledTaskRegistrar`来配置定时任务，好像还有方法是修改调度机制后立即执行，不会等到此次任务执行完才执行，后面补坑。


