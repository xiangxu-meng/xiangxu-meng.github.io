// 正常使用  ----------   http://www.cnblogs.com/huansky/p/6064402.html
var p = new Promise((resolve,rejcet)=>{
  setTimeout(()=>{
    if(true){
      resolve('success')
    }else{
      rejcet('failtrue')
    }
  },1000)
})

p.then((value)=>{
  console.log(value)
},(error)=>{
  console.log(error)
})
//success

// -----------------------------------

// 术语
// 解决(fulfill/resolve):指一个Promise成功时的一系列操作，如状态的改变、回调的执行。
// 拒绝(reject):只一个Peomise失败时进行的一系列操作。
// 终值(eventual value): 指的是Promise被解决时传递给解决回调的值，由于Promise有一次性的特征，因此当这个值被传递时，标志着Promise等状态的结束，故称之为终值，有时也直接成为value
// 拒因(reason):拒绝原因，指在Promise被拒绝时传递给拒绝回调的值

// 实现Promise

//Promise构造函数接收一个executor函数，executor函数执行完同步或者异步操作后，调用他的两个参数resolve和reject
var promise = new Promise((resolve,reject)={
    /*
    如果操作成功，调用resolve并传入value
    如果操作失败，调用reject并传入reason
  */
})

// 仿照搭建
function Promise(callback){
  var self = this
  self.status = 'PENDING' //Promise当前的状态
  self.data = undefined //Promise的值
  self.onResolvedCallback = [] //Promise resolve 的回调函数集
  self.onRejectedCallback = [] //Promise reject 的回调函数集
  callback(resolve,reject) //执行executor并传入相应的参数
  function resolve(value){
    if(self.status == 'PENDING'){
      self.status = 'FULFILLED'
      self.data = value
      // 依次执行成功之后的函数栈
      for (let i = 0 ; i < self.onResolvedCallback.lengh ; i++){
        self.onResolvedCallback[i](value)
      }
    }
  }

  function rejcet(error){
    if(self.status == 'PENDING'){
      self.status = 'REJECT'
      self.data = value
      // 依次执行成功之后的函数栈
      for (let i = 0 ; i < self.onRejectedCallback.lengh ; i++){
        self.onRejectedCallback[i](error)
      }
    }
  }
}

Promise.prototype.then = function(){

}
完善我们的resolve和rejected:^
Promise最重要的方法是then方法，then接收两个参数promise.then(onFulfilled, onRejected)
onFulfilled,onRejected 参数可选，如果这两个参数不是函数，则必须被忽略
onFulfilled 特性:
当onFulfilled是个函数时,Promise执行结束后其必须被调用，其中第一个参数为Promise的终值,也就是resolve传过来的值
在Promise执行完之前其不能被调用
调用次数不能超过一次

onRejected 特性:
onRejected,Promise执行拒绝后其必须被调用，其中第一个参数为Promise的拒绝的原因,也就是reject传过来的值
在Promise被拒绝之前其不能被调用
调用次数不能超过一次
调用时机
onFulfilled 和 onRejected 只有在执行环境堆栈仅包含平台代码时才可被调用（平台代码指引擎、环境以及 promise 的实施代码）

调用要求
onFulfilled 和 onRejected 必须被作为函数调用（即没有 this 值，在 严格模式（strict） 中，函数 this 的值为 undefined ；在非严格模式中其为全局对象。）

多次调用
then 方法可以被同一个 promise 调用多次

当 promise 成功执行时，所有 onFulfilled 需按照其注册顺序依次回调
当 promise 被拒绝执行时，所有的 onRejected 需按照其注册顺序依次回调

then 返回
then方法必须返回一个Promise对象 
Promise2 = Promise1.then(onFulfilled,onRejected)
如果 onFulfilled 或者 onRejected 返回一个值x,则运行下面的Promise的解决过程：[[Resolve]](promise2, x)
如果 onFulfilled 或者 onRejected 抛出一个异常 e , 则Promise2必须拒绝执行，并返回拒因e
如果 onFulfilled 不是函数且 promise1 成功执行， promise2 必须成功执行并返回相同的值
如果 onRejected 不是函数且 promise1 拒绝执行， promise2 必须拒绝执行并返回相同的据因

Promise.prototype.then = function(onResolved,onRejected){
  var self = this
  var promise2

  //根据标准，如果then的参数不是function，则我们需要忽略它，此处以如下方式处理

  onResolved = typeof onResolved === 'function' ? onResolved : function (value) {}
  onRejected = typeof onRejected === 'function' ? onRejected : function (reason) {}

  if(self.status === 'resolve'){
    //如果Promise1（此处为this/self）的状态已经确定并且是resolved，我们调用onResolve
    //考虑可能throw 所以抱在try/catch模块中
    return promise2 = new Promise(function(resolve,reject){
      try{
        var x = onResolved(self.data) // 如果onResolved的返回值是一个Promise对象，直接取它的结果做为promise2的结果
        if(x instanceof Promise) {
          x.then(resolve,reject)
        }
        resolve(x) // 否则，以它的返回值做为promise2的结果
      }catch(e){
        reject(e)// 如果出错，以捕获到的错误做为promise2的结果
      }
    })
    return 
  }
  if(self.status === 'rejected'){
    return promise2 = new Promise(function(resolve,reject){
      try{
        var x = onRejected(self.data)
        if(x instanceof Promise){
          x.then(resolve,reject)
        }
      }catch(e){
        reject(e)
      }
    })
  }

  if(self.status === 'pending'){
      // 如果当前的Promise还处于pending状态，我们并不能确定调用onResolved还是onRejected，
      // 只能等到Promise的状态确定后，才能确实如何处理。
      // 所以我们需要把我们的**两种情况**的处理逻辑做为callback放入promise1(此处即this/self)的回调数组里
      // 逻辑本身跟第一个if块内的几乎一致，此处不做过多解释
      return promise2 = new Promise(function(resolve,reject){
        self.onRejectedCallback.push(function(value){
          try{
            var x = onResolved(self.data)
            if(x instanceof Promise){
              x.then(resolve,reject)
            }
          }catch(e){
            reject(e)
          }
        })
      })
  }  
}
// 为了下文方便，我们顺便实现一个catch方法
Promise.prototype.catch = function(onRejected) {
  return this.then(null, onRejected)
}



//------------------------
(function(window,undefined){

  // resolve 和 reject 最终都会调用该函数
  var final = function(status,value){
      var promise = this, fn, st;
          
      if(promise._status !== 'PENDING') return;
      
      // 所以的执行都是异步调用，保证then是先执行的
      setTimeout(function(){
          promise._status = status;
          st = promise._status === 'FULFILLED'
          queue = promise[st ? '_resolves' : '_rejects'];
  
          while(fn = queue.shift()) {
              value = fn.call(promise, value) || value;
          }
  
          promise[st ? '_value' : '_reason'] = value;
          promise['_resolves'] = promise['_rejects'] = undefined;
      });
  }
  
  
  //参数是一个函数，内部提供两个函数作为该函数的参数,分别是resolve 和 reject
  var Promise = function(resolver){
      if (!(typeof resolver === 'function' ))
          throw new TypeError('You must pass a resolver function as the first argument to the promise constructor');
      //如果不是promise实例，就new一个
      if(!(this instanceof Promise)) return new Promise(resolver);
  
      var promise = this;
      promise._value;
      promise._reason;
      promise._status = 'PENDING';
      //存储状态
      promise._resolves = [];
      promise._rejects = [];
      
      //
      var resolve = function(value) {
          //由於apply參數是數組
          final.apply(promise,['FULFILLED'].concat([value]));
      }
  
      var reject = function(reason){
          final.apply(promise,['REJECTED'].concat([reason]));
      }
      
      resolver(resolve,reject);
  }
  
  Promise.prototype.then = function(onFulfilled,onRejected){
      var promise = this;
      // 每次返回一个promise，保证是可thenable的
      return new Promise(function(resolve,reject){
          
          function handle(value) {
              // 這一步很關鍵，只有這樣才可以將值傳遞給下一個resolve
              var ret = typeof onFulfilled === 'function' && onFulfilled(value) || value;
  
              //判断是不是promise 对象
              if (ret && typeof ret ['then'] == 'function') {
                  ret.then(function(value) {
                      resolve(value);
                  }, function(reason) {
                      reject(reason);
                  });
              } else {
                  resolve(ret);
              }
          }
  
          function errback(reason){
              reason = typeof onRejected === 'function' && onRejected(reason) || reason;
              reject(reason);
          }
  
          if(promise._status === 'PENDING'){
              promise._resolves.push(handle);
              promise._rejects.push(errback);
          }else if(promise._status === FULFILLED){ // 状态改变后的then操作，立刻执行
              callback(promise._value);
          }else if(promise._status === REJECTED){
              errback(promise._reason);
          }
      });
  }
  
  Promise.prototype.catch = function(onRejected){
      return this.then(undefined, onRejected)
  }
  
  Promise.prototype.delay = function(ms,value){
      return this.then(function(ori){
          return Promise.delay(ms,value || ori);
      })
  }
  
  Promise.delay = function(ms,value){
      return new Promise(function(resolve,reject){
          setTimeout(function(){
              resolve(value);
              console.log('1');
          },ms);
      })
  }
  
  Promise.resolve = function(arg){
      return new Promise(function(resolve,reject){
          resolve(arg)
      })
  }
  
  Promise.reject = function(arg){
      return Promise(function(resolve,reject){
          reject(arg)
      })
  }
  
  Promise.all = function(promises){
      if (!Array.isArray(promises)) {
          throw new TypeError('You must pass an array to all.');
      }
      return Promise(function(resolve,reject){
          var i = 0,
              result = [],
              len = promises.length,
              count = len
              
          //这里与race中的函数相比，多了一层嵌套，要传入index
          function resolver(index) {
            return function(value) {
              resolveAll(index, value);
            };
          }
  
          function rejecter(reason){
              reject(reason);
          }
  
          function resolveAll(index,value){
              result[index] = value;
              if( --count == 0){
                  resolve(result)
              }
          }
  
          for (; i < len; i++) {
              promises[i].then(resolver(i),rejecter);
          }
      });
  }
  
  Promise.race = function(promises){
      if (!Array.isArray(promises)) {
          throw new TypeError('You must pass an array to race.');
      }
      return Promise(function(resolve,reject){
          var i = 0,
              len = promises.length;
  
          function resolver(value) {
              resolve(value);
          }
  
          function rejecter(reason){
              reject(reason);
          }
  
          for (; i < len; i++) {
              promises[i].then(resolver,rejecter);
          }
      });
  }
  
  window.Promise = Promise;
  
  })(window);