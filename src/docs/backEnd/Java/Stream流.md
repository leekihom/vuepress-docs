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
sticky: 2022-09-28
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

- 中间管道  
中间管道就是进行数据处理并返回一个新的Stream对象，中间管道的处理可以叠加。

|  API   | 功能说明  |
|  ----  | ----  |
| filter()  | 按照条件过滤符合要求的元素， 返回新的stream流 |
| map() | 将已有元素转换为另一个对象类型，一对一逻辑，返回新的stream流 |
| flatMap() | 将已有元素转换为另一个对象类型，一对多逻辑，即原来一个元素对象可能会转换为1个或者多个新类型的元素，返回新的stream流 |
| limit() | 仅保留集合前面指定个数的元素，返回新的stream流 |
| skip() | 跳过集合前面指定个数的元素，返回新的stream流 |
| concat() | 将两个流的数据合并起来为1个新的流，返回新的stream流 |
| distinct() | 对Stream中所有元素进行去重，返回新的stream流 |
| sorted() | 对stream中所有的元素按照指定规则进行排序，返回新的stream流 |
| peek() | 对stream流中的每个元素进行逐个遍历处理，返回处理后的stream流 |

- 终止管道
  数据处理完成后Stream流结束，此时可以进行数据输出或者进行其他逻辑的处理。一旦Stream被执行了终止操作之后，就不能够再进行其他的操作了。

|  API   | 功能说明  |
|  ----  | ----  |
| count() | 返回stream处理后最终的元素个数 |
| max() | 返回stream处理后的元素最大值 |
| min() |返回stream处理后的元素最小值|
| findFirst()|找到第一个符合条件的元素时则终止流处理|
| findAny()| 找到任何一个符合条件的元素时则退出流处理，这个对于串行流时与findFirst相同，对于并行流时比较高效，任何分片中找到都会终止后续计算逻辑 |
| anyMatch()|返回一个boolean值，类似于isContains(),用于判断是否有符合条件的元素|
| allMatch() |返回一个boolean值，用于判断是否所有元素都符合条件 |
| noneMatch() |返回一个boolean值， 用于判断是否所有元素都不符合条件|
| collect() |将流转换为指定的类型，通过Collectors进行指定toArray()将流转换为数组|
| iterator() |将流转换为Iterator对象foreach()无返回值，对元素进行逐个遍历，然后执行给定的处理逻辑|


## Stream的部分方法使用

### map与flatmap
- `map`必须是一对一的，即一个元素只能转换为一个元素
- `flatmap` 可以是一对多的，即一个元素可以转换为多个元素， `flatmap`将每个元素返回为一个新的Stream，最后将所有的Stram合并为一个Stream来输出
![20221015111123](https://blog-1253887276.cos.ap-chongqing.myqcloud.com/vscodeblog/20221015111123.png)

将Integer集合转为String集合
```java :no-line-numbers
@Test
    public void IntegerToString(){
        List<Integer> integerList = Arrays.asList(1,2,3,4,5,6);
        List<String> stringList = integerList.stream()
                .map(item -> Integer.toString(item.intValue()))
                .collect(Collectors.toList());
        System.out.println(stringList.get(0).getClass());
    }

```
flatmap分词，将连个单词分为单个字母
```java :no-line-numbers
@Test
    public void WordsToLetters(){
        List<String> words = Arrays.asList("Hello","World");
        List<String> letters = words.stream()
                .flatMap(item -> Arrays.stream(item.split("")))
                .collect(Collectors.toList());
        letters.forEach(System.out::println);
    }

```

### peek与foreach
peek和foreach都是遍历元素并且逐个处理，但是peek为中间管道，foreach为终止管道，在调用终止方法之前，peek是不会执行任何的操作，但是foreach为终止管道，它可以直接执行

```java :no-line-numbers
@Test
    public void peekAndForeach(){
        List<String> list = Arrays.asList("this","is","a","exa");
        System.out.println("------peek before------");
        list.stream().peek(System.out::println);
        System.out.println("------peek after------");
        System.out.println("------foreach before------");
        list.stream().forEach(System.out::println);
        System.out.println("------foreach after------");
        System.out.println("------peek and foreach------");
        list.stream().peek(System.out::println)
                .collect(Collectors.toList());
    }

```
![20221015113430](https://blog-1253887276.cos.ap-chongqing.myqcloud.com/vscodeblog/20221015113430.png)

### 其他的常用方法
map将数据的类型进行转换，filter按条件过滤数据，sorted排序，distinct去重，limit取前面的n个元素，最后使用collect转换数据。

```java :no-line-numbers
@Test
    public void otherTest() {
        List<String> list = Arrays.asList("205","10","308","49","627","193","111", "193","308","193");
        List<Integer> newList = list.stream()
                .map(Integer::valueOf)
                .filter(item -> item> 70)
                .sorted(Comparator.comparingInt(s -> s))
                .distinct()
                .limit(4)
                .collect(Collectors.toList());
        System.out.println(newList);
    }
```

### 结果收集方法
collect用于结果的收集，它接受`集合`，`StringBuilder对象`等。。。，

```java :no-line-numbers
@Test
    public void toCollector(){
        List<User> users = Arrays.asList(new User("啊哈"),new User("嗯哼"),new User("哈哈"));
        String user = users.stream()
                .map(User::getName)
                .collect(Collectors.joining(",","(",")"));
        System.out.println(user);
    }


```
## 并行流

并行流可以将原本的单个Stream划分为多个片段，然后对各个片段进行处理，最后将每个片段的运行结果汇总为一个整体流，如何例如下面的代码，因为是并行的，所以输出的结果是没有顺序的，如何要有序输出可以将`forEach`换成`forEachOrdered`。
``` java :no-line-numbers
@Test
    public void parallelStreamExample(){
        List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5, 6, 7, 8, 9);
        numbers.parallelStream()
                .forEach(System.out::println);
    }
```
![20221015155714](https://blog-1253887276.cos.ap-chongqing.myqcloud.com/vscodeblog/20221015155714.png)


## 总结

这里只是简单介绍了一些Stream的常用的使用方法，当然还是有很多不完善，还是一句话，慢慢填坑。
Stream的有点很明显，简洁明了，代码优雅，但是缺点也很明显，Debug很不友好，开发一时爽，运维火葬场。