## Object.is 与比较操作符 “===”、“==” 的区别？

1. 使用双等号（==）进行相等判断时，如果两边的类型不一致，则会进行强制类型转化后再进行比较。
2. 使用三等号（===）进行相等判断时，如果两边的类型不一致时，不会做强制类型准换，直接返回 false。NaN不等于自身，以及+0等于-0

## Object.is被提出的背景

ES5 比较两个值是否相等，只有两个运算符：相等运算符（==）和严格相等运算符（===）。它们都有缺点，前者会自动转换数据类型，后者的NaN不等于自身，以及+0等于-0。JavaScript 缺乏一种运算，在所有环境中，只要两个值是一样的，它们就应该相等。<br />

ES6 提出“Same-value equality”（同值相等）算法，用来解决这个问题。Object.is就是部署这个算法的新方法。它用来比较两个值是否严格相等，与严格比较运算符（===）的行为基本一致。不同之处只有两个：一是+0不等于-0，二是NaN等于自身。<br />

```js
// ES5部署Object.is的方法
Object.defineProperty(Object, 'is', {
  value: function(x, y) {
    if (x === y) {
      // 针对+0 不等于 -0的情况
      return x !== 0 || 1 / x === 1 / y;
    }
    // 针对NaN的情况
    return x !== x && y !== y;
  },
  configurable: true,
  enumerable: false,
  writable: true
});
```

### === 两边不相等的情况
1. 严格相等运算符不执行类型的强制转换，即使操作符持有合理的相同值，但是不同类型的操作符，它们也不是严格相等的：
```js
1  === '1';    // => false
1  === true;   // => false
null === undefined; // => false
```
2. 对对象执行严格相等检查时，对象仅与自身严格相等.即使2个对象的属性和值完全相同，它们的值也不同：
```js
const myObject = { prop: 'Value' };
myObject === myObject; // => true

const myObject1 = { prop: 'Value' };
const myObject2 = { prop: 'Value' };
myObject1 === myObject2; // => false

```