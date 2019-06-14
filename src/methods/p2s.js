//声明一个全局发布-订阅对象，为不同模块之间可能存在的通信做铺垫
//立即执行函数-先定义后执行
const Observe = (function () {
  //订阅器
  const _observe = {}
  //历史记录
  const _cache = {},
    _shift = Array.prototype.shift,
    _slice = Array.prototype.slice,
    _toString = Array.prototype.toString,
  //订阅
  const subscribe = function (type, callback) {
    if (_toString.call(callback) !== '[object Function]') return;
    //是否有订阅时间
    if (!_observe[type]) _observe[type] = []
    _observe[type].push(callback)
    return this
  }

  //发布
  const publish = function () {
    //获取发布行为
    let type = _shift.call(arguments)
    //获取发布事件
    let theme = _slice.call(arguments)
    //记录发布事件
    if (!_cache[type]) {
      _cache[type] = theme
    } else {
      _cache[type].push(theme)
    }
    //获取相关事件所有的订阅者
    let subscribes = _observe[type]
    //发布主题
    if (!subscribes || !subscribes.length) return
    subscribes.forEach(ele => {
      ele.apply(this, theme)
    });
    return this
  }

  //取消订阅
  const unsubscrible = function (type, callback) {
    if (!_observe[type] || _toString.call(callback) == '[object Function]') return
    let subscribes = _observe[type]
    subscribes.some((item, index, arr) => {
      if (item == callback) {
        arr.splice(index, 1)
        return true
      }
    })
    return this
  }

  //查看发布记录
  const viewLog = function (type, callback) {
    if (!_observe[type] || _toString.call(callback) !== '[object Function]') return
    _cache[type].forEach(item => {
      callback.apply(this, item)
    })
    return this
  }

  //返回
  return {
    _observer,
    _cache,
    subscribe,
    publish,
    unsubscrible,
    viewLog
  }
}())

//先发布主题
Observer.publish('click', '第一次发布点击消息')
Observer.publish('focus', '第一次发布聚焦消息')
Observer.publish('blur', '第一次发布失焦消息')

// 订阅
let sub1 = function (data) {
    console.log('sub1' + data)
}
let sub2 = function (data) {
    console.log('sub2' + data)
}
let sub3 = function (data) {
    console.log('sub3' + data)
}
Observer.subscribe('click', sub1)
Observer.subscribe('click', sub2)
Observer.subscribe('focus', sub3)

// 再发布、取订、查看发布记录
Observer.publish('click', '第二次发布点击消息').unsubscrible('click', sub2).publish('click', '第三次发布点击消息').publish('focus', '第二次发布聚焦消息').viewLog('click', function (message) {
    console.log(message)
})