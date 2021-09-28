# Promise 对象

> ## Promise 的含义
1. Promise 是一个对象。异步编程的一种解决方案

- ### Promise的特点
1. Promise的状态：pending(进行中)、fulfilled(已成功resolved)、rejected(已失败)
2. 状态流转：pending -> fulfilled;  pending -> rejected. 一经变化就状态凝固。
3. 使用Promise，可以把异步操作安装同步的流程写下来。
4. 无法取消Promise，一旦新建就立即执行
5. 不设置回调的情况，内部发生的错误不会反应到外部
6. 处于pendig状态时，无法得知进展到哪里了。

> ## Promise的基本用法
- ### 关于Promise
```js
const promise = new Promise((resolve, reject) => {
    if (// 异步操作成功) {
        resolve(res);
    }
    else {
        reject(error);
    }
});

promise().then((res) => {
    console.log('成功的回调--')
}, (error) => {
    console.log('失败回调--')
})
```
1. Promise是一个构造函数，接收一个函数作为参数
2. 该函数有两个参数：resolve, reject. 这两个参数也是函数。由引擎提供
3. resolve: 从“未完成” -> "已完成", 并传递成功的结果;  reject: 从“未完成” -> "失败"
4. 实例promise可以用then方法去指定resolve和reject的回调函数。then方法接收两个回调函数做参数。第一个是成功resolved，第二个是失败rejected
5. resolve函数返回的参数也可以是另一个promise。

```js
const p1 = new Promise((resolve, reject) => {...});
const p2 = new Promise((resolve, reject) => { resolve(p1)});
// 注意此时p1的状态就传递给了p2, 此时p1的状态就决定了p2的状态。
// 如果p1是pending那么p2的回调函数就会等待p1
// 如果p1的状态已经是resolve或者reject了，那么p2的状态也就确定了，且p2的回调会立即执行
```

- ### Promise的执行顺序
1. Promise新建后 会立即执行。
2. then方法回调函数，将在当前脚本所有的同步任务都执行换成后才会执行
3. resolve或者reject调用后，并不会终结promise的参数函数的执行。并且立即resolve的promise是在本轮事件循环的末尾执行。但是需要注意的是，如果在resolve之后再次抛出异常，是不会改变promise的状态的。因为状态已经形成就不会被改变
```js
const async1 = async () => {
    console.log('async1');
    setTimeout(() => {
        console.log('timer1');
    }, 2000);

    await new Promise(resolve => {
        console.log('promise1');
    });

    console.log('async1 end');

    return 'async1 success';
}

console.log('script start');
async1().then(res => console.log(res));
console.log('script end');
Promise.resolve(1)
    .then(2)
    .then(Promise.resolve(3))
    .catch(4)
    .then(res => console.log(res));

setTimeout(() => {
    console.log('time2');
}, 1000);
```
```js
async function testSometing() {
    console.log('执行testSometing');
    return "testSometing";
}

async function testAsync() {
    console.log('执行testAsync');
    return Promise.resolve("hellow async");
}

async function test() {
    console.log('test start...');
    const v1 = await testSometing();
    console.log(v1);

    const v2 = await testAsync();
    console.log(v2);
    console.log(v1, v2);
}

test();

var promise = new Promise(resolve => {
    console.log("promise start...");
    resolve("promise");
});

promise.then(val => console.log(val));
console.log("test end....");
```
```js
new Promise((resolve, reject) => {
    resolve(1)
    console.log(2)
}).then(r => {
    console.log(r);
})
// 2 1
new Promise((resolve, reject) => {
    resolve(1)
    throw new Error('test')
}).then(r => {
    console.log(r);
}).catch(error => {
    console.log(error);
})

```
- ### 使用Promise去封装异步请求（其他异步操作）
```js
function request(url) {
    return new Promise((resolve, reject) => {
        const client = new XMLHttpRequest();
        client.open("GET", url);
        client.onreadystatechange = function (status, response) {
            if (status === 200) {
                resolve(response);
            }
            else {
                reject(error);
            }
        }
    })
}
```
- ### Promise.prototype.then() ??????
1. then方法挂载在原型对象上，为Promise实例添加状态改变时的回调函数。
2. then方法的第一个参数是resolved状态的回调函数，第二个是rejected的回调函数
3. then方法返回的是一个新的Promise实例（不是原来的）因此可以采用链式的写法。
```js
// ???????
Promise.resolve(1)
    .then(2)
    .then(Promise.resolve(3))
    .catch(4)
    .then(res => console.log(res));

// 和上面的不能等同
Promise.resolve(1)
    .then((r) => {
        console.log('then-1--', r);
        return 2;
    })
    .then((r) => {
        console.log('then-2--', r);
        return Promise.resolve(3)
    })
    .catch(4)
    .then(res => {
        console.log('then-3--', res);
        console.log(res)
    });

```
4. 采用链式调用的then，可以指定一组按照次序调用的回调函数。这时前一个回调函数有可能返回的还是一个Promise对象（异步），这时后一个回调函数就会等待该Promise对象的状态发生变化，才会被调用

- ### Promise.prototype.catch()
1. Promise.prototype.catch方法是 .then(null, rejection)的别名。
2. catch捕获的是第一个Promise实例的异常，也可以捕获then方法中promise的异常。因为catch是挂载在Promise的原型上的。
3. 错误具有“冒泡性”总是会被下一个catch捕获
4. catch方法返回的还是一个Promise对象。
```js
request('url').then(res => {

}).catch(error => {
    // 这里可以捕获request这个Promise的异常，也可以捕获then里面回调的异常也可以在这里捕获。这个异常不会再向外传递。也不会阻断进程。
});

request1('url').then(res => {}, error => {});
// 后面这种存在的问题是，如果then中的第一个回调中出现异常，则无法捕获到
```

- ### Promise.prototype.finally
1. 不管Promise对象最后状态如何，都会执行的操作。
2. finally方法的回调函数不接受任何参数，所以在finally不知道前面Promise的状态，表明在这里的操作应该是和状态无关的。
3. finally本质是then方法的特例
```js
Promise.prototype.finally = function(callback) {
    let p = this.constructor;
    return this.then(
        value => p.resolve(callback()).then(() => value),
        reason => p.resolve(callback()).then(() => {throw reason})
    )
}
```

- ### Promise.all
1. 将多个Promise实例，包装成一个新的Promise实例。
2. Promise.all的参数是一个数组（或者具有Iterator接口），数组中都是promise实例
3. 只有当所有的promise实例都是fulfilled, 状态才会转为 fulfilled
4. 只要有一个被rejected了，p的状态就是rejected。
5. 如果作为参数的Prmose实例，自己定义了catch方法，那么它一旦被rejected，并不会触发Promise.all()的catch方法。
```js
const promises = [1,2,3].map((id) => {
    return request(id)
});

Promise.all(promises).then(res => {}).catch(error => {});
// 返回的这个res是一个数组[promose(1), promise(2), promise(3)]
// 数组中依次存放的是promises中的  异步函数  的返回值
```

- ### Promise.race()
1. 将多个Promise实例，包装成一个新的Promise实例。
2. 与Promise.all不同的是，这里只需要一个promise实例完成状态的转换，就返回。

- ### Promise.allSettled()
1. 将多个Promise实例，包装成一个新的Promise实例。
2. 等到一组异步操作都结束了，不管没一个操作时成功还是失败，在进行下一步操作。
3. 该方法返回的新的Promise实例，一旦发生状态变更，状态总是fulfilled。它的回调函数会接收到一个数组作为参数，该数组的每个成员对应前面数组的每个Promise对象。
```js
const resolved = Promise.resolve(42)
const rejected = Promise.reject(-1);
const allSettled = Promise.allSettled([resolved, rejected]);
allSettled.then((results => {console.log(results)}))
// results 对应的是异步操作的结果
// results的格式是固定
[
    {status: "fulfilled", value: 42},
    {status: "rejected", reason: -1}
]
```
4. status的值是固定的"fulfilled", "rejected"。 成功时有属性value，失败时有属性 reason

- ### Promise.resolve
1. 用来将现有对象转为Promise对象。
```js
Promise.resolve('foo'); 
// 等价于
new Promise(resolve => resolve('foo'));
```
2. Promise.resolve的参数：是一个Promise实例时。此时Promise.resolve不做任何修改，直接返回
3. Promise.resolve的参数：thenable对象，就是具有then方法的对象。Promise.resolve方法会将这个方法转换为Promise对象。并且立即resolve
```js
let thenable = {
  then: function(resolve, reject) {
    resolve(42);
  }
};

let p1 = Promise.resolve(thenable);
p1.then(function (value) {
  console.log(value);  // 42
});
```

4. 参数不是具有then()方法的对象，或根本就不是对象. Promise.resolve()方法返回一个新的Promise对象状态时resolved. 并且立即resolve
```js
const p = Promise.resolve(4);
p.then((r) => console.log(r)) // 4
```
5. 不带有任何参数.直接返回一个resolved状态的 Promise 对象。立即resolve。
```js
const p = Promise.resolve();
p.then(function () {
  // ...
});
```
6. 注意 立即resolve的Promise对象，是在本轮“事件循环”的结束时执行。

- ### Promise.reject() 
1. 返回一个新的Promise实例，状态时rejected
2. Promise.reject()方法的参数，会原封不动的作为reject的理由，变成后续方法的参数。

- ### Promise.try
1. 描述一个需求：不想区分或者不知道一个函数 f 是同步还是异步。但是想用Promise来处理它。这样就可以不用管 f 是否包含异步操作，都用then方法指定下一步流程，用catch方法处理 f 抛出的错误。
```js
const f = () => console.log('now');
Promise.resolve().then(f);
console.log('next');
// next
// now
// 缺点就是如果f是同步函数，那么它会在本轮事件循环的末尾执行。
```
2. 修改上面的问题
```js
const f = () => console.log('now');
(async () => f())();
console.log('next');
// now
// next
// 第二行是一个立即执行的匿名函数，会立即执行里面的async函数，因此如果f是同步的，就会得到同步的结果；
```
另一种写法和上面类似
```js
const f = () => console.log('now');
(
    () => new Promise(
        resolve => resolve(f())
    )
)()
console.log('next');
// now
// next
```

```js
// async () => f()会吃掉f()抛出的错误。所以，如果想捕获错误，要使用promise.catch方法。
(async () => f())()
.then(...)
.catch(...)
```
基于此需求，有了Promise.try的提案




> ## Promise的应用 ****
1. generator 函数与 Promise的结合


