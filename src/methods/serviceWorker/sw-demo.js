import { url } from "inspector";
import { type } from "os";

//特性检查
if('serviceWorker' in navigator){
  //首次访问时，浏览器不知道有哪些资源需要下载也不知道会有一个工作服务线程需要创建，
  //如果在页面加载的过程中，浏览器在下载图片或其他的线程或者进程之外还要为sw创建一个额外的线程，
  //对于一些移动设备甚至低端的手机来说 这个额外的线程无疑是加剧了对行程的消耗以及抢占的正常资源的带宽
  //我们得目的是优化用户体验，首次加载页面时我们的首要任务应该是尽快加载需要的资源，见少白屏的时间
  //为sw注册拖慢进程不是我们想要的，所以我们在资源加载完成之后在注册sw
  window.addEventListener('load',function(){
    //一参访问位置（同源、可远程）  下载出现问题，返回err
    //二参是个对象，scope制定运行的域
    navigator = serviceWorker.register('/static/sw-demo.js',{scope:'/static'})
      .then(function(registration){
        console.log(registration.scope)
      })
      .catch(function(err){

      })

  })
}

-scope-
决定sw控制哪些网域的页面的

不能越狱
url                      scope
/static/switch.js        /static/(默认)
/static/switch.js        /static/child

错误实例
url                       scope
/static/switch.js         https://other/
/static/switch.js         /
/static/switch.js         /assert

可以越狱的情况-设定头部信息 allowheader
/static/switch.js               /sw-register.js 
http/1.1                         /static/sw.js
200 ok                           {scope:'/'}
content-type:text/javascript
service-worker-allowed:/(指定了最大的域)

同域名下允许注册多个不同的scope的service worker
注册完成后会生成一个独立的sw上下文

安装
没有安装过 或者已经过期
在安装阶段，我们会事预缓存一些静态资源 或者 app shell

// 事先注册监听install事件
this.addEventListener('install',function(event){
  event.waitUntil(
    //开辟一块缓存 -> 会返回一个promise 缓存触发之后
    caches.open('my-cache-y1').then(function(cache){
      //访问cache的addAll来缓存的我们指定的文件列表,原子性操作，过长增加缓存失败的概率
      return cache.addAll([
        '/',
        '/test.js',
        '/test.css'
      ])
    })
  )
})

this.addEventListener('activate',function(event){
  event.waitUntil(
    //获得作用域的控制权
  Promise.all([
    //再激活的过程里，调用clientsd的
    //获得完全控制权是指，理论上sw激活之后应该是可以控制页面了，但是仅仅是可以用在注册成功之后打开的页面
    //也就是说 首次激活这个sw之前，页面加载的时候一开始是没有被sw控制的,当sw激活运行之后页面需要被重新加载才能让sw获得
    //完全的控制，否则无法进行拦截等操作
    //下面这个方法 就是跳过刷新页面这个步骤，让sw具有正常的功能
    this.clients = claim(),
    caches.keys().then(function (cacheList){
      cacheList.map(function(cacheName){
        //检测到与当前sw缓存条件不匹配的，缓存就会被丢弃
        if(cacheName !== 'my-cache-y1' ){
          return caches.delete(cacheName)
        }
      })
    })
  ])
  )
  
})

// 激活
// 获取控制权，清理老旧缓存资源

// 上面激活完成 失败sw被废止  上面是第一次使用的生命周期 


// 更新的话
// 新的工作线程，会获得新的生命周期，新的sw完成后，会被延迟激活，同一时间只有一个sw控制页面作用域，
// 想跳过等待步骤直接激活，我们可以在install的事件回调里调用sope.wating方法 加快进程

// 兼容性-大部分

// 降级方案 appcache sw