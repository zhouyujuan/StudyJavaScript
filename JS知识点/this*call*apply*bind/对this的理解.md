### 关于this的问题(对this的理解)

- JavaScript 语言之中，一切皆对象，运行环境也是对象，所以函数都是在某个对象之中运行，this就是函数运行时所在的对象（环境）。这本来并不会让用户糊涂，但是 JavaScript 支持运行环境动态切换，也就是说，this的指向是动态的，没有办法事先确定到底指向哪个对象，这才是最让初学者感到困惑的地方。

- this的设计和内存中数据结构有关。

### this指向问题

- 全局环境使用this，它指的就是顶层对象window

```js
function f() {
  console.log(this === window);
}
f() // true
```

- 构造函数中的this，指的是实例对象。

```js
var Obj = function (p) {
    console.log(this); // Obj{}
    this.p = p;
};

var o = new Obj('Hello World!');
o.p // "Hello World!"
```

- 对象方法
1. 如果对象的方法里面包含this，this的指向就是方法运行时所在的对象
2. 该方法赋值给另一个对象，就会改变this的指向。

```js
var obj ={
  foo: function () {
    console.log(this);
  }
};

obj.foo() // obj
// 对象调用的方法，此时this指向的就是调用的这个对象

// 情况一
(obj.foo = obj.foo)()
// 情况二
(false || obj.foo)()
// 情况三
(1, obj.foo)()
```
```txt
1. 分析：obj.foo 是一个值 保存的是 函数的内存地址。以上三种情况，当函数调用时，运行的环境已经发生了变化。这里都指向window
2. 详细解释：javaScript引擎中，obj和obj.foo储存的是两个内存地址，暂称之为地址一和地址二，obj.foo(), 是在地之一中调用地址二，运行环境就是 obj.而（obj.foo = obj.foo）,(false || obj.foo), (1, obj.foo), 这几种情况就是 取出了地址二，进行调用，运行环境变成了全局。
```

```js
// 情况一
(obj.foo = function () {
  console.log(this);
})()
// 等同于
(function () {
  console.log(this);
})()

// 情况二
(false || function () {
  console.log(this);
})()

// 情况三
(1, function () {
  console.log(this);
})()
```
5. 如果this所在的方法不在对象的第一层，这时this只是指向当前一层的对象，而不会继承更上面的层。

```js
var a = {
  p: 'Hello',
  b: {
    m: function() {
      console.log(this.p);
    }
  }
};

a.b.m() // undefined

var a = {
  b: {
    m: function() {
      console.log(this.p);
    },
    p: 'Hello'
  }
};

var hello = a.b.m;  // 改变了this指向
hello() // undefined
```

### 注意事项

- 避免多层嵌套

```js
var o = {
  f1: function () {
    console.log(this);
    var f2 = function () {
      console.log(this);
    }();
  }
}

o.f1()
// Object
// window

//  上面代码相当于
var temp = function () {
  console.log(this);
};

var o = {
  f1: function () {
    console.log(this);
    var f2 = temp();
  }
}

// 修改
var o = {
  f1: function () {
    console.log(this);
    const that = this;
    var f2 = function () {
      console.log(that);
    }();
  }
}

o.f1()
```
- 数组方法中的this问题

```js
var o = {
  v: 'hello',
  p: [ 'a1', 'a2' ],
  f: function f() {
    this.p.forEach(function (item) {
        // 这里this指向的是window， 原因是多层this，内层的指向window
      console.log(this.v + ' ' + item);
    });
  }
}

o.f()
// undefined a1
// undefined a2

// 修改方法，固定this
 f: function f() {
     // const that = this;  // 使用变量固定this
    this.p.forEach(function (item) {
        // 这里this指向的是window， 原因是多层this，内层的指向window
      console.log(this.v + ' ' + item);
    }, this); // 使用forEach的第二个参数来固定
  }

// 也可以修改为箭头函数
var o = {
  v: 'hello',
  p: [ 'a1', 'a2' ],
  f: function f() {
    this.p.forEach((item) => {
        // 这里this指向的是window， 原因是多层this，内层的指向window
      console.log(this.v + ' ' + item);
    });
  }
}

o.f()
```

- 回调函数中的this指向
```js
var o = new Object();
o.f = function () {
  console.log(this === o);
}
// jQuery 的写法
$('#button').on('click', o.f);
// 此时this不再指向o对象，而是指向按钮的 DOM 对象，因为f方法是在按钮对象的环境中被调用的
```

### 绑定this
-  Function.prototype.call()，函数实例的call方法，可以指定函数内部this的指向（即函数执行时所在的作用域）
```js
var obj = {};
var f = function () {
  return this;
};

f() === window // true
f.call(obj) === obj // true
```
1. 如果call方法没有参数，或者参数为null或undefined，则等同于指向全局对象。
```js
var n = 123;
var obj = { n: 456 };

function a() {
  console.log(this.n);
}

a.call() // 123
a.call(null) // 123
a.call(undefined) // 123
a.call(window) // 123
a.call(obj) // 456
```
2. call方法的应用
```js
var obj = {};
obj.hasOwnProperty('toString') // false

// 覆盖掉继承的 hasOwnProperty 方法
obj.hasOwnProperty = function () {
  return true;
};
obj.hasOwnProperty('toString') // true

Object.prototype.hasOwnProperty.call(obj, 'toString') // false
```
- . Function.prototype.apply():  func.apply(thisValue, [arg1, arg2, ...])

应用1： 找出数组最大元素
```js
const a = [2, 6, 3, 19];
Math.max.apply(null, a);
```
应用2: 将数组的空元素变为undefined
```js
const a1 = [2, , 3];
const a2 = Array.apply(null, a1);
console.log(a2) // [2, undefined, 3];
// 空元素和undefined的区别：数组的forEach方法会跳过空元素，但是不会跳过undefined

var a = ['a', , 'b'];

function print(i) {
  console.log(i);
}

a.forEach(print)
// a
// b

Array.apply(null, a).forEach(print)
// a
// undefined
// b
```
应用3：转换类数组对象
```js
Array.prototype.slice.apply({0: 1, length: 1}) // [1]
```
应用4: 绑定回调函数
```js
var o = new Object();

o.f = function () {
  console.log(this === o);
}
var f = function () {
  o.f.apply(o);
  // 或者 o.f.call(o);
};
// jQuery 的写法
$('#button').on('click', f);
```
- Function.prototype.bind() bind()方法用于将函数体内的this绑定到某个对象，然后返回一个新函数
```js
var add = function (x, y) {
  return x * this.m + y * this.n;
}

var obj = {
  m: 2,
  n: 2
};

var newAdd = add.bind(obj, 5);
newAdd(5) // 20
```
1. bind 特点：每一次返回一个新函数.bind()方法每运行一次，就返回一个新函数，这会产生一些问题
```js
// 这里产生一个匿名的函数，导致取消的时候无法取消
element.addEventListener('click', o.m.bind(o));
element.removeEventListener('click', o.m.bind(o));
// 正确的写法
var listener = o.m.bind(o);
element.addEventListener('click', listener);
element.removeEventListener('click', listener);
```
2. 回调函数中this问题的解决
```js
var counter = {
  count: 0,
  inc: function () {
    'use strict';
    this.count++;
  }
};

function callIt(callback) {
  callback();
}

callIt(counter.inc.bind(counter));
counter.count // 1
```
3. 隐蔽问题
```js
var obj = {
  name: '张三',
  times: [1, 2, 3],
  print: function () {
    this.times.forEach(function (n) {
      console.log(this.name);
    });
  }
};

obj.print()
// 没有任何输出
// this.times 指向的是 obj
// this.name, 这里的this指向的是window
// 修改
var obj = {
  name: '张三',
  times: [1, 2, 3],
  print: function () {
    this.times.forEach(function (n) {
      console.log(this.name);
    }.bind(this));
  }
};

obj.print()
```