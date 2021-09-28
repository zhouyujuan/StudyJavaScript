## 基本概念
- 语法上，首先可以把它理解成，Generator 函数是一个状态机，封装了多个内部状态。
- Generator 函数除了状态机，还是一个遍历器对象生成函数。返回的遍历器对象，可以依次遍历 Generator 函数内部的每一个状态。

- 一是，function关键字与函数名之间有一个星号；二是，函数体内部使用yield表达式，定义不同的内部状态（yield在英语里的意思就是“产出”）。

```js
// 三个状态， hello, world, ending
function* helloWorldGenerator() {
  yield 'hello';
  yield 'world';
  return 'ending';
}

var hw = helloWorldGenerator();
hw.next()
// { value: 'hello', done: false }

hw.next()
// { value: 'world', done: false }

hw.next()
// { value: 'ending', done: true }

hw.next()
// { value: undefined, done: true }
```

> yield 表达式

- 由于 Generator 函数返回的遍历器对象，只有调用next方法才会遍历下一个内部状态，所以其实提供了一种可以暂停执行的函数。yield表达式就是暂停标志。暂停执行后面的操作，并将紧跟在yield后面的那个表达式的值，作为返回的对象的value属性值。下一次再从该位置继续向后执行

- yield表达式后面的表达式，只有当调用next方法、内部指针指向该语句时才会执行，因此等于为 JavaScript 提供了手动的“惰性求值”（Lazy Evaluation）的语法功能。

- 数组拍平输出
```js
var arr = [1, [[2, 3], 4], [5, 6]];

function* flatName(arr) {
  const len = arr.length;
  for (let i = 0; i < len; i++) {
    const item = arr[i];
    if (typeof item !== 'number') {
      yield* flatName(item);
    }
    else {
      yield item;
    }
  }
}

for (let item of flatName(arr)) {
  console.log('item----', item);
}
// 递归
var arr1 = [1, [[2, 3], 4], [5, 6]];
function flatArray(arr) {
  const len = arr.length;
  for (let i = 0; i < len; i++) {
    const item = arr[i];
    if (typeof item !== 'number') {
      flatArray(item);
    }
    else {
      console.log(item);
    }
  }
}
flatArray(arr1);

```

## 与 Iterator 接口的关系
- 任意一个对象的Symbol.iterator方法，等于该对象的遍历器生成函数，调用该函数会返回该对象的一个遍历器对象

- 由于 Generator 函数就是遍历器生成函数，因此可以把 Generator 赋值给对象的Symbol.iterator属性，从而使得该对象具有 Iterator 接口。

- Generator 函数执行后，返回一个遍历器对象。该对象本身也具有Symbol.iterator属性，执行后返回自身。

## next 方法的参数

- yield表达式本身没有返回值，或者说总是返回undefined。next方法可以带一个参数，该参数就会被当作上一个yield表达式的返回值。

```js
function* f() {
  for(var i = 0; true; i++) {
    var reset = yield i;
    if(reset) { i = -1; }
  }
}

var g = f();

g.next() // { value: 0, done: false }
g.next() // { value: 1, done: false }
g.next(true) // { value: 0, done: false }
```
- 这个功能有很重要的语法意义。Generator 函数从暂停状态到恢复运行，它的上下文状态（context）是不变的。通过next方法的参数，就有办法在 Generator 函数开始运行之后，继续向函数体内部注入值。也就是说，可以在 Generator 函数运行的不同阶段，从外部向内部注入不同的值，从而调整函数行为。

```js
function* foo(x) {
  var y = 2 * (yield (x + 1));
  var z = yield (y / 3);
  return (x + y + z);
}

var a = foo(5);
a.next() // Object{value:6, done:false}
a.next() // Object{value:NaN, done:false}
a.next() // Object{value:NaN, done:true}

var b = foo(5);
b.next() // { value:6, done:false }
b.next(12) // { value:8, done:false }
b.next(13) // { value:42, done:true }
/*
第二次调用next方法，将上一次yield表达式的值设为12，因此y等于24，返回y / 3的值8；
第三次调用next方法，将上一次yield表达式的值设为13，因此z等于13，这时x等于5，y等于24，所以return语句的值等于42。
*/
```
- 由于next方法的参数表示上一个yield表达式的返回值，所以在第一次使用next方法时，传递参数是无效的。
- 只有从第二次使用next方法开始，参数才是有效的。从语义上讲，第一个next方法用来启动遍历器对象，所以不用带有参数。

```js
// 如果想要第一次调用next方法时，就能够输入值，可以在 Generator 函数外面再包一层。
function wrapper(generatorFunction) {
  return function (...args) {
    let generatorObject = generatorFunction(...args);
    generatorObject.next();
    return generatorObject;
  };
}

const wrapped = wrapper(function* () {
  console.log(`First input: ${yield}`);
  return 'DONE';
});

wrapped().next('hello!')
// First input: hello!
```

## for...of 循环
- for...of循环可以自动遍历 Generator 函数运行时生成的Iterator对象，且此时不再需要调用next方法。

- 一旦next方法的返回对象的done属性为true，for...of循环就会中止，且不包含该返回对象
```js
// 注意不包含 return的返回
function* foo() {
  yield 1;
  yield 2;
  yield 3;
  yield 4;
  yield 5;
  return 6;
}

for (let v of foo()) {
  console.log(v);
}
// 1 2 3 4 5
```

- 斐波那契数列
```js
//假设一对初生兔子要一个月才到成熟期，而一对成熟兔子每月会生一对兔子，那么，由一对初生兔子开始，12 个月后会有多少对兔子呢？
// 1, 1, 2, 3, 5, 8, 13

function* fibonacci() {
  let [prev, curr] = [0, 1];
  for (;;) {
    yield curr;
    [prev, curr] = [curr, prev + curr];
  }
}

for (let n of fibonacci()) {
  if (n > 1000) break;
  console.log(n);
}
```

- 让原生的对象可以使用 for...of循环
```js
// function* objectEntries(obj) {
//   let propKeys = Reflect.ownKeys(obj);
//   for (let propKey of propKeys) {
//     if (obj[propKey].toString() === '[object Object]') {
//       yield* objectEntries(obj[propKey])
//     }
//     else {
//       yield [propKey, obj[propKey]]
//     }
//   }
// }
function* objectEntries(obj) {
  let propKeys = Reflect.ownKeys(obj);
  for (let propKey of propKeys) {
    yield [propKey, obj[propKey]]
  }
}

let jane = {first: 'zz', last: 'yy', middle: {a: 1, b: 2}}

for (let [key, value] of objectEntries(jane)) {
  console.log(`key: ${key}, value: ${value}`)
}

// 另一种方法
function* objectEntries(this) {
  let propKeys = Reflect.ownKeys(this);
  for (let propKey of propKeys) {
    yield [propKey, this[propKey]]
  }
}
let jane = {first: 'zz', last: 'yy', middle: {a: 1, b: 2}}
jane[Symbol.iterator] = objectEntries;

for (let [key, value] of jane) {
  console.log(`key: ${key}, value: ${value}`)
}

// Uncaught TypeError: Found non-callable @@iterator
console.log(...jane);

const {first} = jane;
console.log('first------', first); // zz

// 部署之后可以正常使用 扩展运算符 和  for... of
```

## Generator.prototype.throw() 

- Generator 函数返回的遍历器对象，都有一个throw方法。
```js
var g = function* () {
  try {
    yield;
  } catch (e) {
    console.log('内部捕获', e);
  }
};

var i = g();
i.next();

try {
  i.throw('a');
  i.throw('b');
} catch (e) {
  console.log('外部捕获', e);
}
// 内部捕获 a
// 外部捕获 b
// 第一个错误被 Generator 函数体内的catch语句捕获。i第二次抛出错误，由于 Generator 函数内部的catch语句已经执行过了，不会再捕捉到这个错误了，所以这个错误就被抛出了 Generator 函数体，被函数体外的catch语句捕获。
```
- 不要混淆遍历器对象的throw方法和全局的throw命令.后者只能被函数体外的catch语句捕获。

- 如果 Generator 函数内部没有部署try...catch代码块，那么throw方法抛出的错误，将被外部try...catch代码块捕获。

```js
function* gen() {
  try {
    yield 1;
  } catch (e) {
    console.log('内部捕获');
  }
}

var g = gen();
g.throw(1);
// Uncaught 1
// next方法一次都没有执行过。这时，抛出的错误不会被内部捕获，而是直接在外部抛出，导致程序出错
```
- throw方法被捕获以后，会附带执行下一条yield表达式.
- 只要 Generator 函数内部部署了try...catch代码块，那么遍历器的throw方法抛出的错误，不影响下一次遍历。

```js
var gen = function* gen(){
  try {
    yield console.log('a');
  } catch (e) {
    // ...
  }
  yield console.log('b');
  yield console.log('c');
}

var g = gen();
g.next() // a
g.throw() // b
g.next() // c
```
- Generator 函数体外抛出的错误，可以在函数体内捕获；反过来，Generator 函数体内抛出的错误，也可以被函数体外的catch捕获
- 一旦 Generator 执行过程中抛出错误，且没有被内部捕获，就不会再执行下去了.
- 如果此后还调用next方法，将返回一个value属性等于undefined、done属性等于true的对象
```js
function* g() {
  yield 1;
  console.log('throwing an exception');
  throw new Error('generator broke!');
  yield 2;
  yield 3;
}

function log(generator) {
  var v;
  console.log('starting generator');
  try {
    v = generator.next();
    console.log('第一次运行next方法', v);
  } catch (err) {
    console.log('捕捉错误', v);
  }
  try {
    v = generator.next();
    console.log('第二次运行next方法', v);
  } catch (err) {
    console.log('捕捉错误', v);
  }
  try {
    v = generator.next();
    console.log('第三次运行next方法', v);
  } catch (err) {
    console.log('捕捉错误', v);
  }
  console.log('caller done');
}

log(g());
// starting generator
// 第一次运行next方法 { value: 1, done: false }
// throwing an exception
// 捕捉错误 { value: 1, done: false }
// 第三次运行next方法 { value: undefined, done: true }
// caller done
```

## Generator.prototype.return()

- Generator 函数返回的遍历器对象，还有一个return()方法，可以返回给定的值，并且终结遍历 Generator 函数。

```js
function* gen() {
  yield 1;
  yield 2;
  yield 3;
}

var g = gen();

g.next()        // { value: 1, done: false }
g.return('foo') // { value: "foo", done: true }
g.next()        // { value: undefined, done: true }
```

## next()、throw()、return() 的共同点
- next()是将yield表达式替换成一个值。
- throw()是将yield表达式替换成一个throw语句。
- return()是将yield表达式替换成一个return语句。
```js
const g = function* (x, y) {
  let result = yield x + y;
  return result;
};

const gen = g(1, 2);
gen.next(); // Object {value: 3, done: false}

gen.next(1); // Object {value: 1, done: true}
// 相当于将 let result = yield x + y
// 替换成 let result = 1;
```
```js
gen.throw(new Error('出错了')); // Uncaught Error: 出错了
// 相当于将 let result = yield x + y
// 替换成 let result = throw(new Error('出错了'));
```
```js
gen.return(2); // Object {value: 2, done: true}
// 相当于将 let result = yield x + y
// 替换成 let result = return 2;
```

## yield* 表达式 
- 如果在 Generator 函数内部，调用另一个 Generator 函数。需要在前者的函数体内部，自己手动完成遍历。

- ES6 提供了yield*表达式，作为解决办法，用来在一个 Generator 函数里面执行另一个 Generator 函数。

- 从语法角度看，如果yield表达式后面跟的是一个遍历器对象，需要在yield表达式后面加上星号，表明它返回的是一个遍历器对象。这被称为yield*表达式

```js
function* foo() {
  yield 'a';
  yield 'b';
}

function* bar() {
  yield 'x';
  yield* foo();
  yield 'y';
}

// 等同于
function* bar() {
  yield 'x';
  yield 'a';
  yield 'b';
  yield 'y';
}

// 等同于
function* bar() {
  yield 'x';
  for (let v of foo()) {
    yield v;
  }
  yield 'y';
}

for (let v of bar()){
  console.log(v);
}
// "x"
// "a"
// "b"
// "y"
```

- yield*命令可以很方便地取出嵌套数组的所有成员
```js
function* iterTree(tree) {
  if (Array.isArray(tree)) {
    for(let i=0; i < tree.length; i++) {
      yield* iterTree(tree[i]);
    }
  } else {
    yield tree;
  }
}

const tree = [ 'a', ['b', 'c'], ['d', 'e'] ];
[...iterTree(tree)] // ["a", "b", "c", "d", "e"]
for(let x of iterTree(tree)) {
  console.log(x);
}
```

- 使用yield*语句遍历完全二叉树
```js
// 下面是二叉树的构造函数，
// 三个参数分别是左树、当前节点和右树
function Tree(left, label, right) {
  this.left = left;
  this.label = label;
  this.right = right;
}

// 下面是中序（inorder）遍历函数。
// 由于返回的是一个遍历器，所以要用generator函数。
// 函数体内采用递归算法，所以左树和右树要用yield*遍历
function* inorder(t) {
  if (t) {
    yield* inorder(t.left);
    yield t.label;
    yield* inorder(t.right);
  }
}

// 下面生成二叉树
function make(array) {
  // 判断是否为叶节点
  if (array.length == 1) return new Tree(null, array[0], null);
  return new Tree(make(array[0]), array[1], make(array[2]));
}
let tree = make([[['a'], 'b', ['c']], 'd', [['e'], 'f', ['g']]]);

// 遍历二叉树
var result = [];
for (let node of inorder(tree)) {
  result.push(node);
}

result
// ['a', 'b', 'c', 'd', 'e', 'f', 'g']
```

## Generator 函数的this

- Generator 函数总是返回一个遍历器，ES6 规定这个遍历器是 Generator 函数的实例，也继承了 Generator 函数的prototype对象上的方法。

```js
function* g() {}

g.prototype.hello = function () {
  return 'hi!';
};

let obj = g();

obj instanceof g // true
obj.hello() // 'hi!'
```
- Generator 函数g返回的遍历器obj，是g的实例，而且继承了g.prototype。但是，如果把g当作普通的构造函数，并不会生效，因为g返回的总是遍历器对象，而不是this对象。

```js
function* g() {
  this.a = 11;
}

let obj = g();
obj.next();
obj.a // undefined
```

- Generator 函数也不能跟new命令一起用，会报错。

## 应用

> 异步操作同步化表达
- 可以把异步操作写在yield表达式里面，等到调用next方法时再往后执行。
```js
function* main() {
  var result = yield request("http://someurl");
  var resp = JSON.parse(result);
}

function request(url) {
  mkeAjaxCall(url, function(response) {
    it.next(response)
  })
}

var it = main();
it.next();
```
> 控制流管理

- 同步
```js
let steps = [step1Func, step2Func, step3Func];

function* iterateSteps(steps) {
  for(var i = 0; i < steps.length; i++) {
    var step = steps[i];
    yield step();
  }
}
```
- 部署Iterator接口