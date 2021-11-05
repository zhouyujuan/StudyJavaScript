## void 0 和 undefined

```js
function foo() {
    var a = arguments[0] !== (void 0 ) ? arguments[0] : 2;
    return a; 
}
```
1. void 0 的返回是undefined。
2.  undefind可以被重写。

- 为什么是void 0

1. void 运算符能对给定的表达式进行求值，然后返回 undefined。
2. 也就是说，void 后面你随便跟上一个表达式，返回的都是 undefined，如 void (2), void (‘hello’)。并且void是不能被重写的。
3. 但为什么是void 0 呢，void 0 是表达式中最短的。用 void 0 代替 undefined 能节省字节。不少 JavaScript 压缩工具在压缩过程中，正是将 undefined 用 void 0 代替掉了。
