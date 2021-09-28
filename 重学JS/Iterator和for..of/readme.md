# Iterator

## 概念

>  什么是Iterator? 为什么要有Iterator

1. 表示集合的数据结构：Array，Object, Map, Set. 用户还可以组合使用。因此需要一个种统一的接口机制，处理不同的数据结构。
2. 它是一种接口，为各种不同的数据结构提供统一的访问机制。任何数据结构只要部署 Iterator 接口，就可以完成遍历操作。

> Iterator的作用

1. 为各种数据结构，提供一个统一的、简便的访问接口；
2. 使得数据结构的成员能够按某种次序排列；
3. ES6 创造了一种新的遍历命令for...of循环，Iterator 接口主要供for...of消费

> Iterator的遍历过程

1. 创建一个指针对象，指向当前数据结构的起始位置。也就是说，遍历器对象本质上，就是一个指针对象。
2. 第一次调用指针对象的next方法，可以将指针指向数据结构的第一个成员。{value: 当前成员的值 , done: 布尔值，遍历是否结束}
3. 第二次调用指针对象的next方法，指针就指向数据结构的第二个成员。
4. 不断调用指针对象的next方法，直到它指向数据结构的结束位置。

```js
var it = makeIterator(['a', 'b']);

it.next() // { value: "a", done: false }
it.next() // { value: "b", done: false }
it.next() // { value: undefined, done: true }

function makeIterator(array) {
  var nextIndex = 0;
  return {
    next: function() {
    //   return nextIndex < array.length ?
    //     {value: array[nextIndex++], done: false} :
    //     {value: undefined, done: true};
        return nextIndex < array.length ?
            {value: array[nextIndex++]} :
            {done: true};
        }
  };
}
```
- Iterator 只是把接口规格加到数据结构之上，所以，遍历器与它所遍历的那个数据结构，实际上是分开的，完全可以写出没有对应数据结构的遍历器对象。

```js
// 遍历器对象自己描述了一个数据结构出来
var it = idMaker();

it.next().value // 0
it.next().value // 1
it.next().value // 2
// ...

function idMaker() {
  var index = 0;

  return {
    next: function() {
      return {value: index++, done: false};
    }
  };
}
```

## 默认Iterator接口

1. 为所有数据结构，提供一种统一的访问机制， for...of循环。该循环会自动去寻找 Iterator 接口。
2. 该数据结构是可遍历的，那么这种数据结构就部署了 Iterator接口。
3. 默认的 Iterator 接口部署在数据结构的Symbol.iterator属性。
4. Symbol.iterator属性本身是一个函数，就是当前数据结构默认的遍历器生成函数。

> 原生具备 Iterator接口的数据结构
1. Array
2. Map
3. Set
4. String
5. TypedArray
6. 函数的 arguments 对象
7. NodeList 对象
- 原生的，不用自己写遍历器生成函数，for...of循环会自动遍历他们。
- 其他数据结构的Iterator接口，都需要自己在Symbol.iterator属性上面部署。才会被 for...of循环遍历
```js
let arr = ['a', 'b', 'c'];
let iter = arr[Symbol.iterator]();

iter.next() // { value: 'a', done: false }
iter.next() // { value: 'b', done: false }
iter.next() // { value: 'c', done: false }
iter.next() // { value: undefined, done: true }
```

> 对象为什么没有Iterator

1. 是因为对象的哪个属性先遍历，哪个属性后遍历是不确定的，需要开发者手动指定
2. 本质上，遍历器是一种线性处理，对于任何非线性的数据结构，部署遍历器接口，就等于部署一种线性转换
3. 对象部署遍历器接口并不是很必要，因为这时对象实际上被当作 Map 结构使用，ES5 没有 Map 结构，而 ES6 原生提供了。

- 在对象上部署Iterator
```js
class RangeIterator {
  constructor(start, stop) {
    this.value = start;
    this.stop = stop;
  }

  [Symbol.iterator]() { return this; }

  next() {
    var value = this.value;
    if (value < this.stop) {
      this.value++;
      return {done: false, value: value};
    }
    return {done: true, value: undefined};
  }
}

function range(start, stop) {
  return new RangeIterator(start, stop);
}

for (var value of range(0, 3)) {
  console.log(value); // 0, 1, 2
}

```

## 调用Iterator接口的场合

1. 解构赋值
2. 扩展运算符
3. yield* （后面跟的是一个可遍历的结构，它会调用该结构的遍历器接口。）
4. for..of  Array.from()  Map(), Set(), Promise.all(), Promise.race()
- 只要某个数据结构部署了Iterator接口，就可以对它使用扩展运算符，将其转为数组。

## 字符串的 Iterator 接口 

- 字符串是一个类似数组的对象，也原生具有 Iterator 接口。
```js
var someString = "hi";
typeof someString[Symbol.iterator]
// "function"  调用Symbol.iterator方法返回一个遍历器对象
var iterator = someString[Symbol.iterator]();
iterator.next()  // { value: "h", done: false }
iterator.next()  // { value: "i", done: false }
iterator.next()  // { value: undefined, done: true }
```
可以覆盖原生的Symbol.iterator方法，达到修改遍历器行为的目的。
```js
var str = new String("hi");

[...str] // ["h", "i"]

str[Symbol.iterator] = function() {
  return {
    next: function() {
      if (this._first) {
        this._first = false;
        return { value: "bye", done: false };
      } else {
        return { done: true };
      }
    },
    _first: true
  };
};

[...str] // ["bye"]
str // "hi"
```

## Iterator 接口与 Generator 函数

```js
let myIterable = {
  [Symbol.iterator]: function* () {
    yield 1;
    yield 2;
    yield 3;
  }
};
[...myIterable] // [1, 2, 3]

// 或者采用下面的简洁写法

let obj = {
  * [Symbol.iterator]() {
    yield 'hello';
    yield 'world';
  }
};

for (let x of obj) {
  console.log(x);
}
// "hello"
// "world"
```

## 遍历器对象的 return()，throw()

- 遍历器对象除了具有next()方法，还可以具有return()方法和throw()方法。如果你自己写遍历器对象生成函数，那么next()方法是必须部署的，return()方法和throw()方法是否部署是可选的。

```js
function readLinesSync(file) {
  return {
    [Symbol.iterator]() {
      return {
        next() {
          return { done: false };
        },
        return() {
          file.close();
          return { done: true };
        }
      };
    },
  };
}

// 情况一
for (let line of readLinesSync(fileName)) {
  console.log(line);
  break;
}

// 情况二
for (let line of readLinesSync(fileName)) {
  console.log(line);
  throw new Error();
}
```

## for...of 循环

- for...of循环，作为遍历所有数据结构的统一的方法。
- 一个数据结构只要部署了Symbol.iterator属性，就被视为具有 iterator 接口，就可以用for...of循环遍历它的成员。
- 有着同for...in一样的简洁语法，但是没有for...in那些缺点。
- 不同于forEach方法，它可以与break、continue和return配合使用。
- 提供了遍历所有数据结构的统一操作接口。

## 数组
- JavaScript 原有的for...in循环，只能获得对象的键名，不能直接获取键值
- for...of循环，允许遍历获得键值
- 如果要通过for...of循环，获取数组的索引，可以借助数组实例的entries方法和keys方法
```js
var arr = ['a', 'b', 'c', 'd'];

for (let a in arr) {
  console.log(a); // 0 1 2 3
}

for (let a of arr) {
  console.log(a); // a b c d
}
```
- for...of循环调用遍历器接口，数组的遍历器接口只返回具有数字索引的属性。
```js
let arr = [3, 5, 7];
arr.foo = 'hello';

for (let i in arr) {
  console.log(i); // "0", "1", "2", "foo"
}

for (let i of arr) {
  console.log(i); //  "3", "5", "7"
}


let arr1 = [{a: 1}, {b: 2}];
for (let i in arr1) {
  console.log(i); // 0, 1
}

for (let i of arr1) {
  console.log(i); // {a: 1} {b: 2}
}

```

## 计算生成的数据结构
- ES6 的数组、Set、Map 都部署了以下三个方法，调用后都返回遍历器对象。
1. entries() 返回一个遍历器对象，用来遍历[键名, 键值]组成的数组。对于数组，键名就是索引值；对于 Set，键名与键值相同。Map 结构的 Iterator 接口，默认就是调用entries方法。
2. keys() 返回一个遍历器对象，用来遍历所有的键名。
3. values() 返回一个遍历器对象，用来遍历所有的键值。

## 类似数组的对象
```js
// 字符串
let str = "hello";

for (let s of str) {
  console.log(s); // h e l l o
}

// DOM NodeList对象
let paras = document.querySelectorAll("p");

for (let p of paras) {
  p.classList.add("test");
}

// arguments对象
function printArgs() {
  for (let x of arguments) {
    console.log(x);
  }
}
printArgs('a', 'b');
// 'a'
// 'b'
```
对于字符串来说，for...of循环还有一个特点，就是会正确识别 32 位 UTF-16 字符
```js
for (let x of 'a\uD83D\uDC0A') {
  console.log(x);
}
// 'a'
// '\uD83D\uDC0A'
```
并不是所有类似数组的对象都具有 Iterator 接口，一个简便的解决方法，就是使用Array.from方法将其转为数组。
```js
let arrayLike = { length: 2, 0: 'a', 1: 'b' };

// 报错
for (let x of arrayLike) {
  console.log(x);
}

// 正确
for (let x of Array.from(arrayLike)) {
  console.log(x);
}
```

## 对象
- 对于普通的对象，for...in循环可以遍历键名，for...of循环会报错
- 一种解决方法是，使用Object.keys方法将对象的键名生成一个数组，然后遍历这个数组
```js
for (var key of Object.keys(someObject)) {
  console.log(key + ': ' + someObject[key]);
}
```
- 另一个方法是使用 Generator 函数将对象重新包装一下。
```js
const obj = { a: 1, b: 2, c: 3 }

function* entries(obj) {
  for (let key of Object.keys(obj)) {
    yield [key, obj[key]];
  }
}

for (let [key, value] of entries(obj)) {
  console.log(key, '->', value);
}
// a -> 1
// b -> 2
// c -> 3
```
- for...in循环不仅遍历数字键名，还会遍历手动添加的其他键，甚至包括原型链上的键。for...in循环主要是为遍历对象而设计的.