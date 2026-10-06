---
title: 第8章 向量代数与空间解析几何
date: 2026-10-05
category: 笔记
tags: [高等数学, 笔记]
excerpt: 高等数学第8章向量代数与空间解析几何的学习内容。
draft: true         # 还没写完就打开，列表里会显示「待补充」
---

## 第一节向量及其线性运算
### 简单概念

> 矢量：既有大小又有方向的量  
>两向量的夹角：规定以不超过π的角度为向量a，b的夹角,记作$\widehat{(\boldsymbol{a}, \boldsymbol{b})}$  
>向量平行：终点和公共起点应在一条直线  
>向量共面：起点放在同一点，如果k个终点和公共起点在一个平面上，就称这k个向量共面  
>向量加减：省略  
>向量b平行于a的充分必要条件是：存在唯一的实数λ，使$b = \lambda a$  
>空间直角坐标系![alt text](image-1.png)与卦限![alt text](image-2.png)


### 向量的模、方向角、投影
#### 向量的模
向量的大小，即为起点到终点的距离
- 向量的模![alt text](image-3.png)

#### 方向角和方向余弦
非零向量$r$与三条坐标轴的夹角$α，β，γ$，称为向量$r$的方向角

![alt text](image-4.png)

$\cos\alpha，\cos\beta，\cos\gamma$称为向量$r$的方向余弦.
以向量$r$的方向余弦为坐标的向量就是与$r$同方向的单位向量$e_r$.并由此可得$$\cos^2\alpha + \cos^2\beta + \cos^2\gamma = 1$$

#### 投影
![alt text](image-5.png)


## 第二节 数量积 向量积 混合积

### 简单概念（数量积）

> 数量积：$\vec{a} \cdot \vec{b} = \bigl| \vec{a}\bigr| \bigl| \vec{b}\bigr| \cos\widehat{(\boldsymbol{a}, \boldsymbol{b})}$  
>向量$a,b$的夹角余弦公式$\cos\widehat{(\boldsymbol{a},\boldsymbol{b})} = \frac{\boldsymbol{a} \cdot \boldsymbol{b}}{\bigl|\boldsymbol{a}\bigr| \, \bigl|\boldsymbol{b}\bigr|}$  
>数量积的坐标表达式：$a \cdot b=a_x b_x+a_y b_y+a_z b_z$  

### 向量的向量积
这部分主要是一下公式理解即可
- $\vec c$垂直于$\vec a$与$\vec b$所决定的平面，$\vec c$的模$\bigl| c \bigr| = \bigl| a \bigr|  \bigl| b \bigr| \sin \theta$,此时的$\vec c$被称为$\vec a$与$\vec b$的向量积，记作$\vec c = \vec a \times \vec b$
- $\vec a \times \vec a = 0$
- $\vec a \times \vec b = 0$是$\vec a \mathop{//} \vec b$的充要条件
- (1)$\vec a \times \vec b = - \vec b \times \vec a$
- (2)$(\vec a +\vec b)\times \vec c = \vec a \times \vec c + \vec b \times \vec c$
- (3)(3) $(\lambda \vec{a}) \times \vec{b} = \vec{a} \times (\lambda \vec{b}) = \lambda (\vec{a} \times \vec{b}) \quad (\lambda \text{ 为数})$  
- 向量积的坐标表达式$\vec{a} \times \vec{b} = (a_y b_z - a_z b_y)\,\vec{i} + (a_z b_x - a_x b_z)\,\vec{j} + (a_x b_y - a_y b_x)\,\vec{k}$,该式可写成三阶行列式$$\vec{a} \times \vec{b} =
\begin{vmatrix}
\vec{i} & \vec{j} & \vec{k} \\
a_x & a_y & a_z \\
b_x & b_y & b_z
\end{vmatrix}$$

### 向量的混合积
向量$\vec{a}、\vec{b}、\vec{c}$的混合积定义为$(\vec{a} \times \vec{b}) \cdot \vec{c}$，记作$[\vec{a}\vec{b}\vec{c}]。$
混合积的几何意义：

- 向量的混合积的绝对值表示以向量$\vec{a}，\vec{b}，\vec{c}$内棱的平行六面体的体积  
- 其中，如果向量$\vec{a}，\vec{b}，\vec{c}$组成右手系，那么混合积符号为正  
- 反之，如果向量$\vec{a}，\vec{b}，\vec{c}$组成左手系，那么混合积符号为负  

另外，当混合积为0时向量$\vec{a}，\vec{b}，\vec{c}$共面，反之，向量$\vec{a}，\vec{b}，\vec{c}$可以构成平行六面体









































