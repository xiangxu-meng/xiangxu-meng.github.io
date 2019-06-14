const isFun = function(fun){
  return typeof fun === 'function'
}

const Observe = {
  constructor(){
    this.messageCollector = {}
    this.history = {}
  },
  on(...args){
    const [type,callback] = args
    if(!isFun(callback)){
      throw new TypeError ('putin is not a function')
    }
    if(!this.messageCollector[type]) this.messageCollector = []
    this.messageCollector[type].push(callback)
    return this
  },
  emit(...args){
    const [type,...theme] = args
    const subscribes = this.messageCollector[type]
    if (!this.history[type]) {
      this.history[type] = [theme]
    } else {
      this.history[type].push(theme)
    }
    if(!subscribes || !subscribes.length) return
    subscribes.foreach(item=>{
      item.call(this,theme)
    })
    return this
  },
  off(...args){
    const [type, callback] = args
    if (!this.messageCollector[type] || !this.messageCollector[type].length) return
    if (!isFun(callback)) {
      throw new TypeError(`callback of arguments for function ${this.subscribe.name} must be a function `)
    }
    const subscribes = this.messageCollector[type]
    subscribes.some((item, index, arr) => {
      if (item === callback) {
        arr.splice(index, 1)
        return true
      }
    })
    return this
  },
  viewLog (...arg) {
    const [type, callback] = arg
    if (!this.history[type] || !isFun(callback)) return
    const themes = this.history[type]
    for (const theme of themes) {
      callback.apply(this, theme)
    }
    return this
  },
  //复位
  reset () {
    this.messageCollector = {}
    this.history = {}
    return this
  }
}