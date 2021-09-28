> ## 字符串

### 1. 字符串可被视为字符数组,只能读取，无法进行删除和修改
```js
var s = 'hello';
s[0] // "h"
s[1] // "e"
s[4] // "o"
```

### 2. length，字符串的长度

### 3. Base64 转码, JS提供了2个原生的转码方法
1. btoa()：任意值转为 Base64 编码
2. atob()：Base64 编码转为原来的值
- 这两个方法不适合非 ASCII 码的字符，会报错, 需要进行转码操作
```js
var string = 'Hello World!';
btoa(string) // "SGVsbG8gV29ybGQh"
atob('SGVsbG8gV29ybGQh') // "Hello World!"

btoa('你好') // 报错
function b64Encode(str) {
  return btoa(encodeURIComponent(str));
}

function b64Decode(str) {
  return decodeURIComponent(atob(str));
}

b64Encode('你好') // "JUU0JUJEJUEwJUU1JUE1JUJE"
b64Decode('JUU0JUJEJUEwJUU1JUE1JUJE') // "你好"
```