---
title: IO基础知识
date: 2022-05-21
breadcrumb: false
pageInfo: false
category:
- Java
- IO
tag:
- IO流
- 基础知识
---

## 前言
偶然看到之前学习时写的基础知识的笔记，于是就复习了一遍  

![20220919095059](https://blog-1253887276.cos.ap-chongqing.myqcloud.com/vscodeblog/20220919095059.png)
![20220919095111](https://blog-1253887276.cos.ap-chongqing.myqcloud.com/vscodeblog/20220919095111.png)



## IO流分类

按照数据流向：**输入流**和**输出流**  
按照处理数据的单位：**字节流**和**字符流**，在java中，字节是占1个Byte，即8位；而字符是占2个Byte，即16位。而且，需要注意的是，java的字节是有符号类型，而字符是无符号类型！  
字节流的抽象基类：  
　　**InputStream，OutputStream**  
字符流的抽象基类：  
　　**Reader，Writer**

## 字符流

### Writer：字符输出流
![20220919095441](https://blog-1253887276.cos.ap-chongqing.myqcloud.com/vscodeblog/20220919095441.png)

Writer append(char c) 将指定的字符附加到此Writer  
Writer append(CharSequence csq) 将指定的字符序列附加到此Writer  
Writer append(CharSequence csq, int start, int end) 将指定字符序列的子序列附加到此Writer  
abstract void close() 关闭流，先刷新  
abstract void flush() 刷新流  
void write(char[] cbuf) 写入一个字符数组  
abstract void write(char[] cbuf, int off, int len) 写入字符数组的一部分  
void write(int c) 写一个字符  
void write(String str) 写一个字符串  
void write(String str, int off, int len) 写一个字符串的一部分  

#### FileWriter
**FileWriter的构造方法**  
OutputStreamWriter(OutputStream out) 创建一个使用默认字符编码的OutputStreamWriter  
OutputStreamWriter(OutputStream out, String charsetName) 创建一个使用命名字符集的OutputStreamWriter  
OutputStreamWriter(OutputStream out, Charset cs) 创建一个使用给定字符集的OutputStreamWriter  
OutputStreamWriter(OutputStream out, CharsetEncoder enc) 创建一个使用给定字符集编码器的OutputStreamWriter  

**FileWriter的方法列表**
Writer append(CharSequence csq) 将指定的字符序列附加到此Writer  
Writer append(CharSequence csq, int start, int end) 将指定字符序列的子序列附加到此Writer  
void close() 关闭流，先刷新  
void flush() 刷新流  
String getEncoding() 返回此流使用的字符编码的名称  
void write(char[] cbuf, int off, int len) 写入字符数组的一部分  
void write(int c) 写一个字符  
void write(String str, int off, int len) 写一个字符串的一部分  

#### BufferedWriter

缓冲字符输出流。提高文件写入的效率。ps：将需要写入的字符先缓冲到一个数组中，然后等到缓冲区数据满后，直接一次性写入，和读取一个字符写入一个字符相比效率更高。  
**构造方法**  
BufferedWriter(Writer out) 创建使用默认大小的输出缓冲区的缓冲字符输出流。  
BufferedWriter(Writer out, int sz) 创建一个新的缓冲字符输出流，使用给定大小的输出缓冲区。  
**BufferedWriter的方法列表**  
void close() 关闭流，先刷新。  
void flush() 刷新流。  
void newLine() 写一行行分隔符。  
void write(char[] cbuf, int off, int len) 写入字符数组的一部分。  
void write(int c) 写一个字符  
void write(String s, int off, int len) 写一个字符串的一部分。  

#### CharArrayWriter  
CharArrayWriter用于写入字符，操作的数据是以字符为单位  
**构造函数**  
CharArrayWriter() 创建一个新的CharArrayWriter。  
CharArrayWriter(int initialSize) 用指定的初始大小创建一个新的CharArrayWriter。  
**方法列表**  
CharArrayWriter append(char c) 将指定的字符附加到此作者。  
CharArrayWriter append(CharSequence csq) 将指定的字符序列附加到此作者。  
CharArrayWriter append(CharSequence csq, int start, int end) 将指定字符序列的子序列附加到此作者。  
void close() 关闭流。  
void flush() 冲洗流。  
void reset() 重置缓冲区，以便您可以再次使用它，而不会丢弃已经分配的缓冲区。  
int size() 返回缓冲区的当前大小。  
char[] toCharArray() 返回输入数据的副本。  
String toString() 将输入数据转换为字符串。  
void write(char[] c, int off, int len) 将字符写入缓冲区。  
void write(int c) 将一个字符写入缓冲区。  
void write(String str, int off, int len) 将一部分字符串写入缓冲区。  
void writeTo(Writer out) 将缓冲区的内容写入另一个字符流。  

#### FilterWriter

字符类型的过滤输出流  
**构造函数**  
protect FilterWriter(Writer out) 创建一个新的过滤的Writer  
**方法列表**  
void close() 关闭流，先刷新。   
void flush() 刷新流。   
void write(char[] cbuf, int off, int len) 写入字符数组的一部分。   
void write(int c) 写一个字符  
void write(String str, int off, int len) 写一个字符串的一部分。  

#### PrintWriter

PrintWriter 是字符类型的打印输出流，它继承于Writer。  
**构造函数**  
PrintWriter(File file) 使用指定的文件创建一个新的PrintWriter，而不需要自动的线路刷新。  
PrintWriter(File file, String csn) 使用指定的文件和字符集创建一个新的PrintWriter，而不需要自动进行线条刷新。  
PrintWriter(OutputStream out) 从现有的OutputStream创建一个新的PrintWriter，而不需要自动线路刷新。  
PrintWriter(OutputStream out, boolean autoFlush) 从现有的OutputStream创建一个新的PrintWriter。 
PrintWriter(Writer out) 创建一个新的PrintWriter，没有自动线路冲洗。  
PrintWriter(Writer out, boolean autoFlush) 创建一个新的PrintWriter。  
PrintWriter(String fileName) 使用指定的文件名创建一个新的PrintWriter，而不需要自动执行行刷新。  
PrintWriter(String fileName, String csn) 使用指定的文件名和字符集创建一个新的PrintWriter，而不需要自动线路刷新。  
**方法列表**  
PrintWriter append(char c) 将指定的字符附加到此Writer。   
PrintWriter append(CharSequence csq) 将指定的字符序列附加到此Writer。  
PrintWriter append(CharSequence csq, int start, int end) 将指定字符序列的子序列附加到此Writer。   
boolean checkError() 如果流未关闭，请刷新流并检查其错误状态。   
protected void clearError() 清除此流的错误状态。  
void close() 关闭流并释放与之相关联的任何系统资源。  
void flush() 刷新流。  
PrintWriter format(String format, Object... args) 使用指定的格式字符串和参数将格式化的字符串写入此写入程序。  
PrintWriter format(Locale l, String format, Object... args) 使用指定的格式字符串和参数将格式化的字符串写入此写入程序。  
void print(boolean b) 打印布尔值。  
void print(char c) 打印一个字符  
void print(char[] s) 打印字符数组。  
void print(double d) 打印双精度浮点数。  
void print(float f) 打印浮点数。  
void print(int i) 打印一个整数。  
void print(long l) 打印一个长整数。  
void print(Object obj) 打印一个对象。  
void print(String s) 打印字符串。  
PrintWriter printf(String format, Object... args) 使用指定的格式字符串和参数将格式化的字符串写入该writer的方便方法。  
PrintWriter printf(Locale l, String format, Object... args) 使用指定的格式字符串和参数将格式化的字符串写入该writer的方便方法。  
void println() 通过写入行分隔符字符串来终止当前行。  
void println(boolean x) 打印一个布尔值，然后终止该行。  
void println(char x) 打印一个字符，然后终止该行。  
void println(char[] x) 打印字符数组，然后终止行。  
void println(double x) 打印双精度浮点数，然后终止行。  
void println(float x) 打印一个浮点数，然后终止该行。  
void println(int x) 打印一个整数，然后终止该行。  
void println(long x) 打印一个长整型，然后终止行。  
void println(Object x) 打印一个对象，然后终止该行。  
void println(String x) 打印一个字符串，然后终止行。  
protected void setError() 表示发生错误。  
void write(char[] buf) 写入一个字符数组。  
void write(char[] buf, int off, int len) 写一个字符数组的一部分。  
void write(int c) 写一个字符  
void write(String s) 写一个字符串   
void write(String s, int off, int len) 写一个字符串的一部分。  

### Reader：字符输入流
![20220919095815](https://blog-1253887276.cos.ap-chongqing.myqcloud.com/vscodeblog/20220919095815.png)

abstract void close() 关闭流并释放与之相关联的任何系统资源。  
void mark(int readAheadLimit) 标记流中的当前位置。  
boolean markSupported() 告诉这个流是否支持mark（）操作。  
int read() 读一个字符  
int read(char[] cbuf) 将字符读入数组。  
abstract int read(char[] cbuf, int off, int len) 将字符读入数组的一部分。  
int read(CharBuffer target) 尝试将字符读入指定的字符缓冲区。  
boolean ready() 告诉这个流是否准备好被读取。  
void reset() 重置流。  
long skip(long n) 跳过字符  

#### FileReader

**构造方法**  
FileReader(File file) 创建一个新的 FileReader ，给出 File读取。  
FileReader(FileDescriptor fd) 创建一个新的 FileReader ，给予 FileDescriptor从中读取。  
FileReader(String fileName) 创建一个新的 FileReader ，给定要读取的文件的名称。  

#### BufferedReader

**构造方法**  
BufferedReader(Reader in) 创建使用默认大小的输入缓冲区的缓冲字符输入流。  
BufferedReader(Reader in, int sz) 创建使用指定大小的输入缓冲区的缓冲字符输入流。  
**方法列表**  
void close() 关闭流并释放与之相关联的任何系统资源。  
`Stream<String> lines()` 返回一个 Stream ，其元素是从这个 BufferedReader读取的行。  
void mark(int readAheadLimit) 标记流中的当前位置。  
boolean markSupported() 告诉这个流是否支持mark（）操作。  
int read() 读一个字符   
int read(char[] cbuf, int off, int len) 将字符读入数组的一部分。  
String readLine() 读一行文字。  
boolean ready() 告诉这个流是否准备好被读取。  
void reset() 将流重置为最近的标记。  
long skip(long n) 跳过字符   

## 字节流

字节流不仅可以操作字符，还可以操作其他媒体文件

### InputStream字节输入流

字节输入流的抽象类，是所有输入流的父类  
![20220919095843](https://blog-1253887276.cos.ap-chongqing.myqcloud.com/vscodeblog/20220919095843.png)

**常用方法**  
int available() 从下一次调用此输入流的方法返回可从该输入流读取（或跳过）的字节数，而不会阻塞。  
void close() 关闭此输入流并释放与流相关联的任何系统资源。   
void mark(int readlimit) 标记此输入流中的当前位置。   
boolean markSupported() 测试此输入流是否支持 mark和 reset方法。   
abstract int read() 从输入流读取数据的下一个字节。   
int read(byte[] b) 从输入流中读取一些字节数，并将它们存储到缓冲器阵列 b 。   
int read(byte[] b, int off, int len) 从输入流读取最多 len个字节的数据到字节数组。   
byte[] readAllBytes() 从输入流读取所有剩余字节。   
int readNBytes(byte[] b, int off, int len) 将所请求的字节数从输入流读入给定的字节数组。   
void reset() 将此流重新定位到最后在此输入流上调用 mark方法时的位置。   
long skip(long n) 跳过并丢弃来自此输入流的 n字节的数据。   
long transferTo(OutputStream out) 从该输入流中读取所有字节，并按读取的顺序将字节写入给定的输出流。   

#### FileInputStream

##### 构造方法

FileInputStream(File file) 通过打开与实际文件的连接来创建一个 FileInputStream ，该文件由文件系统中的 File对象 file命名。   
FileInputStream(FileDescriptor fdObj) 通过使用文件描述符 fdObj创建 FileInputStream ，该文件描述符表示与文件系统中的实际文件的现有连接。   
FileInputStream(String name) 通过打开与实际文件的连接来创建一个 FileInputStream ，该文件由文件系统中的路径名 name命名。   

##### 常用方法

int available() 返回从此输入流中可以读取（或跳过）的剩余字节数的估计值，而不会被下一次调用此输入流的方法阻塞。   
void close() 关闭此文件输入流并释放与流相关联的任何系统资源。   
protected void finalize() 已过时。  
finalize方法已被弃用。 为了执行清理而覆盖finalize子类应该修改为使用替代清理机制，并删除覆盖的finalize方法。 当覆盖finalize方法时，其实现必须明确确保按照super.finalize()所述调用super.finalize() 。 有关迁移选项的更多信息，请参阅Object.finalize()的规范。  
FileChannel getChannel() 返回与此文件输入流相关联的唯一的FileChannel对象。  
FileDescriptor getFD() 返回表示与此 FileInputStream正在使用的文件系统中的实际文件的连接的 FileDescriptor对象。 
int read() 从该输入流读取一个字节的数据。   
int read(byte[] b) 从该输入流读取最多 b.length个字节的数据到一个字节数组。  
int read(byte[] b, int off, int len) 从该输入流读取最多 len个字节的数据到字节数组。  
long skip(long n) 跳过并从输入流中丢弃 n字节的数据。  

### OutputStream字节输出流

![20220919095900](https://blog-1253887276.cos.ap-chongqing.myqcloud.com/vscodeblog/20220919095900.png)


常用方法  
void close() 关闭此输出流并释放与此流相关联的任何系统资源。  
void flush() 刷新此输出流并强制任何缓冲的输出字节被写出。  
void write(byte[] b) 将 b.length字节从指定的字节数组写入此输出流。  
void write(byte[] b, int off, int len) 从指定的字节数组写入 len字节，从偏移量 off开始输出到此输出流。  
abstract void write(int b) 将指定的字节写入此输出流。  


#### FileOutPutStream

构造方法  
FileOutputStream(File file) 创建文件输出流以写入由指定的 File对象表示的文件。   
FileOutputStream(FileDescriptor fdObj) 创建文件输出流以写入指定的文件描述符，表示与文件系统中实际文件的现有连接。   
FileOutputStream(File file, boolean append) 创建文件输出流以写入由指定的 File对象表示的文件。   
FileOutputStream(String name) 创建文件输出流以指定的名称写入文件。   
FileOutputStream(String name, boolean append) 创建文件输出流以指定的名称写入文件。  

常用方法  
void close() 关闭此文件输出流并释放与此流相关联的任何系统资源。   
protected void finalize() 已过时。  
finalize方法已被弃用。 为了执行清理，覆盖finalize子类应被修改为使用替代的清理机制，并删除覆盖的finalize方法。 当覆盖finalize方法时，其实现必须明确确保按照super.finalize()中所述调用super.finalize() 。 有关迁移选项的更多信息，请参阅Object.finalize()的规范。   
FileChannel getChannel() 返回与此文件输出流相关联的唯一的FileChannel对象。  
FileDescriptor getFD() 返回与此流相关联的文件描述符。  
void write(byte[] b) 将 b.length字节从指定的字节数组写入此文件输出流。   
void write(byte[] b, int off, int len) 将 len字节从指定的字节数组开始，从偏移量 off开始写入此文件输出流。   
void write(int b) 将指定的字节写入此文件输出流。   

# File

File是“文件”和“目录路径名”的抽象表示形式  
File直接集成Object，实现了Serializable接口和Comparable接口。实现Serializable接口，意味着支持序列化操作，实现了Comparable接口则意味着可以比较文件的大小；File能直接被存储在有序集合中。（TreeSet和TreeMap）  

构造方法  
File(File parent, String child) 从父抽象路径名和子路径名字符串创建新的 File实例。   
File(String pathname) 通过将给定的路径名字符串转换为抽象路径名来创建新的 File实例。   
File(String parent, String child) 从父路径名字符串和子路径名字符串创建新的 File实例。   
File(URI uri) 通过将给定的 file: URI转换为抽象路径名来创建新的 File实例。   