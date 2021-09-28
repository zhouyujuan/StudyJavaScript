## 概述

> ES6之前 社区模块加载方案
- JavaScript 一直没有模块（module）体系，无法将一个大程序拆分成互相依赖的小文件，再用简单的方法拼装起来。

- 社区制定了一些模块加载方案，最主要的有 CommonJS 和 AMD 两种
- CommonJS 用于服务器
- AMD 用于浏览器

> ES6设计思想
- 尽量的静态化，使得编译时就能确定模块的依赖关系，以及输入和输出的变量。
- CommonJS 和 AMD 模块，都只能在运行时确定这些东西。
- CommonJS 模块就是对象，输入时必须查找对象属性。
```js
// CommonJS模块
let { stat, exists, readfile } = require('fs');

// 等同于
let _fs = require('fs');
let stat = _fs.stat;
let exists = _fs.exists;
let readfile = _fs.readfile;
/*
上面代码的实质是整体加载fs模块（即加载fs的所有方法），生成一个对象（_fs），然后再从这个对象上面读取 3 个方法。这种加载称为“运行时加载”，因为只有运行时才能得到这个对象，导致完全没办法在编译时做“静态优化”
*/
```
> ES6模块 编译时加载
- ES6 模块不是对象，而是通过export命令显式指定输出的代码，再通过import命令输入。
```js
// ES6模块
import { stat, exists, readFile } from 'fs';
```
- 上面代码的实质是从fs模块加载 3 个方法，其他方法不加载。这种加载称为“编译时加载”或者静态加载，即 ES6 可以在编译时就完成模块加载，效率要比 CommonJS 模块的加载方式高。当然，这也导致了没法引用 ES6 模块本身，因为它不是对象。

- 由于 ES6 模块是编译时加载，使得静态分析成为可能.

- 就能进一步拓宽 JavaScript 的语法，比如引入宏（macro）和类型检验（type system）这些只能靠静态分析实现的功能。

- 了解ES6模块的好处
1. 不再需要UMD模块格式了，将来服务器和浏览器都会支持 ES6 模块格式。目前，通过各种工具库，其实已经做到了这一点。
2. 将来浏览器的新 API 就能用模块格式提供，不再必须做成全局变量或者navigator对象的属性。
3. 不再需要对象作为命名空间（比如Math对象），未来这些功能可以通过模块提供。

## export命令
- 模块功能主要由两个命令构成：export和import
- export命令用于规定模块的对外接口，import命令用于输入其他模块提供的功能。
- 一个模块就是一个独立的文件。该文件内部的所有变量，外部无法获取。如果你希望外部能够读取模块内部的某个变量，就必须使用export关键字输出该变量
- export输出的变量就是本来的名字，但是可以使用as关键字重命名。
```js
function v1() { ... }
function v2() { ... }

export {
  v1 as streamV1,
  v2 as streamV2,
  v2 as streamLatestVersion
};
```
- export命令规定的是对外的接口，必须与模块内部的变量建立一一对应关系。
```js
// 写法一
export var m = 1;

// 写法二
var m = 1;
export {m};

// 写法三
var n = 1;
export {n as m};
```

- export语句输出的接口，与其对应的值是动态绑定关系，即通过该接口，可以取到模块内部实时的值。
- 这一点与 CommonJS 规范完全不同。CommonJS 模块输出的是值的缓存，不存在动态更新

```js
export var foo = 'bar';
setTimeout(() => foo = 'baz', 500);
```

## import 命令
- 使用export命令定义了模块的对外接口以后，其他 JS 文件就可以通过import命令加载这个模块
- import命令接受一对大括号，里面指定要从其他模块导入的变量名。大括号里面的变量名，必须与被导入模块（profile.js）对外接口的名称相同。
- 如果想为输入的变量重新取一个名字，import命令要使用as关键字，将输入的变量重命名。
```js
import { firstName, lastName, year } from './profile.js';
import { lastName as surname } from './profile.js';
```
- import命令输入的变量都是只读的，因为它的本质是输入接口。也就是说，不允许在加载模块的脚本里面，改写接口。
```js
import {a} from './xxx.js'
a = {}; // Syntax Error : 'a' is read-only;
// 如果a是对象
a.foo = 'hello' // 合法操作
```
- import命令具有提升效果，会提升到整个模块的头部，首先执行。
- 本质是，import命令是编译阶段执行的，在代码运行之前。
```js
// 不会报错
foo();
import { foo } from 'my_module';
```

## 模块的整体加载
- 星号（*）指定一个对象，所有输出值都加载在这个对象上面。
```js
import * as circle from './circle';
```

## export default 命令
- export default命令，为模块指定默认输出。
- 一个模块只能有一个默认输出，因此export default命令只能使用一次。

```js
export default function () {
  console.log('foo');
}
```
- import命令可以为该匿名函数指定任意名字。
```js
import customName from './export-default';
customName(); // 'foo'
```
- import命令后面才不用加大括号，因为只可能唯一对应export default命令。
```js
// modules.js
function add(x, y) {
  return x * y;
}
export {add as default};
// 等同于
// export default add;

// app.js
import { default as foo } from 'modules';
// 等同于
// import foo from 'modules';
```
## export 与 import 的复合写法
- 如果在一个模块之中，先输入后输出同一个模块，import语句可以与export语句写在一起。
- 只是相当于对外转发了这两个接口，导致当前模块不能直接使用foo和bar。
```js
export { foo, bar } from 'my_module';

// 可以简单理解为
import { foo, bar } from 'my_module';
export { foo, bar };

export * as ns from "mod";
```

## 模块的继承
```js
export * from 'circle';
export var e = 2.71828182846;
export default function(x) {
  return Math.exp(x);
}
```
## 跨模块常量
```js
// constants.js 模块
export const A = 1;
export const B = 3;
export const C = 4;

// test1.js 模块
import * as constants from './constants';
console.log(constants.A); // 1
console.log(constants.B); // 3

// test2.js 模块
import {A, B} from './constants';
console.log(A); // 1
console.log(B); // 3
```
## import()

- import命令会被 JavaScript 引擎静态分析，先于模块内的其他语句执行
```js
// 报错 是句法错误，不是执行错误，import和export命令只能在模块的顶层，不能在代码块之中
if (x === 2) {
  import MyModual from './myModual';
}
```
- 这样的设计，固然有利于编译器提高效率，但也导致无法在运行时加载模块
- 在语法上，条件加载就不可能实现
- ES2020提案 引入import()函数，支持动态加载模块。import()返回一个 Promise 对象
- import()函数可以用在任何地方，不仅仅是模块，非模块的脚本也可以使用
- import()函数与所加载的模块没有静态连接关系，这点也是与import语句不相同。
- import()类似于 Node 的require方法，区别主要是前者是异步加载，后者是同步加载。

### 使用场合 import()

> 按需加载
```js
button.addEventListener('click', event => {
  import('./dialogBox.js')
  .then(dialogBox => {
    dialogBox.open();
  })
  .catch(error => {
    /* Error handling */
  })
});
```
> 条件加载
```js
if (condition) {
  import('moduleA').then(...);
} else {
  import('moduleB').then(...);
}
```
> 动态的模块路径
```js
import(f())
.then(...);
```
其他写法
```js
Promise.all([
  import('./module1.js'),
  import('./module2.js'),
  import('./module3.js'),
])
.then(([module1, module2, module3]) => {
   ···
});
```

