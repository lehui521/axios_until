import request from "./request"
import {merge,assert} from "./common"
import _default from "./default"
// function request() { }
  
class Axios {
    constructor() {
        const _this = this
        return new Proxy(request, {
            get(data, name) {
                // console.log(_this[name] , data[name])
                return _this[name];
            },
            set(data,name,val){
               return _this[name]=val
            },
            apply(fn, thisArg, args) {
                //目标对象，目标对象的上下文(this)，目标对象的参数数组
                //直接调用Axios的情况
                // console.log(fn, thisArg, args)
                let options = _this.processArgs(undefined, args);
                if (!options) {
                    if (args.length == 2) {
                      assert(typeof args[0] == 'string', 'args[0] must is string');
                      assert(
                        typeof args[1] == 'object' &&
                          args[1] &&
                          args[1].constructor == Object,
                        'args[1] must is JSON',
                      );
          
                      options = {
                        ...args[1],
                        url: args[0],
                      };
                      _this.request(options)
                    } else {
                      assert(false, 'invaild args');
                    }
                  }
            }
        })
    }
    processArgs(method,args){       
        let options;
        if (args.length == 1 && typeof args[0] == 'string') {
            options = { method, url: args[0] };
          } else if (args.length == 1 && args[0].constructor == Object) {
            options = {
              ...args[0],
              method,
            };
            this.request(options);
          } else {
            return undefined;
          }
          return options;
    }
    request(options){
        let _headers=this.default.headers  //提前拷贝
        delete this.default.headers     //删除默认default的headers
        //深拷贝
        let result = JSON.parse(JSON.stringify(this.default))
     
        //result两边同时合并,options覆盖原有的元素  
        merge(result,this.default)
        merge(result,options)
        this.default.headers = _headers
        
        options = result   //合并好的result重新赋值给options

        let headers = {};
        merge(headers, this.default.headers.common);
        merge(headers, this.default.headers[options.method.toLowerCase()]);
        merge(headers, options.headers);
        options.url=options.baseUrl+options.url;
        // delete options.baseUrl; 
        console.log(headers)
        console.log(options)
        //正式调用request请求后台
        request(options)
    }
    get(...args) {
        let options= this.processArgs('get',args)
        if (!options) {
            if (args.length == 2) {
              assert(typeof args[0] == 'string', 'args[0] must is string');
              assert(
                typeof args[1] == 'object' &&
                  args[1] &&
                  args[1].constructor == Object,
                'args[1] must is JSON',
              );
              options = {
                ...args[1],
                url: args[0],
                method: 'get',
              };
              this.request(options);
            } else {
              assert(false, 'invaild args');
            }
          }
     }
    post(...args) { 
        let options= this.processArgs('post',args)
        
        if (!options) {
            if (args.length == 2) {
                //确保第一个参数是字符串
              assert(typeof args[0] == 'string', 'args[0] must is string');
              options = {
                url: args[0],
                data: args[1],
                method: 'post',
              };
              this.request(options);
            } else if (args.length == 3) {
            
              assert(typeof args[0] == 'string', 'args[0] must is string');
              //确保第三个参数是对象
              assert(
                typeof args[2] == 'object' &&
                  args[2] &&
                  args[2].constructor == Object,
                'args[2] must is JSON',
              );
              options = {
                ...args[3],
                url: args[0],
                data: args[1],
                method: 'post',
              };
              this.request(options);
            } else {
              assert(false, 'invaild argments');
            }
          }
    }
    delete(...args) {
        let options= this.processArgs('delete',args)
        if (!options) {
            assert(typeof args[0] == 'string', 'args[0] must is string');
            assert(
              typeof args[1] == 'object' && args[1] && args[1].constructor == Object,
              'args[1] must is JSON',
            ); 
            options = {
                ...args[1],
                url: args[0],
                method: 'get',
            };
            this.request(options);
          }
     }
}

// const axios = new Axios()
Axios.create = Axios.prototype.create = function(options={}) {
    let axios = new Axios();
    let res ={...JSON.parse(JSON.stringify(_default))};
    merge(res, options);
    axios.default = res
    return axios;
};

export default Axios.create()