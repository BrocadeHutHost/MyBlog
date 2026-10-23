---
title: 第三章 面向对象（上）
date: 2026-10-18
category: 笔记
tags: [JAVA, 笔记]
excerpt: JAVA的学习笔记
draft: false         # 完成后设为 false，列表正常显示
order: 3
---

# 第三章 面向对象（上）

## 3.1 面向对象概述

常见程序设计模型分为**面向过程**和**面向对象**：

| 模型 | 关注点 | 说明 |
|---|---|---|
| 面向过程 | 步骤和流程 | 将问题拆解为一系列函数或模块，强调逻辑流程和函数调用 |
| 面向对象 | 对象及交互 | 将现实事物抽象为对象，通过对象之间交互完成任务；降低耦合，便于维护和复用 |

### 面向对象的三大特性

| 特性 | 说明 |
|---|---|
| 封装（Encapsulation） | 将对象的属性（特征）和行为（方法）包装起来，隐藏内部实现细节，只对外暴露公共接口，保证数据安全 |
| 继承（Inheritance） | 子类继承父类的属性和方法，实现代码复用 |
| 多态（Polymorphism） | 同一操作作用于不同对象，可以产生不同的行为 |

## 3.2 类与对象

| 概念 | 说明 |
|---|---|
| 类（Class） | 对具有共同特征和行为的一组对象的抽象定义，是一个模板 |
| 对象（Object） | 类的一个具体实例（实体） |

### 3.2.1 类的定义

类的成员主要包括**成员变量**（属性）和**成员方法**（行为）。

**定义语法**：

```java
[访问修饰符] class 类名 {
    // 成员变量（属性）
    [访问修饰符] 数据类型 变量名;

    // 成员方法（行为）
    [访问修饰符] 返回类型 方法名([参数列表]) {
        // 方法体
    }
}
```

**示例**：定义学生类 `Student`

```java
public class Student {
    String name;      // 姓名
    int classId;      // 班级
    int studentId;    // 学号
    String address;   // 地址

    // 自我介绍
    public void introduce() {
        System.out.println("大家好，我是" + classId + "班的" + name +
                           "，我的学号是" + studentId + "，我来自" + address + "。");
    }

    // 学习提示
    public void study() {
        System.out.println("我要开始学习了！");
    }
}
```

### 3.2.2 对象的创建与使用

**创建格式**：`类名 对象名 = new 类名();`

**内存原理（重点）**：

1. `new Student()` 在**堆内存**中开辟空间，创建对象，并为属性赋默认初始值（如 `null`、`0`）。
2. `Student student` 在**栈内存**中创建引用变量。
3. 将堆内存中对象的**地址值**赋给栈内存变量，从而通过变量找到对象。

**访问方式**：

| 操作 | 语法 |
|---|---|
| 访问属性 | `对象名.属性名` |
| 调用方法 | `对象名.方法名()` |

**示例**：
```java
public class Example01 {
    public static void main(String[] args) {
        // 创建 student1 对象并赋值
        Student student1 = new Student();
        student1.name = "小明";
        student1.classId = 12;
        student1.studentId = 1205;
        student1.address = "北京";
        student1.introduce();
        student1.study();

        // 创建 student2 对象并赋值
        Student student2 = new Student();
        student2.name = "张三";
        student2.classId = 13;
        student2.introduce();
        // 两个对象在内存中有不同的存储地址，互不干扰
    }
}
```

### 3.2.3 对象的引用传递

| 方式 | 传入内容 | 方法内修改 | 对原值的影响 |
|---|---|---|---|
| 值传递 | 基本数据类型的值副本 | 修改副本 | 不影响原值 |
| 引用类型参数（常称引用传递） | 对象在堆内存中的地址副本 | 通过地址修改对象属性 | **会影响原对象** |

> 注意：JAVA 方法参数只有值传递；引用类型传入的是地址副本，可以通过地址修改对象内容，但不能改变原引用指向。

**示例**：给员工加薪
```java
class Staff {
    String name;
    int salary;
}

public class Example02 {
    // 1. 传递基本类型（值传递）
    public static void modifySalary(int salary) {
        salary += 1000; // 局部变量改变，外部不影响
    }

    // 2. 传递引用类型（引用类型参数）
    public static void modifySalary(Staff staff) {
        staff.salary += 1000; // 通过地址修改堆内存数据，外部受影响
    }

    public static void main(String[] args) {
        Staff staff = new Staff();
        staff.name = "小王";
        staff.salary = 5000;

        modifySalary(staff.salary);
        System.out.println(staff.name + "加薪后薪水为 " + staff.salary + "元/月"); // 5000

        modifySalary(staff);
        System.out.println(staff.name + "加薪后薪水为 " + staff.salary + "元/月"); // 6000
    }
}
```

## 3.3 封装

### 3.3.1 为什么封装

- 不封装时，外部程序可以直接随意修改对象数据（如将银行余额修改为负数），存在安全风险。
- 封装可以隐藏对象内部细节，并在方法中加入验证逻辑，保证数据合法。

### 3.3.2 访问控制（访问修饰符）

JAVA 中通过访问修饰符控制类、方法、变量和构造函数的可见性。

| 访问修饰符 | 同一类中 | 同一包中 | 子类中 | 不同包不同类 |
|---|---|:---:|:---:|:---:|
| `public`（公共） | √ | √ | √ | √ |
| `protected`（受保护） | √ | √ | √ | — |
| `default`（默认） | √ | √ | — | — |
| `private`（私有） | √ | — | — | — |

> 注意：一个 `.java` 源文件中只能有一个 `public` 类，且文件名必须与类名相同。

### 3.3.3 封装的实现

1. 将成员变量声明为 `private`（私有化）。
2. 提供公共的 `public` 方法（`getter` 和 `setter`）供外部访问，在方法中可以加入逻辑控制。

**getter / setter 规范**：

| 方法 | 作用 | 规范 |
|---|---|---|
| `get变量名()` | 获取值 | 返回类型与变量一致，无参 |
| `set变量名(参数)` | 设置值 | 无返回值，有参；使用 `this.变量名 = 参数名` 防止命名冲突 |

```java
private String name;

public String getName() {
    return name;
}

public void setName(String name) {
    this.name = name;
}
```
**示例**：带有校验逻辑的银行账户封装

```java
class BankAccount {
    private String accountNumber;
    private double balance;

    public String getAccountNumber() {
        return accountNumber;
    }

    public void setAccountNumber(String accountNumber) {
        this.accountNumber = accountNumber;
    }

    public double getBalance() {
        return balance;
    }

    // 在 setter 中加入验证逻辑
    public void setBalance(double balance) {
        if (balance < 0) {
            System.out.println("输入金额有误！");
        } else {
            this.balance = balance;
        }
    }
}
```

### 3.3.4 实体 JavaBean

实体 JavaBean 是数据封装的一种体现，通常具有以下特点：

- 成员变量私有。
- 提供公共的无参构造方法。
- 提供公共的 `getter` 和 `setter` 方法。
- 通常实现 `Serializable` 接口（教材未提，但实际开发常见）。

比如构造一个`student`类

```java
import java.io.Serializable;
// 实现 Serializable 接口，表示这个对象可以被序列化
public class Student implements Serializable {

    // 成员变量全部私有 —— 外部不能直接改，只能通过方法访问
    private String name;   // 姓名
    private int age;       // 年龄

    // 公共的无参构造方法 —— 框架反射创建对象时要用到
    public Student() {
    }

    // 公共的 getter / setter 方法
    public String getName() {      // 获取姓名
        return name;
    }

    public void setName(String name) {  // 设置姓名
        this.name = name;               // this.name 是成员变量，name 是参数
    }

    public int getAge() {          // 获取年龄
        return age;
    }

    public void setAge(int age) {  // 设置年龄
        // 在 setter 里加校验，非法数据进不来，这就是封装的好处
        if (age < 0) {
            System.out.println("年龄不能为负数！");
        } else {
            this.age = age;
        }
    }
}
```

可以这样使用这个类

```java
public class Test {
    public static void main(String[] args) {
        // 用无参构造创建对象
        Student s = new Student();

        // 通过 setter 赋值（不能直接 s.name = "小明"，因为是 private）
        s.setName("小明");
        s.setAge(18);

        // 通过 getter 取值
        System.out.println(s.getName()); // 小明
        System.out.println(s.getAge());  // 18

        // setter 校验生效
        s.setAge(-5);                    // 输出：年龄不能为负数！
        System.out.println(s.getAge());  // 还是 18，没被改掉
    }
}
```

## 3.4 构造方法

在 JAVA 中，每个类都有一种特殊的方法用于**创建和初始化对象**，这叫构造方法（构造器）。

### 3.4.1 定义构造方法

**格式**：

```java
[访问修饰符] 构造方法名([参数列表]) {
    // 方法体
}
```

**注意事项**：

1. 构造方法名必须与类名**完全相同**。
2. 构造方法**没有返回值类型**（连 `void` 也没有）。
3. 如果没有显式定义构造方法，系统会自动提供一个**无参构造方法**。
4. 一旦定义了有参构造方法，系统**不再提供**默认无参构造。

**示例**：
```java
class Car {
    private String brand;
    private String model;
    private String engine;

    // 无参构造方法
    public Car() {
        System.out.println("调用无参构造方法，无法为属性赋初始值");
    }

    // 有参构造方法
    public Car(String brand, String model, String engine) {
        System.out.println("调用有参构造方法，成功为属性赋初始值");
        this.brand = brand;
        this.model = model;
        this.engine = engine;
    }

    public void print() {
        System.out.println("品牌：" + brand + "，型号：" + model + "，发动机：" + engine);
    }
}
```

### 3.4.2 构造方法的重载

在同一个类中，可以定义多个构造方法，只要它们的参数列表不同（个数、类型、顺序）即可，这被称为构造方法的重载。通过重载，可以使用不同的参数来初始化对象。

**示例**：
```java
class Person {
    private String name;
    private String role;
    private String subject;

    // 构造方法一
    public Person(String name, String role) {
        this.name = name;
        this.role = role;
    }

    // 构造方法二（重载）
    public Person(String name, String role, String subject) {
        this.name = name;
        this.role = role;
        this.subject = subject;
    }
}
```

### 3.4.3 `this` 关键字

`this` 代表当前对象的引用。常见用法如下：

| 用法 | 说明 | 示例 |
|---|---|---|
| 访问成员变量 | 局部变量与成员变量同名时，用 `this.变量名` 区分 | `this.name = name;` |
| 调用成员方法 | 在类的方法中调用其他成员方法，通常可省略 `this.` | `this.print();` |
| 调用构造方法 | 在构造方法中使用 `this(参数)` 调用本类另一个构造方法 | `this(name);` |

> 注意：
> - `this()` 语句必须放在构造方法的**第一行**，且只能出现一次。
> - 不能在普通成员方法中调用 `this()`，只能在构造方法中使用。
> - 不能在一个类的两个构造方法中相互使用 `this()` 调用，否则会造成死循环。

## 3.5 `static` 关键字

`static` 表示“静态”，修饰的成员属于**类本身**，不属于某个具体的对象实例，在类加载时初始化，全局共享。

### 3.5.1 静态变量（类变量）

被 `static` 修饰的成员变量。

- 无论创建多少个对象，静态变量在内存中**只有一份**，被所有对象共享。
- **访问方式**：推荐使用 `类名.静态变量名` 访问。
- **限制**：`static` 不能修饰局部变量。

**示例**：统计创建的用户数量
```java
class UserManager {
    static int userNum = 0; // 静态变量，属于类

    public UserManager() {
        userNum++; // 每次创建对象，共享的静态变量加 1
    }
}

public class Example10 {
    public static void main(String[] args) {
        new UserManager();
        new UserManager();
        new UserManager();
        // 直接用类名访问静态变量
        System.out.println("目前已创建的用户数量为" + UserManager.userNum); // 结果：3
    }
}
```

### 3.5.2 静态方法（类方法）

被 `static` 修饰的方法。

- **访问方式**：推荐使用 `类名.方法名()` 访问。
- **使用限制（重点）**：
    1. 静态方法中**只能访问静态成员**（静态变量和静态方法），不能直接访问非静态成员。
    2. 静态方法中**不能使用 `this` 和 `super` 关键字**。
    3. 静态方法可以被继承，但**不能**被重写（本质是隐藏）。

**示例**：
```java
class CarFactory {
    private static int totalCars = 0;

    // 静态方法生产汽车
    public static void produceCar() {
        totalCars++;
        System.out.println("生产了一辆汽车，当前总数量：" + totalCars);
    }

    public static int getTotalCars() {
        return totalCars;
    }
}

public class Example11 {
    public static void main(String[] args) {
        CarFactory.produceCar(); // 直接类名调用
        CarFactory.produceCar();
        System.out.println("总数量：" + CarFactory.getTotalCars());
    }
}
```

### 3.5.3 静态代码块

**格式**：

```java
static {
    // ...
}
```

- **执行时机**：在类加载时自动执行，且**只会执行一次**，优先于构造方法执行。
- **作用**：常用于初始化静态变量。

> **代码执行顺序**：
> 静态代码块 -> 实例代码块 -> 构造方法。

```java
class Student2 {
    static String name;
    int age;

    // 1. 静态代码块：类加载时执行一次
    static {
        System.out.println("执行静态代码块");
        name = "张三";
    }

    // 2. 实例代码块（普通代码块）：每次创建对象都执行，且在构造方法前
    {
        System.out.println("执行实例代码块");
        age = 18;
    }

    // 3. 构造方法
    public Student2() {
        System.out.println("执行构造方法");
    }
}

public class Example12 {
    public static void main(String[] args) {
        new Student2();
        // 输出顺序：执行静态代码块 -> 执行实例代码块 -> 执行构造方法

        new Student2();
        // 再次创建对象，输出：执行实例代码块 -> 执行构造方法（静态代码块不再执行）
    }
}
```