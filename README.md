# degrade.js
degrade for your method


## just try it
```bash
npm i --save degrade.js

```

```js
var degrade = require('degrade.js')

degrade()(()=>{
    //here your main logic
    if(Math.random()* 10 >5){
        throw Error('error test')
    }
    return 5
}, ()=>{
    // here your degrade logic
    return 10
}
)

```

### sync call
```js
const degrade = require('degrade.js')

//test sync
var d = degrade()
for (var i = 0; i < 10; i++) {
    var result = d.exec(() => {
            if (i == 5) {
                throw Error('testError')
            }
            return 1
        },
        (ex) => {
            //console.log(ex)
            return 2
        }
    )
    console.log(' result :' + result)
}

```


### async call
```js
const degrade = require('degrade.js')
(async () => {
    var d = degrade()
    // test async
    for (var i = 0; i < 10; i++) {
        var result = await d.exec(async () => {
                    if (i == 5) {
                        throw Error('testError')
                    }
                    return 1
                },
                (ex) => {
                    return 2
                })
            console.log('result async :' + result)
    }
})()

```

### auto Recover

```js
const degrade = require('degrade.js')

var d2= degrade({interval : 100})
(async ()=>{
    for (var i = 0; i < 10; i++) {
        var result = await d2.exec(async () => {
                    if (i == 5) {
                        throw Error('testError')
                    }
                    return 1
                },
                (ex) => {
                    return new Promise((r,j)=>{
                        //设置超时时间
                        setTimeout(() => {
                            r(2)
                        }, 34);
                    })
                })
            console.log('result recover :' + result)
    }
})()

```

### exception
```js
const degrade = require('degrade.js')

try{
    degrade().exec(()=>{ throw Error('test error sync')} ,  (err)=>{ throw err})
}catch(ex){
    console.log('only degrade errors , then throw error :' +ex )
}

degrade().exec(async()=>{ throw Error('test error async') }, (err) => { throw err}).catch(ex =>{
    console.log('only degrade errors , then throw error :' + ex )
})

```