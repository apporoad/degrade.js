const defaultRetryInterval = 100

function Degrade (options){
    var _options = options
    this.options = (opts) =>{
        if(opts){
            _options = opts
        }
        return _options
    }
    var _exec = (mainFn,degradedFn)=>{
        try{
            var r = mainFn()
            if(r && r.then){
                _options.isAsync =true
                //如果是异步，直接执行
                return new Promise((resolve,j)=>{
                    r.then(data=>{
                        resolve(data)
                    }).catch(ex=>{
                        _options.isDegreding =true
                        _options.lastDegredeTime = Date.now()
                        _options.lastError = ex
                        try{
                            resolve(_execDegrade(mainFn,degradedFn))
                        }catch(ee){
                            j(ee)
                        }
                    })
                })
            }else{
                return r
            }
        }
        catch(ex){
            _options.isDegreding =true
            _options.lastDegredeTime = Date.now()
             _options.lastError = ex
            return  _execDegrade(mainFn,degradedFn)
        }
    }
    var _execDegrade = (mainFn,degradedFn)=>{
        //判断是否异步 
        return _options.isAsync ? Promise.resolve(degradedFn(_options.lastError))  :  degradedFn(_options.lastError)
    }
    this.exec = (mainFn, degradedFn)=>{
        if(!mainFn || !degradedFn){
           throw Error('degrade.js :  mainFn degradedFn are requied')
        }
        _options = _options || {}
        //判断是否降级中
        if(_options.isDegreding){
            //判断是否超时
            var retryInterval = _options.interval || _options.retryInterval || defaultRetryInterval
            if(_options.lastDegredeTime && (Date.now() - _options.lastDegredeTime) > retryInterval){
                _options.isDegreding = false
                //触发重试
                return _exec(mainFn,degradedFn)
            }else{
                return _execDegrade(mainFn,degradedFn)
            }
        }else{
            return _exec(mainFn,degradedFn)
        }
    }
}


module.exports = (options)=>{
    return new Degrade(options)
}