> ## Math 重点方法做标记
- Math是 JavaScript 的原生对象，提供各种数学功能。该对象不是构造函数，不能生成实例，所有的属性和方法都必须在Math对象上调用
- 重点使用常用的方法：Math.abs(), Math.min(), Math.max(), Math.floor(), Math.ceil(),Math.round(), Math.random()
> ### 静态属性

1. Math.E：常数e。
2. Math.LN2：2 的自然对数。
3. Math.LN10：10 的自然对数。
4. Math.LOG2E：以 2 为底的e的对数。
5. Math.LOG10E：以 10 为底的e的对数。
6. Math.PI：常数π。
7. Math.SQRT1_2：0.5 的平方根。
8. Math.SQRT2：2 的平方根。

> ### 常用方法

#### 1. Math.abs() 返回参数值的绝对值。
```js
Math.abs(1) // 1
Math.abs(-1) // 1
```

#### 2. Math.max()，Math.min()
- Math.max方法返回参数之中最大的那个值
- Math.min返回最小的那个值
- 如果参数为空, Math.min返回Infinity, Math.max返回-Infinity。
```js
Math.max(2, -1, 5) // 5
Math.min(2, -1, 5) // -1
Math.min(...[1, 3, 2, -9]) // -9
Math.min() // Infinity
Math.max() // -Infinity
```
#### 3. Math.floor()，Math.ceil()
- Math.floor方法返回小于或等于参数值的最大整数（地板值）
```js
Math.floor(3.2) // 3
Math.floor(-3.2) // -4
```
- Math.ceil方法返回大于或等于参数值的最小整数（天花板值）
```js
Math.ceil(3.2) // 4
Math.ceil(-3.2) // -3
```
***重要应用：总是读取一个浮点数的整数部分***
```js
function getNumber(x) {
    x = Number(x);
    return x < 0 : Math.ceil(x) : Math.floor(x);
}
```

***ES6新增方法用于除去小数部分，返回整数部分***
- #### Math.trunc() 
- 对于非数值，Math.trunc内部使用Number方法将其先转为数值
```js
Math.trunc(4.1) // 4
Math.trunc(4.9) // 4
Math.trunc(-4.1) // -4
Math.trunc(-4.9) // -4
Math.trunc(-0.1234) // -0
```

#### 4. Math.round()
- Math.round方法用于四舍五入
- 注意对负数 0.5的处理
```js
Math.round(0.1) // 0
Math.round(0.5) // 1
Math.round(0.6) // 1

Math.round(-1.1) // -1
Math.round(-1.5) // -1
Math.round(-1.6) // -2
```

#### 5. Math.pow() 
- 返回以第一个参数为底数、第二个参数为指数的幂运算值
```js
Math.pow(2, 3) // 8

var radius = 20;
var area = Math.PI * Math.pow(radius, 2);
```


#### 6. Math.random()
- 返回0到1之间的一个伪随机数

- 应用：返回某个范围内的随机数
```js
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}
getRandomInt(1, 6)
```
```js
function random_str(length) {
  var ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  ALPHABET += 'abcdefghijklmnopqrstuvwxyz';
  ALPHABET += '0123456789-_';
  var str = '';
  for (var i = 0; i < length; ++i) {
    var rand = Math.floor(Math.random() * ALPHABET.length);
    str += ALPHABET.substring(rand, rand + 1);
  }
  return str;
}

random_str(6) // "NdQKOr"
```
#### 7. Math.sign()  (ES6)
- 判断一个数到底是正数、负数、还是零。对于非数值，会先将其转换为数值。
```js
// 如果没有部署这个方法的环境
Math.sign = Math.sign || function(x) {
  x = +x; // convert to a number
  if (x === 0 || isNaN(x)) {
    return x;
  }
  return x > 0 ? 1 : -1;
};
```


> ## 三角函数的方法, 双曲线方法

> ## ES2020 引入 大整数 BigInt
- 这是 ECMAScript 的第八种数据类型。BigInt 只用来表示整数，没有位数的限制，任何位数的整数都可以精确表示。



