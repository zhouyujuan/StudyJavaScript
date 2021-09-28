# 简介

- Class 可以通过extends关键字实现继承
-  ES5 的通过修改原型链实现继承。
```js
class Point {}
class ColorPoint extends Point {}
```
- super：表示父类的构造函数，用来新建父类的this对象。
- 子类必须在constructor方法中调用super方法，否则新建实例时会报错。
- 子类自己的this对象，必须先通过父类的构造函数完成塑造，得到与父类同样的实例属性和方法，然后再对其进行加工，加上子类自己的实例属性和方法。如果不调用super方法，子类就得不到this对象。
```js
class Point { /* ... */ }

class ColorPoint extends Point {
  constructor() {
  }
}

let cp = new ColorPoint(); // ReferenceError
// 构造函数没有调用super方法，导致新建实例时报错。
```
### 继承机制
- ES6 的继承机制完全不同，实质是先将父类实例对象的属性和方法，加到this上面（所以必须先调用super方法），然后再用子类的构造函数修改this。
- ES5 的继承，实质是先创造子类的实例对象this，然后再将父类的方法添加到this上面（Parent.apply(this)）

```js
class ColorPoint extends Point {
}

// 等同于
class ColorPoint extends Point {
  constructor(...args) {
    super(...args);
  }
}
```
- Object.getPrototypeOf方法可以用来从子类上获取父类。
```js
Object.getPrototypeOf(ColorPoint) === Point // true
```

### super
- super这个关键字，既可以当作函数使用，也可以当作对象使用。
- 第一种情况，super作为函数调用时，代表父类的构造函数。
```js
class A {}

class B extends A {
  constructor() {
    super();
  }
}
```
- super虽然代表了父类A的构造函数，但是返回的是子类B的实例，即super内部的this指的是B的实例，因此super()在这里相当于A.prototype.constructor.call(this)。
- super() 作为函数，只能在自类的构造函数中调用。

```js
class A {
  constructor() {
    console.log(new.target.name);
  }
}
class B extends A {
  constructor() {
    super();
  }
}
new A() // A
new B() // B
```
- super作为对象时，在普通方法中，指向父类的原型对象；在静态方法中，指向父类。
```js
class A {
  p() {
    return 2;
  }
}

class B extends A {
  constructor() {
    super();
    console.log(super.p()); // 2
  }
}

let b = new B();

// 静态方法中
class A {
  constructor() {
    this.x = 1;
  }
  static print() {
    console.log(this.x);
  }
}

class B extends A {
  constructor() {
    super();
    this.x = 2;
  }
  static m() {
    super.print();
  }
}

B.x = 3;
B.m() // 3
// super.print指向父类的静态方法。这个方法里面的this指向的是B，而不是B的实例。

// 由于super指向父类的原型对象，所以定义在父类实例上的方法或属性，是无法通过super调用的。
class A {
  constructor() {
    this.p = 2;
  }
}
A.prototype.x = 2;

class B extends A {
  get m() {
    return super.p;
  }
}

let b = new B();
b.m // undefined
b.x
```
- 在子类普通方法中通过super调用父类的方法时，方法内部的this指向当前的子类实例。
```js
class A {
  constructor() {
    this.x = 1;
  }
  print() {
    console.log(this.x);
  }
}

class B extends A {
  constructor() {
    super();
    this.x = 2;
  }
  m() {
    super.print();
  }
}

let b = new B();
b.m() // 2   重点注意这个输出是  2 不是 1
```

```js
class A {
  constructor() {
    this.x = 1;
  }
}

class B extends A {
  constructor() {
    super();
    this.x = 2;
    super.x = 3;
    console.log(super.x); // undefined
    console.log(this.x); // 3
  }
}

let b = new B();
```
- 上面代码中，super.x赋值为3，这时等同于对this.x赋值为3。而当读取super.x的时候，读的是A.prototype.x，所以返回undefined。

- 对象总是继承其他对象的，所以可以在任意一个对象中，使用super关键字。

### 类的 prototype 属性和__proto__属性
- ES5 实现之中，每一个对象都有__proto__属性，指向对应的构造函数的prototype属性。
- Class 作为构造函数的语法糖，同时有prototype属性和__proto__属性，因此同时存在两条继承链。
1. 子类的__proto__属性，表示构造函数的继承，总是指向父类。
2. 子类prototype属性的__proto__属性，表示方法的继承，总是指向父类的prototype属性。

```js
class A {
}

class B extends A {
}

B.__proto__ === A // true
B.prototype.__proto__ === A.prototype // true
```
- 类的继承

```js
class A {}
class B {}

// B 的实例继承 A 的实例
Object.setPrototypeOf(B.prototype, A.prototype);
// B 继承 A 的静态属性
Object.setPrototypeOf(B, A);
const b = new B();

Object.setPrototypeOf = function (obj, proto) {
  obj.__proto__ = proto;
  return obj;
}
```
- 作为一个对象，子类（B）的原型（__proto__属性）是父类（A）；
- 作为一个构造函数，子类（B）的原型对象（prototype属性）是父类的原型对象（prototype属性）的实例。

### 实例的 __proto__ 属性
- 子类实例的__proto__属性的__proto__属性，指向父类实例的__proto__属性
- 子类的原型的原型，是父类的原型。
```js
var p1 = new Point(2, 3);
var p2 = new ColorPoint(2, 3, 'red');

p2.__proto__ === p1.__proto__ // false
p2.__proto__.__proto__ === p1.__proto__ // true
```

### 原生构造函数的继承
- 原生构造函数是指语言内置的构造函数，通常用来生成数据结构
1. Boolean()
2. Number()
3. String()
4. Array()
5. Date()
6. Function()
7. RegExp()
8. Error()
9. Object()

- es5中原生构造函数无法继承.比如，不能自己定义一个Array的子类
```js
function MyArray() {
  Array.apply(this, arguments);
}

MyArray.prototype = Object.create(Array.prototype, {
  constructor: {
    value: MyArray,
    writable: true,
    configurable: true,
    enumerable: true
  }
});
var colors = new MyArray();
colors[0] = "red";
colors.length  // 0

colors.length = 0;
colors[0]  // "red"
/*
原因：
子类无法获得原生构造函数的内部属性
原生构造函数会忽略apply方法传入的this，也就是说，原生构造函数的this无法绑定，导致拿不到内部属性。
S5 是先新建子类的实例对象this，再将父类的属性添加到子类上，由于父类的内部属性无法获取，导致无法继承原生的构造函数。
*/
```
- ES6 允许继承原生构造函数定义子类
 ES6 是先新建父类的实例对象this，然后再用子类的构造函数修饰this，使得父类的所有行为都可以继承。
```js
class MyArray extends Array {
  constructor(...args) {
    super(...args);
  }
}

var arr = new MyArray();
arr[0] = 12;
arr.length // 1

arr.length = 0;
arr[0] // undefined
```

- 继承Object的子类，有一个行为差异。
NewObj继承了Object，但是无法通过super方法向父类Object传参。这是因为 ES6 改变了Object构造函数的行为，一旦发现Object方法不是通过new Object()这种形式调用，ES6 规定Object构造函数会忽略参数。
```js
class NewObj extends Object{
  constructor(){
    super(...arguments);
  }
}
var o = new NewObj({attr: true});
o.attr === true  // false
```

### Mixin模式的实现
- Mixin 指的是多个对象合成一个新的对象，新对象具有各个组成成员的接口
```js
function mix(...mixins) {
  class Mix {
    constructor() {
      for (let mixin of mixins) {
        copyProperties(this, new mixin()); // 拷贝实例属性
      }
    }
  }

  for (let mixin of mixins) {
    copyProperties(Mix, mixin); // 拷贝静态属性
    copyProperties(Mix.prototype, mixin.prototype); // 拷贝原型属性
  }

  return Mix;
}

function copyProperties(target, source) {
  for (let key of Reflect.ownKeys(source)) {
    if ( key !== 'constructor'
      && key !== 'prototype'
      && key !== 'name'
    ) {
      let desc = Object.getOwnPropertyDescriptor(source, key);
      Object.defineProperty(target, key, desc);
    }
  }
}

class DistributedEdit extends mix(Loggable, Serializable) {
  // ...
}
```
