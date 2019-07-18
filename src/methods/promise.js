//Promise的状态枚举
const STATUS = {
  PENDING:0,
  FULFILLED:1,
  REJECTED:2
}
class Promise {
  constructor(task){
    //Promise的初始状态
    this.status = STATUS.PENDING;
    //resolve时返回的数据
    this.resolveData = [];
    //reject时返回的数据
    this.rejectData = [];
    //reject 和 resolve 执行时的回调队列
    // promise的resolve和reject为异步响应时，即调用then时promise为pending状态
    // 则将传入then的函数加入该队列，等待promise resolve或reject时执行该队列
    this.onFulfilledList = []
    this.onRejectedList = [];

    //promise成功，执行onFuifilledList的回调
    this.onResolve = (data)=>{
      if(this.status == STATUS.PENDING){
        this.status = STATUS.FULFILLED
        this.resolveData = data
        this.onFulfilledList.forEach(item =>{
          item(this.resolveData)
        })
      }
    }

    //Promise失败，执行onRejectedList的回调
    this.onReject = (err)=>{
      if(this.status == STATUS.PENDING){
        this.status = STATUS.REJECTED
        this.resolveData = err
        this.onRejectedList.forEach(item =>{
          item(this.resolveData)
        })
      }
    }

    /** 
     * promise解析，根据then返回数据类型不同封装不同的promise
     * 返回，以便实then的链式调用以及Promise的thenable特性
     * @param {*当前then return数据} data 
     * @param {*当前then的resolve} resolve 
     * @param {*当前then的reject} reject 
    */
   this.resolvePromise = (data,resolve,reject) =>{
    //then return 返回得是一个promise
    if(data instanceof Promise){
      if(data.status == STATUS.PENDING){
        data.then((val)=>{
          this.resolvePromise(val,resolve,reject)
        },reject)
      }else if(data.status = STATUS.FULFILLED){
        resolve(data.resolveData)
      }else{
        reject(data,rejectData)
      }
    }
    
    // then return的是一个对象,若对象具有then方法，则可使用此方法作为新的then
    // Promise的thenable特性基于此
    else if(data !== null && data instanceof Object){
      try{
        let then = data.then
        if(then instanceof Function){
          then.call(data,val =>{
            this.resolvePromise(val,resolve,reject)
          },reject)
        }else{
          resolve(data)
        }
      }catch{
        reject(err)
      }
    }
    //then return 返回的是基本数据或者undefined
    else{
      resolve(data)
    }
   }

   //执行传入的任务task
    try {
      task(this.onResolve.bind(this), this.onReject.bind(this))
    } catch (err) {
      this.onReject(err)
    }
  }

  /**
   * then 回调，返回一个Promise
   * 说明：传入then的参数不是函数的话，直接忽略及在返回的新promise中直接resolve或reject目前
   * promise的数据，传入then的参数是函数的话，则直接已目前promise的数据为参数执行该函数，并
   * 根据函数返回值情况确定新promise的状态
   * @param {*成功} onFulfilled 
   * @param {*失败} onRejected 
   */

  Promise.prototype.then = function(onFulfilled,onRejected){
     let promise2 ;
      var self = this
    // pending状态下将传入then的函数加入promise对应的回调队列
    // 等待promise状态改变后执行

    if(this.status == STATUS.PENDING){
      // 如果当前的Promise还处于pending状态，我们并不能确定调用onResolved还是onRejected，
      // 只能等到Promise的状态确定后，才能确实如何处理。
      // 所以我们需要把我们的**两种情况**的处理逻辑做为callback放入promise1(此处即this/self)的回调数组里
      // 逻辑本身跟第一个if块内的几乎一致，此处不做过多解释
      promise = new Promise((resolve,reject)=>{
        this.onFulfilledList.push(()=>{
          //传入的then的参数不是函数则忽略
          if(!(onFulfilled instanceof Function)){
            resolve(this.rejectData)
          }else{
            
          }
        })
      })
    }
   }
}
