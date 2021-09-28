## 浏览器加载
> 传统方法

- <script></script> 标签， 同步下载，容易造成浏览器的堵塞，界面卡死
- <script defer></script> <script async></script> 异步下载
- type="applicatioin/javascript"
- defer: "渲染完再执行"。
1. 等到整个页面在内存中正常渲染结束（DOM 结构完全生成，以及其他脚本执行完成），才会执行； 
2. 多个defer脚本，会按照它们在页面出现的顺序加载

- async: “下载完就执行”
1. 一旦下载完，渲染引擎就会中断渲染，执行这个脚本以后，再继续渲染。
2. 多个async脚本是不能保证加载顺序的.

> ES6模块加载
- <script type="module"></script> 告知浏览器这是一个ES6模块
- 浏览器对于带有type="module"的<script></script>,都是异步加载.等同于打开defer属性
- script 标签的async属性也可以打开，这时只要加载完成，渲染引擎就会中断渲染立即执行。执行完成后，再恢复渲染。
- ES6 模块也允许内嵌在网页中，语法行为与加载外部脚本完全一致
```js
<script type="module">
  import utils from "./utils.js";
  // other code
</script>
```
> 模块加载外部脚本的注意事项
1. 代码是在模块作用域之中运行，而不是在全局作用域运行。模块内部的顶层变量，外部不可见。
2. 模块脚本自动采用严格模式，不管有没有声明use strict。
3. 模块之中，可以使用import命令加载其他模块（.js后缀不可省略，需要提供绝对 URL 或相对 URL），也可以使用export命令输出对外接口。
4. 模块之中，顶层的this关键字返回undefined，而不是指向window。也就是说，在模块顶层使用this关键字，是无意义的。
5. 同一个模块如果加载多次，将只执行一次。

## ES6 模块与 CommonJS 模块的差异
1. CommonJS 模块输出的是一个值的拷贝，ES6 模块输出的是值的引用。
2. CommonJS 模块是运行时加载，ES6 模块是编译时输出接口。
3. CommonJS 模块的require()是同步加载模块，ES6 模块的import命令是异步加载，有一个独立的模块依赖的解析阶段。

> 针对第二点
1. 第二个差异是因为 CommonJS 加载的是一个对象（即module.exports属性），该对象只有在脚本运行完才会生成。
2. ES6 模块不是对象，它的对外接口只是一种静态定义，在代码静态解析阶段就会生成。

> 针对第一点
1. CommonJS 模块输出的是值的拷贝，也就是说，一旦输出一个值，模块内部的变化就影响不到这个值。
```js
// lib.js
var counter = 3;
function incCounter() {
  counter++;
}

module.exports = {
  counter: counter,
  incCounter: incCounter,
};
// 更改下
module.exports = {
   get counter() {
    return counter
  },
  incCounter: incCounter, 
}

// main.js
var mod = require('./lib');

console.log(mod.counter);  // 3
mod.incCounter();
console.log(mod.counter); // 3
// 这是因为mod.counter是一个原始类型的值，会被缓存。除非写成一个函数，才能得到内部变动后的值。
```

2. ES6 模块的运行机制,JS 引擎对脚本静态分析的时候，遇到模块加载命令import，就会生成一个只读引用.等到脚本真正执行时，再根据这个只读引用，到被加载的那个模块里面去取值.(ES6 模块是动态引用，并且不会缓存值，模块里面的变量绑定其所在的模块).

```js
// lib.js
export let counter = 3;
export function incCounter() {
  counter++;
}

// main.js
import { counter, incCounter } from './lib';
console.log(counter); // 3
incCounter();
console.log(counter); // 4
```
```js
// lib.js
export let obj = {};

// main.js
import { obj } from './lib';

obj.prop = 123; // OK
obj = {}; // TypeError
```
3. 可以对obj添加属性，但是重新赋值就会报错。因为变量obj指向的地址是只读的，不能重新赋值
4. export通过接口，输出的是同一个值。不同的脚本加载这个接口，得到的都是同样的实例。

## Node.js 的模块加载方法
- ES6模块（ESM）, CommonJS (CJS)
- CJS是Node.js专用，与ES6模块不兼容。语法区别：CJS(require()和module.exports), ES6(import和export)

- Node.js V13.2版本后，默认打开 ES6模块， 
- 并且ES6模块采用.mjs后缀文件名。
- 如果不想更改后缀名为.mjs 可以在项目中package.json文件中type字段指定为module
- 如果还想用CJS, 需要把对应的脚本后缀名修改为.cjs, 如果没有type字段或者type字段为commonjs,则.js脚本会被解释成CommonJS

- 两种模块尽量不要混合使用

- 总结 **.mjs文件总是以 ES6 模块加载，.cjs文件总是以 CommonJS 模块加载，.js文件的加载取决于package.json里面type字段的设置**

## package.json的main字段

- 指定模块的入口文件：
1. main
2. exports
```js
// package.json
{
  "type": "module",
  "main": "./src/index.js"
}

import { something } from 'es-module-package';
// 实际加载的是 ./node_modules/es-module-package/src/index.js
```
## exports: exports字段的优先级高于main字段。
1. 子目录别名：package.json文件的exports字段可以指定脚本或子目录的别名。
```js
// ./node_modules/es-module-package/package.json
{
  "exports": {
    "./submodule": "./src/submodule.js"
  }
}

import submodule from 'es-module-package/submodule';
// 加载 ./node_modules/es-module-package/src/submodule.js
```
2. main的别名
- exports字段的别名如果是“.”，就代表模块的主入口，优先级高于main字段，并且可以直接简写成exports字段的值。
```js
{
  "exports": {
    ".": "./main.js"
  }
}

// 等同于
{
  "exports": "./main.js"
}
```

### CommonJS 模块加载 ES6 模块
1. CommonJS的require()命令不能加载ES6模块，只能使用import()这个方法加载。require()不支持 ES6 模块的一个原因是，它是同步加载
```js
(async () => {
  await import('./my-app.mjs')
})();
```
### ES6 模块加载 CommonJS 模块
1. ES6 模块的import命令可以加载 CommonJS 模块，但是只能整体加载，不能只加载单一的输出项。这是因为 ES6 模块需要支持静态代码分析，而 CommonJS 模块的输出接口是module.exports，是一个对象，无法被静态分析，所以只能整体加载。
```js
// 正确
import packageMain from 'commonjs-package';
// 报错
import { method } from 'commonjs-package';
```
### 同时支持两种格式的模块
如果原始模块是 CommonJS 格式，那么可以加一个包装层。

```js
// .mjs文件
import cjsModule from '../index.js';
export const foo = cjsModule.foo;
```
另一种做法是在package.json文件的exports字段，指明两种格式模块各自的加载入口。

```js
"exports"：{
  "require": "./index.js"，
  "import": "./esm/wrapper.js"
}
```

## 循环加载
- a脚本依赖了b脚本，b脚本也依赖了a脚本

> CommonJS模块的加载原理
- CommonJS 的一个模块，就是一个脚本文件。require命令第一次加载该脚本，就会执行整个脚本，然后在内存生成一个对象。
```js
// 上面代码就是 Node 内部加载模块后生成的一个对象。该对象的id属性是模块名，exports属性是模块输出的各个接口，loaded属性是一个布尔值，表示该模块的脚本是否执行完毕。其他还有很多属性，这里都省略了。
{
  id: '...',
  exports: {},
  loaded: true,
  ...
}
// 以后需要用到这个模块的时候，就会到exports属性上面取值。即使再次执行require命令，也不会再次执行该模块，而是到缓存之中取值。也就是说，CommonJS 模块无论加载多少次，都只会在第一次加载时运行一次，以后再加载，就返回第一次运行的结果，除非手动清除系统缓存。
```

> CommonJS 模块的循环加载


