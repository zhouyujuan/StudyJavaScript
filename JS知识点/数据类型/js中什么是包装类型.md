## 什么是 JavaScript 中的包装类型？

- 在 JavaScript 中，基本类型是没有属性和方法的，但是为了便于操作基本类型的值，在调用基本类型的属性或方法时 JavaScript 会在后台隐式地将基本类型的值转换为对象

```js
const a = "abc";
a.length; // 3
a.toUpperCase(); // "ABC"
```

- 也可以使用Object函数显式地将基本类型转换为包装类型. 或者使用String()、Number()、Boolean()
```js
var a = 'abc'
Object(a) // String {"abc"}
```

- 也可以使用valueOf方法将包装类型倒转成基本类型

```js
var a = 'abc'
var b = Object(a)
var c = b.valueOf() // 'abc'
```

```js
var a = new Boolean( false );
if (!a) {
	console.log( "Oops" ); // never runs
}
// 答案是什么都不会打印，因为虽然包裹的基本类型是false，但是false被包裹成包装类型后就成了对象，所以其非值为false，所以循环体中的内容不会运行。
```


