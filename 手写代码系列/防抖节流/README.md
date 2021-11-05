## 防抖

> ### 含义
触发事件后在n秒内只执行一次。如果在n秒内连续点击则会重新计时。

> ### 场景
1. window 的 resize、scroll
2. mousedown、mousemove
3. keyup、keydown

> ### 原理
不管用户怎么触发，我总是在事件触发n秒后执行，如果用户在n秒内再次触发了，就取消定时器，以新的时间为准，n秒后在执行

> ### 迭代版本

```js
const container = document.querySelector('#container');
container.onmousemove = debounce(getUserAction, 2000); // this 指向变成了window
// container.onmousemove = getUserAction; // this 指向的是 container dom 节点
function getUserAction() {
    console.log('move-----', this);
}
```
- #### 第一个版本 <br />
1. 产生的问题：this的指向会被更改掉。
2. 在绑定的 onmousemove 的事件中，this指向的是 对应的dom节点
3. 在debounce中 被setTimeout包裹后，指向的是 window

```js
function debounce(func, wait) {
    let timeout;
    return function() {
        clearTimeout(timeout);
        timeout = setTimeout(func, wait);
    }
}
```
- #### 修改this指向的问题
```js
function debounce(func, wait) {
    let timeout;
    return function() {
        let context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            func.apply(context);
        }, wait);
    }
}
```
- #### 上面的版本没有包含参数信息
```js
function debounce(func, wait) {
    let timeout;
    return function() {
        let context = this;
        let args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            func.apply(context,args);
        });
    }
}
```
- #### 新需求
1. 不希望等到事件停止触发后才执行，希望立即执行，然后等到停止触发n秒后，才可以重新触发执行

```js
 function debounce(func, wait, immediate) {
    let timeout;
    return function() {
        let context = this;
        let args = arguments;

        if (timeout) {
            clearTimeout(timeout);
        }

        if (immediate) {
            let callNow = !timeout;
            timeout = setTimeout(() => {
                timeout = null;
            }, wait);

            if (callNow) {
                func.apply(context, args);
            }
        }
        else {
            timeout = setTimeout(() => {
                func.apply(context, args);
            }, wait);
        }
    }
} 
```