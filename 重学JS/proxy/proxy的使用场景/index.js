// 负索引数组
{
    const negativeArray = (els) => new Proxy(els, {
        get: (target, propKey, receiver) => Reflect.get(target,
          (+propKey < 0) ? String(target.length + +propKey) : propKey, receiver)
    });
}

// 隐藏属性
{
    const hide = (target, prefix = '_') => new Proxy(target, {
        has: (obj, prop) => (!prop.startsWith(prefix) && prop in obj),
        ownKeys: (obj) => Reflect.ownKeys(obj)
          .filter(prop => (typeof prop !== "string" || !prop.startsWith(prefix))),
        get: (obj, prop, rec) => (prop in rec) ? obj[prop] : undefined
      })

      let userData = hide({
        firstName: 'Tom',
        mediumHandle: '@tbarrasso',
        _favoriteRapper: 'Drake'
      })
      
      userData._favoriteRapper        // undefined
      ('_favoriteRapper' in userData) // false
}

// 修改对象的值
{
    let o = {
        name: 'xiaoming',
        price: 190
     }
     let d = new Proxy(o,{
        get (target,key){
           if(key === 'price'){
               return target[key] + 20
           }else{
               return target[key]
           }
        }
     })
     console.log(d.price,d.name)
}

// 劫持方法并修改实现
{
    console.log = new Proxy(console.log, {
        apply: function(target, ctx, args) {
          return target(`${args}--000`)
        }
      })
      console.log('1'); // 1--000
}

// 添加校验规则
{
    let o = {
        name: 'xiaoming',
        price : 190
    }
    let validator = (target, key, value) => {
        if(Reflect.has(target,key)) {
            if(key === 'price') {
                if(value > 300) {
                    return false
                }
                else {
                    target[key] = value
                }
            }
            else {
                  target[key] = value
            }
        }
        else {
            return false
        }
    }

    let d = new Proxy(o, {
        get (target, key) {
            return target[key] || ' '
        },
        set: validator 
    })

    d.price = 203
    d.name = 'heiei'
    d.age = 30
    console.log(d.price,d.name, d.age)
}