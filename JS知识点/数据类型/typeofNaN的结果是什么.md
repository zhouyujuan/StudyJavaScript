## typeof NaN的结果是什么？
- NaN 指“不是一个数字”（not a number），NaN 是一个“警戒值”（sentinel value，有特殊用途的常规值），用于指出数字类型中的错误情况，即“执行数学运算没有成功，这是失败后返回的结果”。

- NaN 是一个特殊值，它和自身不相等，是唯一一个非自反

```js
typeof NaN; // "number"

```

## isNaN 和 Number.isNaN函数的区别？

- 函数 isNaN 接收参数后，会尝试将这个参数转换为数值，任何不能被转换为数值的的值都会返回 true，因此非数字值传入也会返回 true ，会影响 NaN 的判断。

- 函数 Number.isNaN 会首先判断传入参数是否为数字，如果是数字再继续判断是否为 NaN ，不会进行数据类型的转换，这种方法对于 NaN 的判断更为准确。

```js
isNaN('dddd') // true
Number.isNaN('uuuu') // false

Number.isNaN('123') // false
isNaN('123') // false
```