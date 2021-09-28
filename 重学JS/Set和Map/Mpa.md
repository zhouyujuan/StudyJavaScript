## Map
- JavaScript 的对象（Object），本质上是键值对的集合（Hash 结构），
- 但是传统上只能用 字符串 当作键。因此提供了Map数据结构

> Map
1. 它类似于对象，也是键值对的集合
2. “键”的范围不限于字符串，各种类型的值（包括对象）都可以当作键
3. Object 结构提供了“字符串—值”的对应，Map 结构提供了“值—值”的对应，是一种更完善的 Hash 结构实现

> 番外： Hash结构
1. Hash，即”散列“，就是把任意长度的输入，通过散列算法，变换成固定长度的输出，该输出就是散列值。
2.  数组的特点是：寻址容易，插入和删除困难；而链表的特点是：寻址困难，插入和删除容易。
3. Hash表综合了这两种。***算法比较难***

```js
const m = new Map();
const o = {p: 'hello world'};
m.set(o, 'content');
m.get(o) // content
m.has(o) // true
m.delete(o) // true
```
- Map 构造函数 接受一个数组作为参数
```js
const items = [['name', '张三'], ['title', 'Author']];
const map = new Map(items);
map.size = 2;
map.has('name') // true;
map.get('name') // 张三
items.forEach([key, value] => map.set(key, value))

const set = new Set([
  ['foo', 1],
  ['bar', 2]
]);
const m1 = new Map(set);
m1.get('foo') // 1
// 具有 Iterator 接口、且每个成员都是一个双元素的数组的数据结构都可以当作Map构造函数的参数
```
- 对同一个对象的引用，Map结构才将其视为同一个键。
```js
const map = new Map();
map.set(['a'], 555);
map.get(['a']) // undefined
// 这是两个不同的数组实例，内存地址不一样
```
- Map的键实际上是和内存地址绑定的，只要内存地址不一样，就视为两个键。这就解决了同名属性碰撞的问题。
- Map的键是一个简单类型的值（数字，字符串，布尔值），则只要两个值严格相等，那就是同一个键。
- undefined和null是两个不同的键
- NaN不严格相等于自身，在Map中视为同一个键

## 实例的属性和方法
- size 成员总数
```js
const map = new Map();
map.set('foo', true)
map.size(); // 1
```
- Map.prototype.set(key, value),返回整个Map结构，因此可以采用链式写法
```js
const m = new Map();
m.set('edition', 6);

let map = new Map()
  .set(1, 'a')
  .set(2, 'b')
  .set(3, 'c');
```
- Map.prototype.get(key), 读取key对应的键值，找不到返回undefined
- Map.prototype.has(key)，has方法返回一个布尔值，表示某个键是否在当前 Map 对象之中。
- Map.prototype.delete(key)，delete方法删除某个键，返回true。如果删除失败，返回false。
- Map.prototype.clear()，clear方法清除所有成员，没有返回值。

### 遍历方法
- Map 结构原生提供三个遍历器生成函数和一个遍历方法。

1. Map.prototype.keys()：返回键名的遍历器。
2. Map.prototype.values()：返回键值的遍历器。
3. Map.prototype.entries()：返回所有成员的遍历器。
4. Map.prototype.forEach()：遍历 Map 的所有成员
```js
const map = new Map([
  ['F', 'no'],
  ['T',  'yes'],
]);

for (let key of map.keys()) {
  console.log(key);
}

// 或者
for (let [key, value] of map.entries()) {
  console.log(key, value);
}
// 等同于使用map.entries()
for (let [key, value] of map) {
  console.log(key, value);
}
// map[Symbol.iterator] === map.entries true
```

- Map 结构转为数组结构，比较快速的方法是使用扩展运算符（...）。
```js
const map = new Map([
  [1, 'one'],
  [2, 'two'],
  [3, 'three'],
]);

[...map.keys()]
// [1, 2, 3]

[...map.values()]
// ['one', 'two', 'three']

[...map.entries()]
// [[1,'one'], [2, 'two'], [3, 'three']]

[...map]
// [[1,'one'], [2, 'two'], [3, 'three']]
```
- ### 结合数组的map方法，filter方法，可以实现Map的遍历和过滤
```js
const map0 = new Map().set(1, 'a').set(2, 'b').set(3, 'c');
const map1 = new Map([...map0].filter([k, v] => k < 3));
// {1 => 'a', 2 => 'b'}
const map2 = new Map([...map0].map(([k, v] => [k * 2, '_' + v])));
// 2 => '_a', 4 => '_b', 6 => '_c';
```

- Map的forEach方法，第二个参数用来绑定this
```js
const reporter = {
  report: function(key, value) {
    console.log("Key: %s, Value: %s", key, value);
  }
};

map.forEach(function(value, key, map) {
  this.report(key, value);
}, reporter);
```
## 与其他数据结构的相互转换

- Map转为数组 扩展运算符 （...）
```js
const myMap = new Map()
  .set(true, 7)
  .set({foo: 3}, ['abc']);
[...myMap]
// [ [ true, 7 ], [ { foo: 3 }, [ 'abc' ] ] ]
```
- 数组转为Map， 使用Map的构造函数
```js
new Map([
  [true, 7],
  [{foo: 3}, ['abc']]
])
// Map {
//   true => 7,
//   Object {foo: 3} => ['abc']
// }
```
- Map转为对象: 如果所有 Map 的键都是字符串，它可以无损地转为对象。如果有非字符串的键名，那么这个键名会被转成字符串，再作为对象的键名。
```js
function strMapToObj(strMap) {
  let obj = Object.create(null);
  for (let [k,v] of strMap) {
    obj[k] = v;
  }
  return obj;
}

const myMap = new Map()
  .set('yes', true)
  .set('no', false);
strMapToObj(myMap)
// { yes: true, no: false }
```
- 对象转为Map， Object.entries()。
```js
let obj = {"a":1, "b":2};
let map = new Map(Object.entries(obj));

// 自己实现一个转换函数
function objToStrMap(obj) {
  let strMap = new Map();
  for (let k of Object.keys(obj)) {
    strMap.set(k, obj[k]);
  }
  return strMap;
}

objToStrMap({yes: true, no: false})
// Map {"yes" => true, "no" => false}
```

- Map转为JSON
1. Map 的键名都是字符串，这时可以选择转为对象 JSON。
```js
function strMapToJson(strMap) {
  return JSON.stringify(strMapToObj(strMap));
}

let myMap = new Map().set('yes', true).set('no', false);
strMapToJson(myMap)
// '{"yes":true,"no":false}'
```

2. Map 的键名有非字符串，这时可以选择转为数组 JSON。
```js
function mapToArrayJson(map) {
  return JSON.stringify([...map]);
}

let myMap = new Map().set(true, 7).set({foo: 3}, ['abc']);
mapToArrayJson(myMap)
// '[[true,7],[{"foo":3},["abc"]]]'
```

- JSON转为Map：正常情况下，所有键名都是字符串。
```js
function jsonToStrMap(jsonStr) {
  return objToStrMap(JSON.parse(jsonStr));
}

jsonToStrMap('{"yes": true, "no": false}')
// Map {'yes' => true, 'no' => false}
```




