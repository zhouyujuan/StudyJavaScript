## JS（ES5, ES6）都有哪些数据类型？
1. 数值（number）: 整数和小数          
2. 字符串（string): 文本              
3. 布尔值（boolean）: true, false     
4. undefined: 未定义或者当声明的变量还未被初始化时                
5. null: null用来表示尚未存在的对象
6. 对象(object): 对象,各种值组成的集合. 分类：狭义的对象，数组，函数。
7. Symbol   ES6新增
8. BigInt   ES6新增


### Symbol和BigInt
- Symbol和BigInt是ES6新增的数据类型。
- Symbol 表示的是独一无二且不可变的数据类型。解决的是可能出现的全局变量冲突的问题。

- BigInt: 它可以表示任意精度格式的整数, 使用 BigInt 可以安全地存储和操作大整数，即使这个数已经超出了 Number 能够表示的安全整数范围.

### 原型类型和引用类型的区别
> 原始类型 [参考](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Data_structures)

- 基本类型（基本数值、基本数据类型）是一种既非对象也无方法的数据。

- 所有基本类型的值都是不可改变的。但需要注意的是，基本类型本身和一个赋值为基本类型的变量的区别。变量会被赋予一个新值，而原值不能像数组、对象以及函数那样被改变。

- 基本类型值可以被替换，但不能被改变

```js
// 使用字符串方法不会改变一个字符串
var bar = "baz";
console.log(bar);               // baz
bar.toUpperCase();
console.log(bar);               // baz

bar = bar.toUpperCase(); // 生成一个新值
```

- 针对基本类型，函数是值传递的
```js
// 基本类型
let foo = 5;

// 定义一个貌似可以改变基本类型值的函数
function addTwo(num) {
   num += 2;
}
// 和前面的函数一样
function addTwo_v2(foo) {
   foo += 2;
}

// 调用第一个函数，并传入基本类型值作为参数
addTwo(foo);
// Getting the current Primitive value
console.log(foo);   // 5

// 尝试调用第二个函数...
addTwo_v2(foo);
console.log(foo);   // 5
```

- 原始数据类型直接存储在栈（stack）中的简单数据段。占据空间小、大小固定，属于被频繁使用数据，所以放入栈中存储；

- Boolean、Number、String、Undefined、Null、Symbol、BigInt

> 引用类型

- 引用数据类型存储在堆（heap）中的对象，占据空间大、大小不固定。如果存储在栈中，将会影响程序运行的性能；

- 引用数据类型在栈中存储了指针，该指针指向堆中该实体的起始地址。当解释器寻找引用值时，会首先检索其在栈中的地址，取得地址后从堆中获得实体。

- 对象（object, 数组，函数等）

### 堆和栈的概念

- 栈：栈是自动分配相对固定大小的内存空间，并由系统自动释放，栈数据结构遵循FILO（first in last out）先进后出的原则

- 堆是动态分配内存，内存大小不固定，也不会自动释放，堆数据结构是一种无序的树状结构，同时它还满足key-value键值对的存储方式；我们只用知道key名，就能通过key查找到对应的value。
