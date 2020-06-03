const degrade = require('./index')


//test sync
var d1 = degrade()
for (var i = 0; i < 10; i++) {
    var result = d1.exec(() => {
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



var testAsync = async () => {
    // test async
    var d2 = degrade()
    for (var i = 0; i < 10; i++) {
        var result = await d2.exec(async () => {
                    if (i == 5) {
                        throw Error('testError')
                    }
                    return 1
                },
                (ex) => {
                    //console.log(ex)
                    return 2
                })
            console.log('result async :' + result)
    }
}

testAsync()

var d2= degrade({interval : 100})
var testRecover = async ()=>{
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
}


setTimeout(() => {
   testRecover()
}, 500);

// test erorr

var testError = ()=>{
    try{
        degrade().exec(()=>{ throw Error('test error sync')} ,  (err)=>{ throw err})
    }catch(ex){
        console.log('only degrade errors , then throw error :' +ex )
    }

    degrade().exec(async()=>{ throw Error('test error async') }, (err) => { throw err}).catch(ex =>{
        console.log('only degrade errors , then throw error :' + ex )
    })
}

setTimeout(() => {
    testError()
}, 1000);