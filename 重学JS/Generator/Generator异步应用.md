## 异步编程的方法
1. 回调函数
2. 事件监听
3. 发布订阅
4. Promise对象：
- 不是新的语法功能，而是一种新的写法。允许将回调函数的嵌套，改成链式调用。
- Promise 的写法只是回调函数的改进，使用then方法以后，异步任务的两段执行看得更清楚了，除此以外，并无新意。
- romise 的最大问题是代码冗余。 原来的任务被 Promise 包装了一下，不管什么操作，一眼看去都是一堆then，原来的语义变得很不清楚

## Generator函数
### 协程
- 意思是多个线程互相协作，完成异步任务。
- 协程有点像函数，又有点像线程。它的运行流程大致如下。
1. 第一步，协程A开始执行。
2. 第二步，协程A执行到一半，进入暂停，执行权转移到协程B。
3. 第三步，（一段时间后）协程B交还执行权。
4. 第四步，协程A恢复执行。

### 协程的 Generator 函数实现

- Generator 函数是协程在 ES6 的实现，最大特点就是可以交出函数的执行权（即暂停执行）。
- 整个 Generator 函数就是一个封装的异步任务，异步操作需要暂停的地方，都用yield语句注明

```js
function* gen(x) {
  var y = yield x + 2;
  return y;
}

var g = gen(1);
g.next() // { value: 3, done: false }
g.next() // { value: undefined, done: true }
/*
1. 调用 Generator 函数，会返回一个内部指针（即遍历器）g
2. 调用指针g的next方法，会移动内部指针，指向第一个遇到的yield语句.会返回一个对象，表示当前阶段的信息（value属性和done属性）
3. value属性是yield语句后面表达式的值，表示当前阶段的值；done属性是一个布尔值，表示 Generator 函数是否执行完毕，即是否还有下一个阶段。
*/
```
### Generator 函数的数据交换和错误处理
- #### Generator 函数可以暂停执行和恢复执行，这是它能封装异步任务的根本原因.
> 它还有两个特性，使它可以作为异步编程的完整解决方案
1. 函数体内外的数据交换
2. 错误处理机制。

> 1. 函数体内外的数据交换
- next返回值的 value 属性，是 Generator 函数向外输出数据；
- next方法还可以接受参数，向 Generator 函数体内输入数据。
```js
function* gen(x){
  var y = yield x + 2;
  return y;
}
var g = gen(1);
g.next() // { value: 3, done: false }
g.next(2) // { value: 2, done: true }
```
> 2. Generator 函数内部还可以部署错误处理代码，捕获函数体外抛出的错误。

```js
function* gen(x){
  try {
    var y = yield x + 2;
  } catch (e){
    console.log(e);
  }
  return y;
}

var g = gen(1);
g.next();
g.throw('出错了');
// 出错了
```
- #### 异步任务的封装
虽然 Generator 函数将异步操作表示得很简洁，但是流程管理却不方便（即何时执行第一阶段、何时执行第二阶段）
```js
var fetch = require('node-fetch');

function* gen(){
  var url = 'https://api.github.com/users/github';
  var result = yield fetch(url);
  console.log(result.bio);
}

var g = gen();
var result = g.next();

result.value.then(function(data){
  return data.json();
}).then(function(data){
  g.next(data);
});
```

## Thunk 函数

> 历史：参数的求值策略
- 传值调用：即在进入函数体之前，就计算x + 5的值

```js
var x = 1;

function f(m) {
  return m * 2;
}

f(x + 5)
// 传值调用时，等同于
f(6)
```
- 传名调用： 即直接将表达式x + 5传入函数体，只在用到它的时候求值
```js
f(x + 5)
// 传名调用时，等同于
(x + 5) * 2
```
- 传值调用比较简单。但是对参数求值的时候，实际上还没用到这个参数，有可能造成性能损失。

> Thunk 函数的含义
- 编译器的“传名调用”实现，往往是将参数放到一个临时函数之中，再将这个临时函数传入函数体。这个临时函数就叫做 Thunk 函数。

- 它是“传名调用”的一种实现策略，用来替换某个表达式

```js
function f(m) {
  return m * 2;
}

f(x + 5);

// 等同于

var thunk = function () {
  return x + 5;
};

function f(thunk) {
  return thunk() * 2;
}
```
### JavaScript 语言的 Thunk 函数
- JavaScript 语言是传值调用，它的 Thunk 函数含义有所不同
- Thunk 函数替换的不是表达式，而是多参数函数，将其替换成一个只接受回调函数作为参数的单参数函数。

```js
// 正常版本的readFile（多参数版本）
fs.readFile(fileName, callback);

// Thunk版本的readFile（单参数版本）
var Thunk = function (fileName) {
  return function (callback) {
    return fs.readFile(fileName, callback);
  };
};

var readFileThunk = Thunk(fileName);
readFileThunk(callback);
```

```js
// ES5版本
var Thunk = function(fn){
  return function (){
    var args = Array.prototype.slice.call(arguments);
    return function (callback){
      args.push(callback);
      return fn.apply(this, args);
    }
  };
};

// ES6版本
const Thunk = function(fn) {
  return function (...args) {
    return function (callback) {
      return fn.call(this, ...args, callback);
    }
  };
};

var readFileThunk = Thunk(fs.readFile);
readFileThunk(fileA)(callback);
```