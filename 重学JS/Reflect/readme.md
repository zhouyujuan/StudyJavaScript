# Reflect

> Reflect 对象设计的目的
1. 将Object对象的一些明显属于语言内部的方法（比如Object.defineProperty），放到Reflect对象上。
- 某些方法同时在Object和Reflect对象上部署，未来的新方法将只部署在Reflect对象上

2. 修改某些Object方法的返回结果，让其变得更合理
- Object.defineProperty(obj, name, desc)在无法定义属性时，会抛出一个错误，而Reflect.defineProperty(obj, name, desc)则会返回false。

3. 让Object操作都变成函数行为。

4. Reflect对象的方法与Proxy对象的方法一一对应，只要是Proxy对象的方法，就能在Reflect对象上找到对应的方法。
```js
Reflect.apply(target, thisArg, args)
Reflect.construct(target, args)
Reflect.get(target, name, receiver)
Reflect.set(target, name, value, receiver)
Reflect.defineProperty(target, name, desc)
Reflect.deleteProperty(target, name)
Reflect.has(target, name)
Reflect.ownKeys(target)
Reflect.isExtensible(target)
Reflect.preventExtensions(target)
Reflect.getOwnPropertyDescriptor(target, name)
Reflect.getPrototypeOf(target)
Reflect.setPrototypeOf(target, prototype)
```