---
title: 第二章 JAVA编程基础
date: 2026-10-18
category: 笔记
tags: [JAVA, 笔记]
excerpt: JAVA的学习笔记
draft: false        # 还没写完就打开，列表里会显示「待补充」
order: 2
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
## 数据类型转换

### 自动类型转换（隐式）

**条件**：类型兼容，且目标类型范围 **大于** 源类型，编译器自动完成。

```java
byte → short → int → long → float → double
char → int → long → float → double
```

```java
int i = 100;
long l = i;       // 自动
double d = l;     // 自动

char c = 'A';
int n = c;        // 自动，n = 65
```

> `boolean` 不参与任何数值转换  
> `long → float` 虽可能丢精度，但仍属自动转换

### 强制类型转换（显式）

**大范围 → 小范围**，必须用 `(目标类型)`，可能**截断小数**或**溢出**。

```java
目标类型 变量 = (目标类型) 源值;
```

```java
double d = 3.99;
int i = (int) d;        // 3，截断小数

int big = 300;
byte b = (byte) big;    // 44，溢出

long l = 100L;
int n = (int) l;        // 100
```

### 表达式中的自动提升

`byte`、`short`、`char` 参与运算时，先提升为 `int`。

```java
byte a = 1, b = 2;
// byte c = a + b;   // 编译错误：a + b 是 int
int c = a + b;       // 正确
byte d = (byte)(a + b); // 需强转
```

### 常见转换
```java
// 字符串 → 基本类型
int n = Integer.parseInt("123");
double d = Double.parseDouble("3.14");

// 基本类型 → 字符串
String s1 = String.valueOf(123);
String s2 = 123 + "";        // 不推荐，可读性差
```

## 运算符

### 1. 算术运算符

| 运算符 | 名称 | 说明 | 示例 |
|---|---|---|---|
| `+` | 加 / 一元正 | 数值相加；也可作一元正号、字符串拼接 | `a + b`、`+a`、`"x" + 1` |
| `-` | 减 / 一元负 | 数值相减；也可作一元负号 | `a - b`、`-a` |
| `*` | 乘 | 数值相乘 | `a * b` |
| `/` | 除 | 整数相除取整；有浮点数则保留小数 | `5 / 2 == 2`、`5.0 / 2 == 2.5` |
| `%` | 取模 | 求余数 | `5 % 2 == 1` |
| `++` | 自增 | 前置先加后用，后置先用后加 | `++a`、`a++` |
| `--` | 自减 | 前置先减后用，后置先用后减 | `--a`、`a--` |

### 2. 比较运算符

| 运算符 | 名称 | 说明 | 示例 |
|---|---|---|---|
| `==` | 等于 | 基本类型比值；引用类型比地址 | `a == b` |
| `!=` | 不等于 | 与 `==` 相反 | `a != b` |
| `>` | 大于 | 数值比较 | `a > b` |
| `<` | 小于 | 数值比较 | `a < b` |
| `>=` | 大于等于 | 数值比较 | `a >= b` |
| `<=` | 小于等于 | 数值比较 | `a <= b` |
| `instanceof` | 类型判断 | 判断对象是否为某类/接口实例 | `obj instanceof String` |

> 引用类型内容比较用 `equals()`，不要用 `==` 比内容。

### 3. 逻辑运算符

| 运算符 | 名称 | 说明 | 示例 |
|---|---|---|---|
| `&&` | 短路与 | 两边都为 `true` 才为 `true`；左边 `false` 时右边不执行 | `a > 0 && b > 0` |
| `\|\|` | 短路或 | 任一边 `true` 即为 `true`；左边 `true` 时右边不执行 | `a > 0 \|\| b > 0` |
| `!` | 逻辑非 | 取反 | `!flag` |
| `&` | 非短路与 | 布尔逻辑与；两边都会执行 | `a > 0 & b > 0` |
| `\|` | 非短路或 | 布尔逻辑或；两边都会执行 | `a > 0 \| b > 0` |
| `^` | 逻辑异或 | 两边不同为 `true`，相同为 `false` | `a ^ b` |

> `&`、`|`、`^` 也可作位运算符；对 `boolean` 使用时是逻辑运算。

### 4. 三元运算符

| 运算符 | 名称 | 说明 | 示例 |
|---|---|---|---|
| `? :` | 三元/条件运算符 | `条件 ? 值1 : 值2`；条件为 `true` 取值1，否则取值2 | `int max = a > b ? a : b;` |

> 三元运算符是 Java 中唯一的三目运算符。

## 语句

### 选择结构语句

**if / if-else / if-else if-else**

```java
if (条件) {
    // 条件为 true 执行
}

if (条件) {
    // true
} else {
    // false
}

if (条件1) {
    // ...
} else if (条件2) {
    // ...
} else {
    // 都不满足
}
```

> 条件必须是 `boolean`，不能用 `0/1` 代替

**switch（传统写法）**

```java
switch (变量) {
    case 值1:
        // ...
        break;          // 不写 break 会穿透到下一个 case
    case 值2:
    case 值3:           // 多个 case 共用逻辑
        // ...
        break;
    default:
        // 都不匹配
}
```

> 支持类型：`byte`、`short`、`char`、`int`、`String`、`enum`（Java 7+）

**switch 表达式（Java 14+ 正式）**

```java
int result = switch (day) {
    case 1, 2, 3 -> 10;        // 箭头写法，不穿透
    case 4, 5    -> 20;
    default      -> 0;
};
```

> `->` 不穿透，可直接返回值；也可用 `yield` 在块中返回

### 循环结构语句

**for（计数循环）**

```java
for (初始化; 条件; 更新) {
    // 循环体
}

for (int i = 0; i < 10; i++) {
    System.out.println(i);
}
```

> 初始化、条件、更新都可省略；`for(;;)` 是死循环

**while（先判断后执行）**

```java
while (条件) {
    // 条件为 true 时执行
}
```

> 可能一次都不执行

**do-while（先执行后判断）**

```java
do {
    // 至少执行一次
} while (条件);      // 注意末尾分号
```

> 至少执行一次，条件为 `true` 继续循环

**增强 for / for-each（遍历数组或集合）**

```java
for (元素类型 变量 : 数组或集合) {
    // 使用变量
}

for (int n : arr) {
    System.out.println(n);
}
```

> 只读遍历，不能直接修改原数组/集合元素；不能获取索引

### 循环控制

| 语句 | 作用 |
|---|---|
| `break` | 跳出当前**整个循环**或 `switch` |
| `continue` | 跳过本次循环剩余部分，进入**下一次循环** |
| `return` | 结束当前**方法**，返回值（若有） |

```java
for (int i = 0; i < 10; i++) {
    if (i == 3) continue;   // 跳过 i == 3
    if (i == 8) break;      // i == 8 时结束循环
    System.out.println(i);
}
```

> `break`/`continue` 可配合**标签**跳出多层循环：

```java
outer:
for (int i = 0; i < 3; i++) {
    for (int j = 0; j < 3; j++) {
        if (j == 1) break outer;   // 跳出外层循环
    }
}
```

## 数组

### 声明与初始化

```java
// 声明（两种写法等价，推荐第一种）
int[] arr;
int arr2[];

// 静态初始化：已知元素
int[] a = {1, 2, 3};
int[] b = new int[]{1, 2, 3};

// 动态初始化：只定长度，元素取默认值
int[] c = new int[5];        // {0,0,0,0,0}
String[] s = new String[3];  // {null,null,null}
```

> 数组长度固定，`arr.length` 获取长度（不是方法，无括号）

### 访问与赋值

```java
int[] arr = new int[3];

arr[0] = 10;        // 赋值
int x = arr[0];     // 访问

// arr[3] = 1;      // ArrayIndexOutOfBoundsException
```

> 下标从 `0` 开始，范围 `0 ~ length-1`

### 遍历

```java
int[] arr = {1, 2, 3};

// 普通 for：可获取索引，可修改元素
for (int i = 0; i < arr.length; i++) {
    System.out.println(arr[i]);
    arr[i] *= 2;
}

// 增强 for：只读遍历，不能获取索引
for (int n : arr) {
    System.out.println(n);
}
```

### 排序

```java
import java.util.Arrays;

int[] arr = {3, 1, 2};

Arrays.sort(arr);              // 升序，原地排序
System.out.println(Arrays.toString(arr)); // [1, 2, 3]

// 降序：先升序再反转，或用包装类
Integer[] boxed = {3, 1, 2};
Arrays.sort(boxed, (a, b) -> b - a);      // 降序
```

> 基本类型只能升序；降序需用包装类 + 比较器

### 最值获取

```java
int[] arr = {3, 1, 5, 2};

int max = arr[0];
int min = arr[0];
for (int i = 1; i < arr.length; i++) {
    if (arr[i] > max) max = arr[i];
    if (arr[i] < min) min = arr[i];
}
System.out.println(max + ", " + min); // 5, 1
```

> 空数组取最值会越界，需先判断 `arr.length > 0`

### 二维数组

```java
// 声明
int[][] matrix;

// 静态初始化
int[][] m1 = {{1, 2}, {3, 4}, {5, 6}};

// 动态初始化（规则二维数组）
int[][] m2 = new int[3][4];   // 3 行 4 列，默认 0

// 动态初始化（不规则/锯齿数组）
int[][] m3 = new int[3][];    // 只定行数
m3[0] = new int[2];
m3[1] = new int[3];
m3[2] = new int[4];
```

**访问与赋值**

```java
matrix[0][1] = 10;     // 第 0 行第 1 列赋值
int v = matrix[0][1];  // 访问
```

**遍历**

```java
int[][] m = {{1, 2}, {3, 4}};

// 嵌套普通 for
for (int i = 0; i < m.length; i++) {
    for (int j = 0; j < m[i].length; j++) {
        System.out.print(m[i][j] + " ");
    }
    System.out.println();
}

// 嵌套增强 for
for (int[] row : m) {
    for (int n : row) {
        System.out.print(n + " ");
    }
    System.out.println();
}
```

> 二维数组本质是“数组的数组”，`m.length` 是行数，`m[i].length` 是第 i 行的列数（锯齿数组各行长度可不同）

**使用的关键方法**


| 操作 | 方法 |
|---|---|
| 获取长度 | `arr.length` |
| 遍历数组打印 | `Arrays.toString(arr)` |
| 二维数组打印 | `Arrays.deepToString(m)` |
| 排序 | `Arrays.sort(arr)` |
| 查找 | `Arrays.binarySearch(arr, key)`（需先排序） |
| 复制 | `Arrays.copyOf(arr, newLength)` |
| 判等 | `Arrays.equals(a, b)` |

## 方法

### 方法定义与调用

**定义语法**

```java
[访问修饰符] [修饰符] 返回类型 方法名([参数列表]) [throws 异常列表] {
    // 方法体
    [return 返回值;]
}
```

```java
public static int add(int a, int b) {
    return a + b;
}
```

> 无返回值用 `void`，此时可省略 `return` 或只写 `return;`

**调用**

```java
int sum = add(1, 2);          // 静态方法：类名.方法名() 或同类直接调用
obj.method();                 // 实例方法：对象.方法名()
```

**参数传递**：Java 只有**值传递**。基本类型传值副本，引用类型传地址副本（可改对象内容，不能改引用指向）。

```java
void change(int x) { x = 100; }          // 不影响外部
void change(int[] arr) { arr[0] = 100; } // 影响外部数组内容
```

### 方法重载（Overload）

**同一类中，方法名相同，参数列表不同**（参数个数、类型、顺序不同），与返回值、修饰符无关。

```java
class Calc {
    int add(int a, int b)        { return a + b; }
    int add(int a, int b, int c) { return a + b + c; }
    double add(double a, double b){ return a + b; }
}
```

> 调用时根据**参数**自动匹配对应版本。仅返回值不同**不构成**重载。

### 方法重写（Override）

**子类重新实现父类方法**，方法名、参数列表、返回类型（兼容）相同。用于实现**运行时多态**。

```java
class Animal {
    void speak() { System.out.println("动物叫"); }
}

class Dog extends Animal {
    @Override
    void speak() { System.out.println("汪汪"); }  // 重写
}

Animal a = new Dog();
a.speak();   // 汪汪 —— 运行时看实际对象类型（多态）
```

**重写规则**

| 规则 | 说明 |
|---|---|
| 方法名、参数列表 | 必须相同 |
| 返回类型 | 相同或子类型（协变返回） |
| 访问权限 | 不能比父类**更严格** |
| 异常 | 不能抛出**更宽**的受检异常 |
| `static`/`final`/`private` 方法 | 不能重写 |
| 注解 | 建议加 `@Override`，编译期校验 |

### 重载 vs 重写

| 对比项 | 重载 Overload | 重写 Override |
|---|---|---|
| 发生位置 | **同一个类**中 | **子类与父类**之间 |
| 方法名 | 相同 | 相同 |
| 参数列表 | **必须不同** | **必须相同** |
| 返回值 | 无关 | 相同或子类型 |
| 绑定时机 | **编译期**（静态绑定） | **运行期**（动态绑定） |
| 目的 | 同一功能多种参数形式 | 子类改变父类行为，实现多态 |

### 类中方法的多态

多态 = **父类引用指向子类对象**，调用重写方法时执行子类版本。

```java
class Shape {
    double area() { return 0; }
}
class Circle extends Shape {
    double r = 2;
    @Override double area() { return Math.PI * r * r; }
}
class Square extends Shape {
    double side = 3;
    @Override double area() { return side * side; }
}

Shape[] shapes = { new Circle(), new Square() };
for (Shape s : shapes) {
    System.out.println(s.area());  // 分别调用各自重写版本
}
```

**多态前提**：继承/实现 + 方法重写 + 父类引用指向子类对象。

**向上转型 / 向下转型**

```java
Shape s = new Circle();       // 向上转型，自动
Circle c = (Circle) s;        // 向下转型，需强转
if (s instanceof Circle c2) { // Java 16+ 模式匹配
    // ...
}
```

### 注意点

- **重载**：同类、同名、参数不同，编译期决定调用哪个
- **重写**：子类覆盖父类同名同参方法，运行期决定调用哪个
- **多态**：父类引用调重写方法，走子类实现
- 构造器**不能**被重写，但**可以**重载
- `private`、`static`、`final` 方法不能被重写

**多态在后续面向对象中会更加详细讲，这里稍微了解**