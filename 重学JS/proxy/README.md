# Proxy

> ## 概述

- ### Proxy 用于修改某些操作的默认行为。 
1. 比如 console.log 覆盖这个方法，让log出来的信息自动携带时间戳。
2. 在目标对象之前设置一层“拦截”，外界访问这个对象时，必须经过这层拦截。在这里可以对访问进行改写和过滤。
```js
var obj = new Proxy({}, {
    get: function (target, propKey, receiver) {
        return Reflect.get(target, propKey, receiver)
    },
    set: function (target, propKey, value, receiver) {
        return Reflect.set(target, propKey, value, receiver);
    }
});

obj.count = 1; // set
console.log(obj.count) // get
```
3. 使用Proxy重载了obj的set和get方法。

- ### Proxy是一个构造函数
```js
var proxy = new Proxy(target, handler);
```
1. target: 表示要拦截的目标对象
2. handler: 是一个对象，用来定制拦截行为

- Proxy 实例可以作为其他对象的原型对象
```js
var proxy = new Proxy({}, {
    get: function(target, propKey) {
        return 35;
    }
});

let obj = Object.create(proxy);
obj.time // 35

```
1. proxy是obj对象的原型。
2. obj对象本身并没有time属性，所以根据原型链，会在proxy对象上读取该属性，导致被拦截，返回了35

- ### 同一个拦截函数，可以设置多个操作
1. get(target, propKey, receiver): 拦截对象属性的读取。 proxy.foo <br/>
可以接受三个参数，依次为目标对象、属性名和 proxy 实例本身, 其中最后一个参数可选。
```js
var person = {
    name: '张三'
};

var proxy = new Proxy(person, {
    get: function(target, propKey, receiver) {
        if (propKey in target) {
            return target[propKey];
        }
        throw new ReferenceError(`props name ${propKey} does not exist`)
    }
});

proxy.name // 张三
proxy.age //  Uncaught ReferenceError: props name age does not exist
```
<br />
get 方法可以继承

```js
let proto = new Proxy({}, {
  get(target, propertyKey, receiver) {
    console.log('GET ' + propertyKey);
    return target[propertyKey];
  }
});

let obj = Object.create(proto);
obj.foo // "GET foo"
```

***重点理解下来的例子-get的使用***

例题：实现数组读取负数索引

```js
function createArray(...elements) {
    var handler = {
        get: function(target, propKey, receiver) {
            let index = +propKey;
            if (index < 0) {
                propKey = String(target.length + index);
            }
            return Reflect.get(target, propKey, receiver);
        }
    }

    let array = [];
    array.push(...elements);
    return new Proxy(array, handler);
}

const array = createArray('a', 'b', 'c');
array[-1];

```

<br />
扩展下错误的类型

```js
// RangeError: 标记一个错误，当设置的数值超出相应的范围触发
// ReferenceError: 引用类型错误，当一个不存在的变量被引用时发生的错误
// SyntaxError：语法错误。
// TypeError：类型错误，表示值的类型非预期类型时发生的错误。
```
<br />

利用Proxy 将读取属性操作，转变为执行某个函数，从而实现属性的链式操作
```js
var pipe = function (value) {
  var funcStack = [];
  var oproxy = new Proxy({} , {
      
    get : function (pipeObject, fnName) {
        console.log('fnName----', fnName);
        console.log('pipeObject----', pipeObject);
        console.log('funcStack---', funcStack);
      if (fnName === 'get') {
        return funcStack.reduce(function (val, fn) {
          return fn(val);
        },value);
      }
      funcStack.push(window[fnName]);
      return oproxy;
    }
  });

  return oproxy;
}
var double = n => n * 2;
var pow    = n => n * n;
var reverseInt = n => n.toString().split("").reverse().join("") | 0;

pipe(3).double.pow.reverseInt.get; // 63
```
利用get拦截生成DOM节点
```js
const dom = new Proxy({}, {
  get(target, property) {
    return function(attrs = {}, ...children) {
      const el = document.createElement(property);
      for (let prop of Object.keys(attrs)) {
        el.setAttribute(prop, attrs[prop]);
      }
      for (let child of children) {
        if (typeof child === 'string') {
          child = document.createTextNode(child);
        }
        el.appendChild(child);
      }
      return el;
    }
  }
});

const el = dom.div({},
  'Hello, my name is ',
  dom.a({href: '//example.com'}, 'Mark'),
  '. I like:',
  dom.ul({},
    dom.li({}, 'The web'),
    dom.li({}, 'Food'),
    dom.li({}, '…actually that\'s it')
  )
);

document.body.appendChild(el);
```
第三个参数指向的是proxy对象。
```js
const proxy = new Proxy({}, {
  get: function(target, key, receiver) {
    return receiver;
  }
});

const d = Object.create(proxy);
d.a === d // true
```

2. set(target, propKey, value, receiver): 拦截对象属性的设置。proxy.foo = 'xxx'; <br />


***重点理解下来的例子-set的使用***

#### 假定Person对象有一个age属性，该属性应该是一个不大于 200 的整数 <br />

```js
let validator = {
  set: function(obj, prop, value) {
    if (prop === 'age') {
      if (!Number.isInteger(value)) {
        throw new TypeError('The age is not an integer');
      }
      if (value > 200) {
        throw new RangeError('The age seems invalid');
      }
    }

    // 对于满足条件的 age 属性以及其他属性，直接保存
    obj[prop] = value;
    return true;
  }
};

let person = new Proxy({}, validator);

person.age = 100;

person.age // 100
person.age = 'young' // 报错
person.age = 300 // 报错
```
有时，我们会在对象上面设置内部属性，属性名的第一个字符使用下划线开头，表示这些属性不应该被外部使用。结合get和set方法，就可以做到防止这些内部属性被外部读写。
```js
const handler = {
  get (target, key) {
    invariant(key, 'get');
    return target[key];
  },
  set (target, key, value) {
    invariant(key, 'set');
    target[key] = value;
    return true;
  }
};
function invariant (key, action) {
  if (key[0] === '_') {
    throw new Error(`Invalid attempt to ${action} private "${key}" property`);
  }
}
const target = {};
const proxy = new Proxy(target, handler);
proxy._prop
// Error: Invalid attempt to get private "_prop" property
proxy._prop = 'c'
// Error: Invalid attempt to set private "_prop" property
```
get，set 如果target属性本身不可读写，那么使用proxy，设置get和set时是会失效的。

3. has(target, propKey): 拦截propKey in proxy的操作，返回一个布尔值；如果原对象不可配置或者禁止扩展，这时has()拦截会报错。 对 for in 没有效果

```js
var handler = {
  has (target, key) {
    if (key[0] === '_') {
      return false;
    }
    return key in target;
  }
};
var target = { _prop: 'foo', prop: 'foo' };
var proxy = new Proxy(target, handler);
'_prop' in proxy // false
```

4. deleteProperty(target, propKey): 拦截delete proxy[propKey]的操作，返回一个布尔值；
5. ownKeys(target): 拦截如下。返回一个数组，返回的是目标对象所有自身的属性的属性名。
```js
Object.getOwnPropertyName(proxy)
Object.getOwnPropertySymbols(proxy)
Object.keys(proxy)
for..in
```
6. getOwnPropertyDescriptor(target, propKey):拦截 getOwnPropertyDescriptor 返回属性的描述对象
7. defineProperty(target, propKey, propDesc): 拦截Object.defineProperty(s) 返回布尔值
8. preventExtensions(target): 拦截 preventExtensions 返回布尔值
9. getPrototypeOf(target): 拦截 getPrototypeOf 返回一个对象。
10. isExtensible(target)：拦截Object.isExtensible(proxy)，返回一个布尔值。
11. setPrototypeOf(target, proto)：拦截Object.setPrototypeOf(proxy, proto)，返回一个布尔值。如果目标对象是函数，那么还有两种额外操作可以拦截。

12. apply(target, object, args)：拦截 Proxy 实例作为函数调用的操作，比如proxy(...args)、proxy.call(object, ...args)、proxy.apply(...)。
<br />
apply方法可以接受三个参数，分别是目标对象、目标对象的上下文对象（this）和目标对象的参数数组。

```js
console.log = new Proxy(console.log, {
  apply: function(target, ctx, args) {
    return target(`${args}--000`)
  }
})
console.log('1'); // 1--000
```

```js
var twice = {
  apply (target, ctx, args) {
    return Reflect.apply(...arguments) * 2;
  }
};
function sum (left, right) {
  return left + right;
};
var proxy = new Proxy(sum, twice);
proxy(1, 2) // 6
proxy.call(null, 5, 6) // 22
proxy.apply(null, [7, 8]) // 30
```


13. construct(target, args)：拦截 Proxy 实例作为构造函数调用的操作，比如new proxy(...args)。



- ### Proxy.revocable() 返回一个取消 代理的方法
```js
let target = {};
let handler = {};

let {proxy, revoke} = Proxy.revocable(target, handler);

proxy.foo = 123;
proxy.foo // 123

revoke(); // 取消之后，代理权限收回了。
proxy.foo // TypeError: Revoked
```