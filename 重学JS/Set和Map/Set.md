## Set基本用户
- Set：类似于数组，成员值唯一，没有重复。
```js
const s = new Set();
[1,1,2,3].forEach(x => s.add(x));
for (let i of s) {
    console.log(i) // 1,2,3
}
```
- add() 添加成员，不会添加重复的

- 初始化的参数（需要是具有iterable接口的数据结构）
```js
const s1 = new Set([1,2,3,4,4]);
const s2 = new Set(document.querySelectorAll('div'))
```
- ### 去除数组重复成员
```js
[...new Set([1,1,2,2,3])]
Array.from(new Set([1,1,2,2,3]));
```
- ### 去除字符串中重复的字符
```js
[...new Set('aabbcc')].join('')
```
- set加入值，不发生类型转换，判断值是否相等的方法，使用的是 ===
- 两个对象总是不相等的。
```js
let set = new Set();

set.add({});
set.size // 1

set.add({});
set.size // 2
```
## Set实例的属性和方法
- Set.prototype
1. .size: 返回Set实例的成员总数
2. .add(value) 添加某个值，返回Set结构本身
3. .delete(value) 删除某个值，返回布尔值
4. .hash(value) 返回一个布尔值，表示该值是否为Set的成员
5. .clear() 清除所有成员，没有返回值
6. .keys()：返回键名的遍历器
7. .values()：返回键值的遍历器
8. .entries()：返回键值对的遍历器
9. .forEach()：使用回调函数遍历每个成员

## 遍历操作
- Set的遍历顺序就是插入顺序
- Set 结构的实例默认可遍历，它的默认遍历器生成函数就是它的values方法。
```js
let set = new Set(['red', 'green', 'blue']);

for (let x of set) {
  console.log(x);
}
```

## Set实现交集，并集，差集
```js
let a = new Set([1,2,3]);
let b = new Set([4,3,2]);

// 并集
let union = new Set([...a, ...b]);
// 交集
let intersect = new Set([...a].filter(x => b.has(x)));

// 差集
let difference = new Set([...a].filter(x => !b.has(x)));

```

```js
// 方法一
let set = new Set([1, 2, 3]);
set = new Set([...set].map(val => val * 2));
// set的值是2, 4, 6

// 方法二
let set = new Set([1, 2, 3]);
set = new Set(Array.from(set, val => val * 2));
// set的值是2, 4, 6
```