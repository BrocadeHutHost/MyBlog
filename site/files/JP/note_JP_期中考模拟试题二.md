---
title: 期中考试模拟试题二
date: 2026-10-24
category: 笔记
tags: [JAVA, 笔记]
excerpt: JAVA的学习笔记
draft: false        # 还没写完就打开，列表里会显示「待补充」
order: 6
UseByAI:true
---


## 题目

## 一、单项选择题（40题）

### Java概述与环境搭建（1—8）

**1.** 下列选项中，对于Java语言的类别描述正确的是（ ）。

- A. 机器语言
- B. 汇编语言
- C. 高级语言
- D. 以上都不正确

**2.** 可以在Java虚拟机中直接运行的文件类型是（ ）。

- A. .java
- B. .jre
- C. .exe
- D. .class

**3.** Java编译器的可执行文件是（ ）。

- A. javac.exe
- B. java.exe
- C. jar.exe
- D. javadoc.exe

**4.** JDK目录下存放`javac.exe`、`java.exe`等可执行程序的子目录是（ ）。

- A. conf
- B. bin
- C. lib
- D. include

**5.** 下列关于Java跨平台原理的描述，正确的是（ ）。

- A. JVM本身是跨平台的，字节码与平台相关
- B. 字节码是跨平台的，JVM与具体平台相关
- C. Java源代码无需编译即可运行
- D. Java程序由操作系统直接解释执行

**6.** `java`命令的作用是（ ）。

- A. 编译源文件
- B. 解释执行字节码
- C. 生成文档
- D. 打包

**7.** Java程序的执行入口是（ ）。

- A. `start()`
- B. `main()`
- C. `run()`
- D. `init()`

**8.** 下列环境变量中，用于告诉JVM去哪里找`.class`文件的是（ ）。

- A. `PATH`
- B. `JAVA_HOME`
- C. `CLASSPATH`
- D. `TEMP`

### 基本语法、数据类型、转换与运算符（9—20）

**9.** 以下哪个不是Java的基本数据类型？（ ）

- A. int
- B. String
- C. boolean
- D. char

**10.** `double`类型占用的字节数是（ ）。

- A. 2
- B. 4
- C. 6
- D. 8

**11.** 以下赋值语句中，语法正确的是（ ）。

- A. `char c = "a";`
- B. `double d = 3.14;`
- C. `boolean b = 1;`
- D. `byte b = 129;`

**12.** 以下不合法的用户标识符是（ ）。

- A. `_name`
- B. `$count`
- C. `2var`
- D. `userName`

**13.** `int x = 5 / 2;` 执行后 `x` 的值是（ ）。

- A. 2.5
- B. 2
- C. 3
- D. 0

**14.** 表达式 `5 % -3` 的结果是（ ）。

- A. 2
- B. -2
- C. 1
- D. -1

**15.** 下列运算符中，优先级最高的是（ ）。

- A. `+`
- B. `&&`
- C. `()`
- D. `=`

**16.** `int a = 5; a += 3.5;` 执行后 `a` 的值是（ ）。

- A. 8
- B. 8.5
- C. 编译错误
- D. 9

**17.** `x > 0 ? x + 1 : 5` 中，若 `x = 2`，结果是（ ）。

- A. 2
- B. 3
- C. 5
- D. 0

**18.** 以下关于`switch`的说法，正确的是（ ）。

- A. `switch`可以用于`double`
- B. `case`标签可以是变量
- C. JDK 7之后`switch`支持`String`
- D. `switch`中必须使用`break`

**19.** `boolean flag = 1;` 这行代码（ ）。

- A. 正确
- B. 编译错误
- C. 运行时异常
- D. 输出true

**20.** `10.0 / 3` 的结果类型是（ ）。

- A. int
- B. long
- C. float
- D. double

### 选择结构与循环结构（21—26）

**21.** `if`语句圆括号内的表达式（ ）。

- A. 只能是逻辑表达式
- B. 只能是关系表达式
- C. 只能是关系或逻辑表达式
- D. 可以是任意表达式，但结果必须是`boolean`

**22.** 用于跳出当前整个循环的关键字是（ ）。

- A. `continue`
- B. `break`
- C. `return`
- D. `exit`

**23.** `continue`语句的作用是（ ）。

- A. 终止整个循环
- B. 跳过本次循环剩余部分，进入下一次循环判断
- C. 终止程序
- D. 跳出方法

**24.** 至少会执行一次循环体的循环是（ ）。

- A. `for`
- B. `while`
- C. `do...while`
- D. 增强`for`

**25.** `switch`中如果某个`case`分支没有`break`，会发生（ ）。

- A. 编译错误
- B. 跳过该分支
- C. `case`穿透
- D. 直接退出`switch`

**26.** 以下代码输出结果是（ ）。

```java
int i = 0;
while (i < 3) {
    System.out.print(i);
    i++;
}
```

- A. 123
- B. 012
- C. 0123
- D. 无限循环

### 数组与方法（27—33）

**27.** 数组下标的起始值是（ ）。

- A. 1
- B. 0
- C. -1
- D. 随机

**28.** 获取数组长度的方式是（ ）。

- A. `length()`
- B. `size()`
- C. `length`
- D. `count`

**29.** `int[][] a = new int[3][];` 中，`a[0]`的值是（ ）。

- A. 0
- B. `null`
- C. 编译错误
- D. 空数组

**30.** 方法重载的核心要求是（ ）。

- A. 方法名相同，参数列表不同
- B. 方法名相同，返回值不同
- C. 方法名不同，参数列表相同
- D. 方法名相同，修饰符不同

**31.** 以下关于方法参数传递的说法，正确的是（ ）。

- A. 基本类型传递地址
- B. 引用类型传递对象的副本
- C. 基本类型传递值的副本，引用类型传递地址的副本
- D. Java既有值传递也有引用传递

**32.** `void`方法中可以出现（ ）。

- A. 不能出现`return`
- B. 只能写`return;`用于提前结束
- C. 必须写`return null;`
- D. 必须写`return 0;`

**33.** `Arrays.sort(int[] a)` 的作用是（ ）。

- A. 反转数组
- B. 升序排序
- C. 降序排序
- D. 查找元素

### 面向对象（上/下）与异常（34—40）

**34.** 实例化对象使用的关键字是（ ）。

- A. `class`
- B. `new`
- C. `this`
- D. `super`

**35.** 访问级别最严格、只允许同一个类中访问的修饰符是（ ）。

- A. `public`
- B. `protected`
- C. 默认
- D. `private`

**36.** 下列关于`static`的说法，错误的是（ ）。

- A. `static`可以修饰成员变量、方法和代码块
- B. 静态方法只能访问静态成员
- C. `static`可以修饰局部变量
- D. 静态成员可以通过类名或对象访问

**37.** Java中类继承使用的关键字是（ ）。

- A. `implements`
- B. `extends`
- C. `import`
- D. `include`

**38.** 方法重写要求子类方法的访问权限（ ）。

- A. 必须大于父类
- B. 不能小于父类
- C. 必须等于父类
- D. 无要求

**39.** 在Java中，一个类可以实现（ ）接口。

- A. 只能1个
- B. 最多2个
- C. 多个
- D. 0个

**40.** 以下哪个类是所有异常类的根类？（ ）

- A. `Error`
- B. `RuntimeException`
- C. `Throwable`
- D. `Exception`

---

## 二、多项选择题（20题）

### 基本语法与流程控制（1—6）

**1.** 下列属于Java基本数据类型的有（ ）。

- A. int
- B. String
- C. boolean
- D. char
- E. Integer

**2.** 以下关于`switch`支持的数据类型，正确的有（ ）。

- A. byte
- B. char
- C. String（JDK 7+）
- D. double
- E. enum

**3.** 以下循环结构中，条件判断在循环体之前的有（ ）。

- A. `for`
- B. `while`
- C. `do...while`
- D. 增强`for`

**4.** 下列运算符中，属于关系运算符的有（ ）。

- A. `>`
- B. `==`
- C. `!=`
- D. `&&`
- E. `<=`

**5.** 以下关于`break`和`continue`的说法，正确的有（ ）。

- A. `break`可用于`switch`
- B. `continue`只能用于循环中
- C. `break`可以跳出多层嵌套循环（带标签时）
- D. `continue`会终止当前循环

**6.** 以下能正确声明数组的有（ ）。

- A. `int[] a;`
- B. `int a[];`
- C. `int[] a = new int[5];`
- D. `int a[5];`
- E. `int[] a = {1,2,3};`

### 面向对象与异常（7—20）

**7.** 面向对象的三大特征包括（ ）。

- A. 封装
- B. 继承
- C. 多态
- D. 重载

**8.** 下列关于封装的描述，正确的有（ ）。

- A. 隐藏内部实现细节
- B. 通常将属性设为`private`，提供`get/set`方法
- C. 封装使数据可以被任意修改
- D. 封装提高安全性

**9.** 下列关于构造方法的描述，正确的有（ ）。

- A. 方法名与类名相同
- B. 没有返回值类型
- C. 可以被`static`修饰
- D. 创建对象时自动调用
- E. 一个类可以定义多个构造方法

**10.** 下列关于`static`的描述，正确的有（ ）。

- A. 静态成员随类的加载而加载
- B. 静态方法可以访问非静态成员变量
- C. 静态成员被该类的所有对象共享
- D. 静态方法中不能使用`this`

**11.** 下列关于继承的说法，正确的有（ ）。

- A. Java类只支持单继承
- B. 子类可以重写父类方法
- C. 子类可以直接访问父类的`private`成员
- D. 继承提高代码复用性
- E. 所有类都直接或间接继承自`Object`

**12.** 下列关于抽象类和抽象方法的说法，正确的有（ ）。

- A. 抽象类不能被实例化
- B. 包含抽象方法的类必须是抽象类
- C. 抽象类中必须包含抽象方法
- D. 子类必须实现父类的所有抽象方法，除非子类也是抽象类

**13.** 下列关于接口的说法，正确的有（ ）。

- A. 接口中的变量默认是`public static final`
- B. 接口可以继承多个接口
- C. 一个类可以实现多个接口
- D. 接口可以被实例化

**14.** 下列属于多态表现的有（ ）。

- A. 父类引用指向子类对象
- B. 方法重写
- C. 方法重载
- D. 子类对象上转型

**15.** 下列关于异常的说法，正确的有（ ）。

- A. `Throwable`是异常体系的根
- B. `Error`和`Exception`都继承自`Throwable`
- C. 运行时异常必须显式捕获
- D. `finally`块通常用于释放资源
- E. `throw`用于抛出异常对象，`throws`用于声明可能抛出的异常

**16.** 下列关于成员访问权限的说法，正确的有（ ）。

- A. `private`只能在本类中访问
- B. 默认权限允许同包访问
- C. `protected`允许不同包的子类访问
- D. `public`可以被任意包访问

**17.** 下列关于`this`和`super`的说法，正确的有（ ）。

- A. `this`代表当前对象引用
- B. `this()`用于调用本类其他构造方法
- C. `super()`用于调用父类构造方法
- D. `super`可以在静态方法中使用

**18.** 下列关于内部类的说法，正确的有（ ）。

- A. 成员内部类可以访问外部类的私有成员
- B. 静态内部类不能直接访问外部类的非静态成员
- C. 局部内部类可以定义在方法中
- D. 匿名内部类通常用于简化接口或抽象类的实现

**19.** 下列关于异常处理流程的说法，正确的有（ ）。

- A. `try`块中发生异常后，其后的代码不再执行
- B. 一个`try`可以对应多个`catch`
- C. `finally`通常会在`return`之前执行
- D. `catch`块的顺序应子类异常在前、父类异常在后

**20.** 下列关于多态调用规则的说法，正确的有（ ）。

- A. 编译时看引用变量的类型
- B. 运行时看实际对象的类型
- C. 父类引用不能调用子类特有方法（除非强转）
- D. 静态方法可以像实例方法一样实现运行时多态

---

## 三、判断题（30题）

1.Java支持面向对象编程。（ ）

2.Java程序由操作系统直接解释执行。（ ）

3.JVM本身是跨平台的，字节码与具体平台相关。（ ）

4.编译Java源文件使用`javac`命令。（ ）

5.`boolean`类型只有`true`和`false`两个值。（ ）

6.`int a = 3.5;` 可以编译通过。（ ）

7.`byte`类型的取值范围是-128～127。（ ）

8.`char`类型可以存储一个中文字符。（ ）

9.`switch`可以用于`double`类型。（ ）

10.`do...while`循环的循环体至少执行一次。（ ）

11.数组长度一旦确定就不能改变。（ ）

12.数组下标可以等于数组长度。（ ）

13.`void`方法中不能出现任何`return`语句。（ ）

14.方法重载要求方法名相同、参数列表不同。（ ）

15.类是对象的模板，对象是类的实例。（ ）

16.封装要求将所有成员都设为`private`。（ ）

17.构造方法可以被继承。（ ）

18.如果一个类定义了有参构造方法，编译器仍会自动提供默认无参构造方法。（ ）

19.静态方法中可以直接访问非静态成员变量。（ ）

20.`static`可以修饰局部变量。（ ）

21.Java支持类的多继承。（ ）

22.子类重写父类方法时，访问权限不能小于父类。（ ）

23.抽象类可以直接实例化。（ ）

24.接口可以继承多个接口。（ ）

25.一个类可以实现多个接口。（ ）

26.父类引用指向子类对象时，通过该引用只能调用父类中声明的方法（编译时看左边）。（ ）

27.`Object`类的`equals()`方法默认比较对象的内容。（ ）

28.`finally`块只在发生异常时执行。（ ）

29.运行时异常不强制要求用`try-catch`捕获。（ ）

30.`throw`和`throws`可以互换使用。（ ）

---

## 四、填空题（25题）

1.Java中编译源文件的命令是______，执行字节码的命令是______。

2.Java程序的执行入口是______方法。

3.Java字节码文件的扩展名是______。

4.`byte`占______字节，`short`占______字节，`int`占______字节，`long`占______字节。

5.自动类型转换的方向是从容量______的类型转向容量______的类型。

6.`10 / 3`的结果是______，`10.0 / 3`的结果是______。

7.`true && false`的结果是______；`true || false`的结果是______。

8.`switch`在JDK 7之后支持______类型。

9.`break`用于跳出______，`continue`用于跳过______。

10.数组的长度通过属性______获取。

11.二维数组`int[][] a = new int[3][4];` 中，`a.length`是______，`a[0].length`是______。

12.方法重载要求______相同，______不同。

13.面向对象的三大特征是______、______、______。

14.使用______修饰的成员属于类，而不属于某个具体的对象。

15.构造方法的方法名必须与______相同，并且没有______。

16.子类使用______关键字调用父类的构造方法或成员。

17.抽象类使用______关键字定义，抽象方法使用______关键字修饰。

18.接口使用______关键字定义，类实现接口使用______关键字。

19.接口中的成员变量默认修饰符是______。

20.Java中类之间只能______继承，但接口之间可以______继承。

21.父类引用指向子类对象称为______。

22.异常体系的根类是______，它派生出______和______两大类。

23.捕获异常使用______块，处理异常使用______块，释放资源通常放在______块中。

24.在方法声明处声明可能抛出的异常使用______关键字，在代码中主动抛出异常对象使用______关键字。

25.自定义异常通常继承______类或其子类。

---

## 五、程序阅读题（15题，写出输出结果）

1.
```java
int a = 5;
System.out.println(a++ + ++a);
```

2.
```java
for (int i = 0; i < 3; i++) {
    if (i == 1) continue;
    System.out.print(i + " ");
}
```

3.
```java
int sum = 0;
for (int i = 1; i <= 5; i++) sum += i;
System.out.println(sum);
```

4.
```java
int a = 2;
switch (a) {
    case 1: a += 1; break;
    case 2: a += 2;
    case 3: a += 3; break;
    case 4: a += 4; break;
}
System.out.println(a);
```

5.
```java
String s = "Java";
s.replace('a', 'o');
System.out.println(s);
```

6.
```java
class A { A() { System.out.print("A "); } }
class B extends A { B() { System.out.print("B "); } }
public class Test { public static void main(String[] args) { new B(); } }
```

7.
```java
class Animal { void eat() { System.out.println("Animal"); } }
class Dog extends Animal { void eat() { System.out.println("Dog"); } }
public class Test {
    public static void main(String[] args) {
        Animal a = new Dog();
        a.eat();
    }
}
```

8.
```java
int[] arr = {1, 2, 3};
try {
    System.out.println(arr[3]);
} catch (ArrayIndexOutOfBoundsException e) {
    System.out.println("越界");
} finally {
    System.out.println("结束");
}
```

9.
```java
try {
    return;
} finally {
    System.out.println("finally");
}
```

10.
```java
Integer a = 127, b = 127;
Integer c = 128, d = 128;
System.out.println((a == b) + " " + (c == d));
```

11.
```java
public static void change(int x) { x = 100; }
public static void main(String[] args) {
    int a = 10;
    change(a);
    System.out.println(a);
}
```

12.
```java
class A {
    static { System.out.print("A静态 "); }
    A() { System.out.print("A构造 "); }
}
public class Test {
    public static void main(String[] args) {
        new A(); new A();
    }
}
```

13.
```java
String a = "abc";
String b = "abc";
System.out.println(a == b);
```

14.
```java
abstract class Shape {
    abstract double area();
}
class Circle extends Shape {
    double r = 1;
    double area() { return 3.14 * r * r; }
}
public class Test {
    public static void main(String[] args) {
        Shape s = new Circle();
        System.out.println(s.area());
    }
}
```

15.
```java
throw new RuntimeException("demo");
```
在未捕获的情况下，程序运行结果是什么？

---

## 六、编程题（15题）

1.编写程序，输出1～100之间所有能被3整除但不能被5整除的整数，并统计个数。

2.编写方法 `int max(int[] arr)`，返回数组最大值；在`main`中测试 `{3, 8, 1, 9, 4}`。

3.定义`Student`类：`private String name; private int age;`，提供无参/有参构造、`get/set`方法、`toString()`返回“姓名：xx，年龄：xx”。在测试类中创建对象并打印。

4.定义`Rectangle`类，包含`width`、`height`，提供无参构造（默认1,1）、双参构造、`area()`方法、`perimeter()`方法。

5.定义`Counter`类，包含`static int count`，每创建一个对象`count++`。在`main`中创建3个对象，输出`count`。

6.定义`Animal`类，方法`shout()`输出“动物叫声”；定义`Dog`和`Cat`继承`Animal`，分别重写`shout()`输出“汪汪”和“喵喵”。用父类引用分别指向子类对象并调用`shout()`。

7.定义抽象类`Shape`，包含抽象方法`double area()`；派生出`Circle`（半径）和`Rectangle`（长宽），实现面积计算。

8.定义接口`Flyable`，方法`void fly()`；定义类`Bird`实现`Flyable`，输出“鸟儿飞翔”；再定义一个类`Airplane`实现`Flyable`，输出“飞机飞行”。分别调用。

9.在第8题基础上，定义测试类，使用`Flyable[]`数组存放`Bird`和`Airplane`对象，遍历调用`fly()`。

10.定义外部类`Outer`，包含`private int num = 10;`，定义成员内部类`Inner`，其方法输出外部类的`num`。在`main`中通过外部类对象创建内部类对象并调用。

11.编写程序，接收两个整数输入做除法。若除数为0，捕获`ArithmeticException`并输出“除数不能为0”；无论是否异常都输出“计算结束”。

12.定义`InsufficientFundsException`继承`Exception`；定义`BankAccount`类，`balance`字段和`withdraw(double amount)`方法，余额不足时`throw new InsufficientFundsException("余额不足")`。

13.定义接口`Playable`，方法`play()`；抽象类`Instrument`实现`Playable`，包含`String name`和构造方法；子类`Piano`和`Guitar`实现`play()`。定义`Band`类，`Playable[] members`，方法`perform()`遍历调用`play()`；若数组为`null`或空，抛出`IllegalStateException`。

14.定义`Employee`类：`private static int totalCount;`，`private String name; private double salary;`；构造方法中`totalCount++`；提供`get/set`、`static int getTotalCount()`。测试类创建3个员工，输出总数。

15.定义`Student`类（姓名、成绩）；编写方法`Student[] sortByScore(Student[] arr)`按成绩降序返回新数组；再编写方法`double average(Student[] arr)`求平均分。在`main`中用至少5个学生对象测试。

---

## 参考答案与知识点

## 一、单项选择题答案

1.C。知识点：Java语言类别——高级语言。  
2.D。知识点：JVM直接运行`.class`字节码。  
3.A。知识点：`javac.exe`是编译器。  
4.B。知识点：JDK的`bin`目录存放可执行命令。  
5.B。知识点：字节码跨平台，JVM依赖具体平台。  
6.B。知识点：`java`命令解释执行字节码。  
7.B。知识点：`main()`是程序入口。  
8.C。知识点：`CLASSPATH`用于查找类文件。  
9.B。知识点：`String`是引用类型，不是基本数据类型。  
10.D。知识点：`double`占8字节。  
11.B。知识点：`double`可存小数；`char`不能用双引号；`boolean`不能赋1；`byte`不能存129。  
12.C。知识点：标识符不能以数字开头。  
13.B。知识点：整数除法舍去小数。  
14.A。知识点：取模结果符号与被除数一致。  
15.C。知识点：圆括号优先级最高。  
16.A。知识点：复合赋值隐含强制类型转换，`3.5`截断为3。  
17.B。知识点：三元运算符。  
18.C。知识点：JDK 7后`switch`支持`String`。  
19.B。知识点：`boolean`只接受`true/false`。  
20.D。知识点：浮点数字面量默认`double`。  
21.D。知识点：`if`条件结果必须是`boolean`。  
22.B。知识点：`break`跳出当前循环/`switch`。  
23.B。知识点：`continue`跳过本次循环剩余部分。  
24.C。知识点：`do...while`先执行后判断。  
25.C。知识点：`case`穿透。  
26.B。知识点：`while`循环输出012。  
27.B。知识点：数组下标从0开始。  
28.C。知识点：数组长度是属性`length`。  
29.B。知识点：二维数组第二维未初始化时元素为`null`。  
30.A。知识点：方法重载——同名不同参数列表。  
31.C。知识点：Java值传递；引用类型传递地址副本。  
32.B。知识点：`void`方法可写`return;`提前结束。  
33.B。知识点：`Arrays.sort()`升序排序。  
34.B。知识点：`new`实例化对象。  
35.D。知识点：`private`本类可见。  
36.C。知识点：`static`不能修饰局部变量。  
37.B。知识点：类继承用`extends`。  
38.B。知识点：重写访问权限不能小于父类。  
39.C。知识点：类可实现多个接口。  
40.C。知识点：`Throwable`是异常体系根类。

## 二、多项选择题答案

1.ACD。知识点：基本数据类型包括`int、boolean、char`；`String、Integer`是引用类型。  
2.ABCE。知识点：`switch`支持`byte、char、String、enum`等，不支持`double`。  
3.AB。知识点：`for`、`while`先判断后执行；`do...while`后判断。  
4.ABCE。知识点：关系运算符包括`>、==、!=、<=`；`&&`是逻辑运算符。  
5.ABC。知识点：`break`可用于`switch`和带标签跳出多层；`continue`只用于循环且不终止整个循环。  
6.ABCE。知识点：数组声明语法；`int a[5];`错误。  
7.ABC。知识点：面向对象三大特征：封装、继承、多态。  
8.ABD。知识点：封装隐藏细节、`private+get/set`、提高安全性；不是任意修改。  
9.ABDE。知识点：构造方法同名、无返回值、创建对象时调用、可重载；不能被`static`修饰。  
10.ACD。知识点：静态成员随类加载、被所有对象共享、静态方法不能用`this`；静态方法不能直接访问非静态成员。  
11.ABDE。知识点：类单继承、可重写、提高复用、继承`Object`；不能直接访问父类`private`。  
12.ABD。知识点：抽象类不能实例化；含抽象方法必须抽象；抽象类不一定有抽象方法；子类需实现抽象方法或也为抽象类。  
13.ABC。知识点：接口变量默认`public static final`；接口多继承；类多实现；接口不能实例化。  
14.ABD。知识点：多态表现为父类引用指向子类对象、重写、上转型；重载属于编译时静态绑定，不选。  
15.ABDE。知识点：异常体系、`finally`释放资源、`throw/throws`区别；运行时异常不强制捕获。  
16.ABCD。知识点：访问权限`private`、默认、`protected`、`public`的可见范围。  
17.ABC。知识点：`this`当前对象、`this()`本类构造、`super()`父类构造；`super`不能用于静态方法。  
18.ABCD。知识点：成员内部类访问外部私有、静态内部类限制、局部内部类、匿名内部类。  
19.ABCD。知识点：异常跳转、多个`catch`、`finally`先于`return`、`catch`子类在前。  
20.ABC。知识点：编译看左边、运行看右边、父类引用不能调子类特有方法；静态方法不支持运行时多态。

## 三、判断题答案

1.√。知识点：Java支持面向对象。  
2.×。知识点：Java由JVM解释执行，不是操作系统直接解释。  
3.×。知识点：字节码跨平台，JVM依赖平台。  
4.√。知识点：`javac`编译源文件。  
5.√。知识点：`boolean`只有两个值。  
6.×。知识点：`double`不能自动转为`int`。  
7.√。知识点：`byte`范围-128～127。  
8.√。知识点：Java使用Unicode，`char`可存中文。  
9.×。知识点：`switch`不支持`double`。  
10.√。知识点：`do...while`至少执行一次。  
11.√。知识点：数组长度固定。  
12.×。知识点：最大下标为`length-1`。  
13.×。知识点：`void`方法可写`return;`。  
14.√。知识点：重载同名不同参数列表。  
15.√。知识点：类与对象关系。  
16.×。知识点：封装不是所有成员都`private`。  
17.×。知识点：构造方法不能被继承。  
18.×。知识点：定义有参构造后不再自动提供无参构造。  
19.×。知识点：静态方法不能直接访问非静态成员。  
20.×。知识点：`static`不能修饰局部变量。  
21.×。知识点：类单继承，接口可多继承。  
22.√。知识点：重写访问权限不能缩小。  
23.×。知识点：抽象类不能实例化。  
24.√。知识点：接口可继承多个接口。  
25.√。知识点：类可实现多个接口。  
26.√。知识点：多态编译时看引用类型。  
27.×。知识点：`Object.equals()`默认比较地址。  
28.×。知识点：`finally`无论是否异常通常都执行。  
29.√。知识点：运行时异常不强制捕获。  
30.×。知识点：`throw`抛对象，`throws`声明异常。

## 四、填空题答案

1.`javac`；`java`。知识点：编译与运行命令。  
2.`main`。知识点：程序入口。  
3.`.class`。知识点：字节码文件。  
4.1；2；4；8。知识点：整数类型字节数。  
5.小；大。知识点：自动类型转换方向。  
6.`3`；`3.333...`。知识点：整数除法与浮点除法。  
7.`false`；`true`。知识点：逻辑与/或。  
8.`String`。知识点：`switch`支持字符串。  
9.整个循环（或`switch`）；本次循环剩余部分。知识点：`break`与`continue`。  
10.`length`。知识点：数组长度属性。  
11.3；4。知识点：二维数组长度。  
12.方法名；参数列表。知识点：方法重载。  
13.封装、继承、多态。知识点：面向对象三大特征。  
14.`static`。知识点：静态成员属于类。  
15.类名；返回值类型。知识点：构造方法特征。  
16.`super`。知识点：调用父类构造/成员。  
17.`abstract`；`abstract`。知识点：抽象类与抽象方法。  
18.`interface`；`implements`。知识点：接口定义与实现。  
19.`public static final`。知识点：接口常量默认修饰符。  
20.单；多（多重）。知识点：类单继承、接口多继承。  
21.上转型（向上转型）。知识点：多态前提。  
22.`Throwable`；`Error`；`Exception`。知识点：异常体系。  
23.`try`；`catch`；`finally`。知识点：异常处理结构。  
24.`throws`；`throw`。知识点：异常声明与抛出。  
25.`Exception`（或`RuntimeException`）。知识点：自定义异常。

## 五、程序阅读题答案

1.12。知识点：`a++`先用后加，`++a`先加后用：5+7=12。  
2.`0 2`。知识点：`continue`跳过`i==1`。  
3.15。知识点：累加1～5。  
4.7。知识点：`switch`的`case`穿透：2→4→7后`break`。  
5.`Java`。知识点：`String`不可变，`replace`返回新字符串但未接收。  
6.`A B`。知识点：子类构造前先调用父类构造。  
7.`Dog`。知识点：多态，运行时调用子类重写方法。  
8.先输出`越界`，再输出`结束`。知识点：`catch`捕获数组越界，`finally`必执行。  
9.`finally`。知识点：`return`前执行`finally`。  
10.`true false`。知识点：`Integer`缓存-128～127；超出范围`==`比较地址。  
11.10。知识点：基本类型值传递，方法内修改不影响原变量。  
12.`A静态 A构造 A构造`。知识点：静态代码块只执行一次，构造方法每次创建对象都执行。  
13.`true`。知识点：字符串常量池复用同一对象。  
14.`3.14`。知识点：抽象类引用指向子类对象，多态调用`area()`。  
15.抛出`RuntimeException`，程序终止，异常信息中包含`demo`。知识点：未捕获运行时异常导致程序终止。

## 六、编程题参考答案要点

1.参考要点：`for(int i=1;i<=100;i++){ if(i%3==0 && i%5!=0){ System.out.print(i+" "); count++; } }`。知识点：循环、选择、取模、计数。  
2.参考要点：`int max=arr[0]; for(int x:arr) if(x>max) max=x; return max;`。知识点：数组遍历、方法返回值。  
3.参考要点：`private`属性、无参/有参构造、`get/set`、`toString()`。知识点：类与对象、封装、构造方法。  
4.参考要点：无参构造调用`this(1,1);`，双参构造赋值，`area()`返回`width*height`，`perimeter()`返回`2*(width+height)`。知识点：构造方法重载、`this()`、封装。  
5.参考要点：`class Counter{ static int count; Counter(){ count++; } }`，创建3个对象后输出`Counter.count`为3。知识点：`static`成员被所有对象共享。  
6.参考要点：`Animal a1=new Dog(); a1.shout(); Animal a2=new Cat(); a2.shout();`。知识点：继承、方法重写、多态。  
7.参考要点：`abstract class Shape{ abstract double area(); }`，`Circle`和`Rectangle`分别实现`area()`。知识点：抽象类、抽象方法、继承。  
8.参考要点：`interface Flyable{ void fly(); }`，`Bird`和`Airplane`实现`fly()`。知识点：接口定义与实现。  
9.参考要点：`Flyable[] fs={new Bird(),new Airplane()}; for(Flyable f:fs) f.fly();`。知识点：接口数组、多态、增强`for`。  
10.参考要点：`Outer o=new Outer(); Outer.Inner in=o.new Inner(); in.show();`，内部类可访问外部类`private num`。知识点：成员内部类、外部类对象创建内部类对象。  
11.参考要点：`try{ int r=a/b; }catch(ArithmeticException e){ System.out.println("除数不能为0"); }finally{ System.out.println("计算结束"); }`。知识点：`try-catch-finally`、`ArithmeticException`。  
12.参考要点：`class InsufficientFundsException extends Exception{...}`；`withdraw`中`if(amount>balance) throw new InsufficientFundsException("余额不足");`。知识点：自定义异常、`throw`、异常声明。  
13.参考要点：`interface Playable{ void play(); }`；`abstract class Instrument implements Playable{ String name; ...}`；`Band.perform()`中若`members==null||members.length==0`则`throw new IllegalStateException()`，否则遍历`play()`。知识点：接口、抽象类、多态、异常。  
14.参考要点：`private static int totalCount;`构造方法中`totalCount++;`，`static int getTotalCount(){ return totalCount; }`。知识点：`static`变量、构造方法、封装。  
15.参考要点：复制数组后使用`Arrays.sort`配合`Comparator`或冒泡按成绩降序；`average`累加`getScore()`除以`length`。知识点：对象数组、方法、排序、封装、平均分计算。

> 试题由AI结合书本范围生成，仅供模拟试题使用