---
title: 第二章 JAVA编程基础
date: 2026-10-18
category: 笔记
tags: [JAVA, 笔记]
excerpt: JAVA的学习笔记
draft: true         # 还没写完就打开，列表里会显示「待补充」
---
# 第二章 JAVA编程基础

## 基本语法

JAVA为**多范式、静态类型、编译型、基于类的面向对象、分号终止型语言**，使用时注意区别于其他语言特性

声明包，使用`package`（声明该文件代码属于哪个包，我理解为命名空间）

```java
package 包名;
```  

导入类，使用`import`关键字  

```java
import 包名.类名;
```  

> 导入包中所有类，使用`*`代替上面的类名 

JAVA程序的基本结构
```java
[访问修饰符] [修饰符] class 类名 [extends 父类] [implements 接口列表] {
    // 类体：成员变量、方法、构造器、代码块、内部类比如下面的方法

    [访问修饰符] [修饰符] 返回类型 方法名([参数列表]) [throws 异常列表] {
    // 方法体,即执行的逻辑
    [return 返回值;]
  }
}
```
**[ ]** 指该部分可有可无，下面是一个包含上述知识的最简示例

```java
package com.example.demo;// 单文件情况下可省略
import java.util.Scanner;// 单文件情况下可省略
public class HelloWorld {          // 类
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String name = sc.nextLine();
        System.out.println("Hello, " + name + "!");
    }
}
```  

## 数据类型

### 1. 基本数据类型（8 种）

| 分类 | 关键字 | 位数/大小 | 取值范围或精度 | 默认值（字段/数组元素） | 包装类 | 示例 |
|---|---|---|---|---|---|---|
| 整数类型 | `byte` | 8 位 | `-128 ~ 127` | `0` | `Byte` | `byte b = 100;` |
| 整数类型 | `short` | 16 位 | `-32768 ~ 32767` | `0` | `Short` | `short s = 1000;` |
| 整数类型 | `int` | 32 位 | `-2^31 ~ 2^31-1` | `0` | `Integer` | `int i = 100000;` |
| 整数类型 | `long` | 64 位 | `-2^63 ~ 2^63-1` | `0L` | `Long` | `long l = 100000L;` |
| 浮点类型 | `float` | 32 位 | 约 `±3.40282347E+38F`，约 6~7 位十进制有效数字 | `0.0f` | `Float` | `float f = 3.14f;` |
| 浮点类型 | `double` | 64 位 | 约 `±1.79769313486231570E+308`，约 15~17 位十进制有效数字 | `0.0d` | `Double` | `double d = 3.14;` |
| 字符类型 | `char` | 16 位 | `0 ~ 65535`，即 `'\u0000' ~ '\uffff'` | `'\u0000'` | `Character` | `char c = 'A';` |
| 布尔类型 | `boolean` | JVM 规范未规定精确大小，通常按 1 字节实现 | `true`、`false` | `false` | `Boolean` | `boolean flag = true;` |

> 注意：默认值适用于**成员变量/字段和数组元素**；**局部变量必须显式初始化后才能使用**。

### 2. 引用数据类型

| 类别 | 关键字/写法 | 说明 | 默认值 | 示例 |
|---|---|---|---|---|
| 类 | `class` | 包括 Java 内置类和自定义类，如 `String`、`Object` | `null` | `String s = "abc";` |
| 接口 | `interface` | 引用类型，可指向实现类对象或 Lambda 表达式 | `null` | `Runnable r = () -> {};` |
| 数组 | `类型[]` | 数组本身是引用类型，如 `int[]`、`String[]` | `null` | `int[] arr = {1, 2, 3};` |
| 枚举 | `enum` | 枚举类型，如 `Color` | `null` | `Color c = Color.RED;` |
| 注解 | `@interface` | 注解类型，如 `@Deprecated` | `null` | `@Deprecated void f() {}` |
| 记录 | `record` | Java 16+ 正式支持，如 `record Point(int x, int y) {}` | `null` | `Point p = new Point(1, 2);` |

> `String` 属于**类**，不是基本数据类型。`null` 可以赋给引用类型变量，但不是基本数据类型。

## 变量

JAVA 变量分为**局部变量、成员变量（实例/静态）、参数**，声明语法统一为 `类型 变量名 [= 初始值];`

```java
int a;               // 声明
int b = 10;          // 声明并初始化
final int C = 100;   // 常量，只能赋值一次
```

> **局部变量必须显式初始化**才能使用；**成员变量有默认值**（0 / 0.0 / false / '\u0000' / null）

成员变量（声明即定义，有默认值，声明在类体中、方法外）
```java
class User {
    int age;              // 实例变量，默认 0
    static int count;     // 静态变量，默认 0
    String name;          // 引用类型，默认 null
}
```

局部变量（必须初始化，不能用访问修饰符，声明在方法/构造器/代码块内部）
```java
void test() {
    int x;             // 仅声明
    // System.out.println(x); // 编译错误：可能未初始化
    x = 1;             // 赋值后可用
}
```

作用域规则

| 变量种类 | 作用域 | 生命周期 |
|---|---|---|
| 局部变量 | 声明处 ~ 所在 `{}` 结束 | 方法/块执行期间 |
| 方法参数 | 整个方法体 | 方法调用期间 |
| 实例变量 | 整个类体（外部受修饰符限制） | 对象创建 ~ 回收 |
| 静态变量 | 整个类体（可用类名访问） | 类加载 ~ 卸载 |

关键点

- 局部变量**作用域从声明处开始**，不能提前使用
- 同一作用域**不能重复声明**同名变量
- 内层块可声明同名变量，发生**遮蔽**
- 局部变量可遮蔽成员变量，用 `this.` 区分
```java
class User {
    int age;
    void setAge(int age) {
        this.age = age;  // this.age 是成员变量
    }
}
```