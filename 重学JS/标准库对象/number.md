- 了解
> ### 与数值相关的全局方法

#### 1. parseInt() (ES6 Number.parseInt())
- 两个参数第一个参数: 要转换为数值的变量，第二个参数：要转换的进制
- parseInt()函数在转换字符串时，更多的是看其是否符合数值模式。它会忽略字符前面的空格，直到找到第一个非空格字符。
```js
parseInt('abc') // NaN
parseInt('.3') // NaN
parseInt('') // NaN
parseInt('+') // NaN
parseInt('+1') // 1
parseInt('1000', 2) // 8
parseInt('1000', 6) // 216
parseInt('1000', 8) // 512
```

#### 2. parseFloat() 转换为浮点数，只解析十进制 (ES6 Number.parseFloat())
```js
parseFloat('314e-2') // 3.14
parseFloat('0.0314E+2') // 3.14
parseFloat('\t\v\r12.34\n ') // 12.34
parseFloat([]) // NaN
parseFloat('FF2') // NaN
parseFloat('') // NaN
```

#### 3. isNaN 方法可以用来判断一个值是否为NaN.  只对数值有效，如果传入其他值，会被先转成数值(ES6 Number.isNaN())
- 传统的全局方法isFinite()和isNaN()的区别在于，传统方法先调用Number()将非数值的值转为数值，再进行判断，
- Number.isFinite()对于非数值一律返回false, Number.isNaN()只有对于NaN才返回true，非NaN一律返回false。
```js
isNaN(NaN) // true
isNaN(123) // false

isNaN('Hello') // true
// 相当于
isNaN(Number('Hello')) // true

// 判断NaN更可靠的方法是，利用NaN为唯一不等于自身的值的这个特点
function myIsNaN(value) {
  return value !== value;
}

```

#### 4. isFinite() 方法返回一个布尔值，表示某个值是否为正常的数值(ES6中 Number.isFinite())
- 除了Infinity、-Infinity、NaN和undefined这几个值会返回false，isFinite对于其他的数值都会返回true


#### 5. Number.isInteger() 用来判断一个数值是否为整数 (ES6)
```js
Number.isInteger(25) // true
Number.isInteger(25.0) // true
Number.isInteger(25.1) // false
```

#### 6. 安全整数和 Number.isSafeInteger() 用来判断一个整数是否落在这个范围之内
```js
Number.isSafeInteger(3) // true
Number.isSafeInteger(1.2) // false
Number.isSafeInteger(9007199254740990) // true
Number.isSafeInteger(9007199254740992) // false
```


> ### Number 对象的静态属性和实例方法

#### 静态属性
1. Number.POSITIVE_INFINITY：正的无限，指向Infinity。
2. Number.NEGATIVE_INFINITY：负的无限，指向-Infinity。
3. Number.NaN：表示非数值，指向NaN。
4. Number.MIN_VALUE：表示最小的正数（即最接近0的正数，在64位浮点数体系中为5e-324），相应的，最接近0的负数为-Number.MIN_VALUE。
5. Number.MAX_SAFE_INTEGER：表示能够精确表示的最大整数，即9007199254740991。
6. Number.MIN_SAFE_INTEGER：表示能够精确表示的最小整数，即-9007199254740991。
7. Number.EPSILON实际上是 JavaScript 能够表示的最小精度，误差如果小于这个值，就可以认为已经没有意义了，即不存在误差了。


#### 新增方法
- 允许 JavaScript 的数值使用下划线（_）作为分隔符
```js
let budget = 1_000_000_000_000;
budget === 10 ** 12 // true
```

#### 实例方法

##### 1. Number.prototype.toString()
- Number对象部署了自己的toString方法，用来将一个数值转为字符串形式。
- toString方法可以接受一个参数，表示输出的进制.

```js
// 注意必须放在()中
(10).toString() // '10'
(10).toString(2) // '1010'
```
##### 2. Number.prototype.toFixed()
- 先将一个数转为指定位数的小数，然后返回这个小数对应的字符串。

```js
// 注意这个小数的四舍五入是不确定的

(10.055).toFixed(2) // 10.05
(10.005).toFixed(2) // 10.01
```
##### 3. Number.prototype.toExponential()
- 用于将一个数转为科学计数法形式
- 参数是小数点后有效数字的位数
```js
(10).toExponential()  // "1e+1"
(10).toExponential(2) // "1.00e+1"
```
#### 4. Number.prototype.toPrecision()
- 用于将一个数转为指定位数的有效数字
```js
// 四舍五入时不太可靠，跟浮点数不是精确储存有关
(12.34).toPrecision(1) // "1e+1"
(12.34).toPrecision(2) // "12"
(12.34).toPrecision(3) // "12.3"
```
#### 5. Number.prototype.toLocaleString() 本地化
- 接受一个地区码作为参数，返回一个字符串，表示当前数字在该地区的当地书写形式。
- 第二个参数：style <br />
1. decimal，表示输出十进制形式
2. percent，表示输出百分数。
3. currency, 可以搭配currency属性，输出指定格式的货币字符串形式。
```js
(123).toLocaleString('zh-Hans-CN-u-nu-hanidec') // "一二三"

(123).toLocaleString('zh-Hans-CN', { style: 'currency', currency: 'CNY' })
// "￥123.00"

(123).toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })
// "123,00 €"

(123).toLocaleString('en-US', { style: 'currency', currency: 'USD' })
// "$123.00"
```
#### 6. 自定义方法  Number.prototype对象上面可以自定义方法，被Number的实例继承。
```js
Number.prototype.add = function (x) {
  return this + x;
};
Number.prototype.subtract = function (x) {
  return this - x;
};

(8).add(2).subtract(4) // 6
```
- 数值的自定义方法，只能定义在它的原型对象Number.prototype上面，数值本身是无法自定义属性的。