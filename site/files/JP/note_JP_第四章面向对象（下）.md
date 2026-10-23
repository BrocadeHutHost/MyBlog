---
title: 第四章 面向对象（下）
date: 2026-10-22
category: 笔记
tags: [JAVA, 笔记]
excerpt: JAVA的学习笔记
draft: false
---

# 第四章 面向对象（下）

## 4.1 继承（Inheritance）

### 4.1.1 继承的概念

- **作用**：将多个类的相同内容抽取到单独一个类中（父类），基于父类构建出新类（子类）。子类会自动拥有父类的**所有非私有属性和方法**，从而提高代码复用性，减少冗余。
- **语法格式**：使用 `extends` 关键字。

```java
class 父类 { }
class 子类 extends 父类 { }
```

**继承的注意事项（重点）**：

1.  **单继承**：Java 中类**只支持单继承**，不支持多继承。即一个类只能有一个直接父类。
    ```java
    class Student extends Person, Animal { }
    ``` 
2.  **成员访问**：子类可以继承父类的 `public` 和 `protected` 成员，**但不能继承 `private` 成员**。
    ```java
    private int age;
    ``` 
3.  **多层继承**：Java 支持多层继承（如 C 继承 B，B 继承 A）。子类和父类是相对的概念。
    ```java
    class C extends B { }
    ``` 
4.  **构造方法**：子类**不能继承**父类的构造方法。

### 4.1.2 方法的重写（Override）

**概念**：子类重新定义继承自父类的方法，提供自己的实现逻辑。

**重写规则（必须遵守）**：

| 规则内容 | 说明 | 代码示例/说明 |
|---|---|---|
| 方法签名 | 方法名、参数列表必须**完全相同** | `public void eat()` (父子类一致) |
| 返回值类型 | 必须相同（或为其子类，协变返回类型） | 父类 `Object get()`，子类 `String get()` |
| 访问权限 | 子类重写方法的访问权限**不能低于**父类 | 父类 `public`，子类不能是 `protected` |
| 静态方法 | **不能被重写**（属于类，不属于实例） | `static void method()` 不能被覆盖 |
| 私有方法 | **不能被重写**（因为子类根本无法继承 `private` 方法） | `private void method()` |
| 注解 | 建议加上 `@Override`，让编译器帮助检查 | `@Override public void eat() { ... }` |

### 4.1.3 `super` 关键字

当子类中访问父类的成员时，可能会与子类自身的成员产生混淆，此时需要使用 `super` 关键字来显式指定访问父类的成员。

**1. 访问父类成员**

- 语法：`super.父类成员变量` 或 `super.父类成员方法(参数列表)`
- 示例：如果子类和父类都有 `type` 属性，`super.type` 访问父类的，`this.type` (或直接 `type`) 访问子类的。
    ```java
    super.type = "电视机"; // 访问父类属性
    super.turnOn();       // 调用父类方法
    ```

**2. 调用父类构造方法**

语法：`super(参数列表)`

1.子类的构造方法中，**必须**调用父类的构造方法（确保父类初始化完成）。

2.如果子类构造方法的第一行没有显式调用 `super()` 或 `this()`，程序会**隐式**调用父类的**无参构造方法**。

3.如果父类**没有**无参构造方法，子类**必须**显式调用 `super(参数)`，且必须放在**第一行**。

```java
public TV(String type) {
    super(type); // 显式调用父类有参构造，必须在第一行
}
```

**3. `this` 与 `super` 的区别**

| 比较内容 | this | super |
|---|---|---|
| 属性访问 | 访问本类中的属性，如果没有则从父类中查找 | 直接访问父类中的属性 |
| 方法调用 | 调用本类中的方法，如果没有则从父类中查找 | 直接调用父类中的方法 |
| 构造方法 | 调用本类的其他构造方法 (`this()`) | 调用父类的构造方法 (`super()`) |
| **共同点** | **在调用构造方法时，都必须位于构造方法的第一行，且只能出现一次** | 同左 |

---
title: 第四章 面向对象（下）
date: 2026-10-22
category: 笔记
tags: [JAVA, 笔记]
excerpt: JAVA的学习笔记：final关键字详解及成功示例
draft: false         # 完成后设为 false，列表正常显示
---

### 4.1.4 `final` 关键字

`final` 表示“最终的、不可改变的”，用于限制修改。

| 修饰对象 | 作用 | 成功示例 |
|---|---|---|
| **类** | 最终类，**不能被继承** | `final class A { }` |
| **方法** | 最终方法，**不能被子类重写** | `public final void print() { }` |
| **变量** | 常量，**只能被赋值一次** | `final int MAX = 10;` |

**修饰类（防止继承）**
```java
// 定义最终类
final class FinalClass { }

// 编译报错：无法从最终 FinalClass 进行继承
// class SubClass extends FinalClass { }
```

**修饰方法（防止重写）**
```java
class Parent {
    // 定义最终方法
    public final void method() {
        System.out.println("核心逻辑");
    }
}

class Child extends Parent {
    // 编译报错：无法覆盖 Parent 中的 method()
    // public void method() { }
}
```

**修饰变量（定义常量）**
**基本数据类型**：值不可变。
```java
final int NUM = 10;
// NUM = 20; // 编译报错：无法为最终变量 NUM 赋值
```

**引用数据类型**：引用地址不可变，但对象内部属性可变。
```java
class Student {
    String name;
}

public class Test {
    public static void main(String[] args) {
        final Student s = new Student();
        s.name = "张三"; // 成功：修改对象属性
        // s = new Student(); // 编译报错：不能改变引用指向
    }
}
```

## 4.2 抽象类和接口

### 4.2.1 抽象类（Abstract Class）

在 Java 中，使用 `abstract` 关键字修饰的类称为抽象类。

- **语法**：`[访问修饰符] abstract class 类名 { ... }`
- **抽象方法**：只有方法声明，没有方法体。必须用 `abstract` 修饰。
    ```java
    public abstract void work(); // 无方法体
    ```
- **特点**：
    1.  包含抽象方法的类**必须是抽象类**。
    2.  抽象类中不一定包含抽象方法，但包含抽象方法的类一定是抽象类。
    3.  抽象类**不能直接实例化**（不能 `new` 对象），只能被继承。
        ```java
        Department d = new Department(); // 报错
        ```
    4.  子类必须重写父类中**所有的抽象方法**，除非子类本身也是抽象类。
    5.  抽象类中**可以有构造方法**（供子类实例化时调用 `super()`）。
        ```java
        public abstract class Department { public Department() {} }
        ```
    6.  抽象类不能用 `final` 和 `private` 修饰（因为存在的意义就是被继承/重写）。

### 4.2.2 接口（Interface）

接口是一种特殊的抽象类，表示一种规范和标准。

- **语法**：

```java
[public] interface 接口名 [extends 接口1, 接口2...] { ... }
```

- **实现**：类使用 `implements` 关键字实现接口。

    ```java
    class 类名 implements 接口1, 接口2 { ... }
    ```

**接口的特性（细节多）**：

1.  **成员变量**：接口中的变量会被隐式指定为 `public static final`（即常量）。

    ```java
    int MAX = 10;
    ```  

    

    ```java
    public static final int MAX = 10;
    ```
2.  **JDK 8 之前**：接口中可以看作是一个纯粹的抽象类，所有方法都是抽象的。
    ```java
    void play();
    ``` 
    与下式等价
     ```java
     public abstract void play();
     ```
3.  **JDK 8 开始**：接口中可以定义**默认方法**（`default` 修饰）和**静态方法**（`static` 修饰），这两种方法**可以有方法体**。这为了在不修改现有实现类的情况下扩展接口功能。
    ```java
    default void workFlow() { System.out.println("默认流程"); }
    ```
    ```java
    static void test() { System.out.println("静态方法"); }
    ```
4.  **JDK 9 开始**：接口中引入了**私有方法**（`private` 修饰），用于在接口的默认方法或静态方法中复用代码，不被外部实现类访问。
    ```java
    private void check() { System.out.println("校验逻辑"); }
    ```
5.  **多实现**：一个类可以同时实现**多个接口**。
    ```java
    class AudioPlayer implements Playable, Recordable { }
    ```
6.  **多继承**：接口与接口之间可以使用 `extends` 实现**多继承**。
    ```
    javainterface A extends B, C { }
    ```
7.  **无构造方法**：接口中**不能有构造方法**。

### 4.2.3 抽象类与接口的比较

| 比较内容 | 抽象类 | 接口 |
|---|---|---|
| **关键字** | `abstract class` | `interface` |
| **属性** | 无限制 | 必须是 `public static final` 修饰 |
| **抽象方法** | 可以定义抽象方法，也可以定义普通方法 | 可定义抽象方法，也可定义 `default` / `static` 方法（有方法体限制），JDK 9 后支持 `private` |
| **构造方法** | **可以有** | **不能有** |
| **类的关系** | 类只能继承**一个**抽象类（单继承） | 类可以实现**多个**接口（多实现） |
| **继承/实现** | 只能被类或抽象类**继承** | 可以被接口**继承**，也能被类**实现** |

**注意**：当一个类实现的两个接口中存在相同的抽象方法时，该类只需要重写一次即可。
```java
class X implements A, B { 
    @Override 
    public void say() {} 
    }// 既实现了 A 的，也实现了 B 的
``` 

## 4.3 多态（Polymorphism）

多态是面向对象的第三大特性。简单来说，就是**同一操作作用于不同的对象，可以产生不同的行为**。

### 4.3.1 多态的体现

- **核心思想**：父类的引用变量指向了子类的对象（`Animal a = new Dog();`）。
- **前提条件**：
    1. 必须有继承（或实现）关系。
    2. 子类必须重写父类的方法。
    3. 必须发生向上转型（父类引用指向子类对象）。
- **动态绑定**：编译时看父类（只能调用父类声明的方法），运行时看子类（实际执行的是子类重写后的方法）。
- **代码示例**：
    ```java
    Animal a = new Dog(); // 向上转型
    a.speak(); 
    ```

### 4.3.2 对象类型转换

在多态形式下，为了调用子类特有的方法，需要将父类引用转换为子类类型。

| 转换类型 | 说明 | 语法示例 | 注意事项 |
|---|---|---|---|
| **向上转型** | 子类转父类 | `Animal a = new Dog();` | **自动完成**。提升扩展性，但**丢失**子类特有属性和方法。 |
| **向下转型** | 父类转子类 | `Dog d = (Dog) a;` | 必须**强制转换**。前提是原引用确实指向该子类实例。 |
| **异常** | 类型转换异常 | `Dog d = (Dog) new Animal();` | 报错：`ClassCastException` (类型转换异常)。不能强转父类实例。 |

**代码示例**：
```java
Animal a = new Dog();
Dog d = (Dog) a; // 向下转型成功，可以调用 dog.houseKeep();
```

### 4.3.3 `instanceof` 关键字

- **作用**：判断一个对象是否是特定类（或其子类）的实例，返回布尔值。
- **目的**：在进行向下转型前，**先判断再转换**，避免发生 `ClassCastException`。
- **语法**：`object instanceof type`
- **代码示例**：
    ```java
    if (animal instanceof Dog) {
        Dog dog = (Dog) animal; // 安全转型
        dog.houseKeep();
    }
    ```

---

## 4.4 内部类（Inner Class）

在 Java 中，允许在一个类的内部定义另一个类，这就是内部类。

### 4.4.1 成员内部类
- **定义**：作为外部类的成员存在。
- **特点**：可以直接访问外部类的所有成员（包括私有）。
- **实例化语法**：`外部类名.内部类名 变量名 = 外部类对象.new 内部类名();`
- **代码示例**：
```java
DeviceController.Device device = controller.new Device("设备1");
```

### 4.4.2 局部内部类
- **定义**：定义在方法或代码块内部的类。
- **特点**：只能在定义它的方法内使用，类似局部变量，不能有访问修饰符。

### 4.4.3 匿名内部类（重点）
- **定义**：没有名字的内部类，只能使用一次。
- **前提**：必须继承一个父类或实现一个接口。
- **应用场景**：常作为方法的参数或直接使用。
- **语法格式**：`new 接口名/父类名() { 重写方法 };`
- **代码示例**：
```java
new Swim() { // 匿名内部类，实现了 Swim 接口
    @Override public void swimming() { System.out.println("学会了游泳"); }
}.swimming(); // 直接调用
```

### 4.4.4 静态内部类
- **定义**：使用 `static` 修饰的成员内部类。
- **特点**：不依赖于外部类对象，类似于类的一个静态成员。只能访问外部类的**静态**成员。
- **实例化语法**：`外部类名.静态内部类名 变量名 = new 外部类名.静态内部类名();`
- **代码示例**：
```java
ManageSystem.DataSave dataSave = new ManageSystem.DataSave();
```

---

## 4.5 异常（Exception）

异常是指程序运行过程中出现的意外情况，Java 提供了异常处理机制来防止程序直接崩溃。

### 4.5.1 什么是异常
- **体系结构**：所有异常的根类是 `java.lang.Throwable`。
    - **`Error`**：严重错误（如内存溢出），无法通过代码修复，程序会直接崩溃。
    - **`Exception`**：普通异常，可以通过代码处理。分为：
        - **编译时异常**（受检异常）：编译阶段必须处理，否则报错（如 `IOException`）。
        - **运行时异常**（`RuntimeException`）：编译时不报错，运行可能出错（如 `ArithmeticException` 算术异常，`NullPointerException` 空指针异常）。
- **常用方法**：
    - `getMessage()`：获取异常描述信息。
    - `printStackTrace()`：打印异常堆栈信息，定位错误位置。

### 4.5.2 `try...catch` 和 `finally` 语句

用于捕获并处理异常，防止程序中断。

```java
try {
    // 可能出现异常的代码 (如 int result = 10 / 0;)
} catch (ArithmeticException e) {
    // 捕获异常后的处理逻辑 (如 System.out.println("除数不能为0");)
} finally {
    // 无论是否发生异常，一定会执行的代码 (常用于释放资源)
}
```

- **执行顺序**：
    - `try` 无异常：执行完 `try` -> 跳过 `catch` -> 执行 `finally` -> 继续后续代码。
    - `try` 有异常且被捕获：中断 `try` 后续代码 -> 匹配 `catch` 执行处理逻辑 -> 执行 `finally` -> 继续后续代码。
    - `try` 有异常未捕获：中断 `try` -> 找不到匹配 `catch` -> **仍然执行 `finally`** -> 程序中断报错。
- **注意**：多个 `catch` 块时，**父类异常必须写在子类异常后面**。

### 4.5.3 异常的抛出和声明

| 关键字 | 位置 | 作用 | 代码示例 |
|---|---|---|---|
| **`throw`** | 方法**内部** | 手动抛出一个具体的异常对象。 | `if (num == 0) throw new ArithmeticException("除数为0");` |
| **`throws`** | 方法**声明上** | 声明该方法可能抛出的异常类型，交由调用者处理。 | `public void divide() throws Exception {}` |

### 4.5.4 自定义异常类

当 Java 内置异常不能满足业务需求时，可以自定义异常。

- **步骤**：
    1. 定义一个类，继承 `Exception`（编译时异常）或 `RuntimeException`（运行时异常）。
    2. 提供构造方法（通常包含带参构造，用于传递错误信息）。
- **代码示例**：
    ```java
    class AgeIllegalException extends Exception {
        public AgeIllegalException(String message) { super(message); }
    }
    // 使用：
    // throw new AgeIllegalException("您输入的年龄不合法！");
    ```