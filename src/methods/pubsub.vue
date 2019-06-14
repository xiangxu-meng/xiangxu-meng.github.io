<template>
  <div>  
  <div class="border scale_1px">
  </div>
  </div>
</template>

<script>
export default {
  data(){
    return {
      _observe:{}
    }
  },
  computed:{},
  props:{},
  components:{},
  created(){},
  mounted(){
     //实现发布-订阅者模式
     function pub2sub(){
       //订阅器
       this._observe = {}
     }
    //原型对象上添加方法
    pub2sub.prototype = {
      constructor:pub2sub,

      //订阅者 订阅事件、回调函数 储藏时间及方法
      subscribe:function(type,callback){
        //callback是否是函数 👇这种判断的方式很常用，用typeof判断对象不行 因为null也是对象
        if(Object.prototype.toString.call(callback) !== '[object Function]') return
        //订阅器是否有订阅事件
        if(!this._observe[type]) this._observe[type] = []
        this._observe[type].push(callback)
        return this
      } ,

      //发布者
      publish:function() {
        let _self = this
        //获取发布行为
        let type = Array.prototype.shift.call(arguments)
        //获取发布主题
        let theme = Array.prototype.slice.call(arguments)
        //获取相关主题的所有订阅者
        let subscribes = _self._observe[type]
        //发布主题
        if(!subscribes || !subscribes.length){
          console.log('unsubscribe action or no actions in observer, please check out')
          return
        }
        subscribes.forEach(callback=>{
          callback.apply(_self,theme)
        })
        return _self
      },

      //取消订阅
      unsubscrible:function(type,callback){
        debugger;
        if(!this._observe[type] || !this._observe[type].length) return
        let subscribes = this._observe[type]
        subscribes.some((item , index , arr)=>{
          console.log(item)
          if(item === callback){
            //删除对应的订阅行为
            arr.splice(index,1)
            return true
          }
        })
        return this
      }
    }

    let ps = new pub2sub()

    ps.subscribe('click',this.sub1)
    ps.subscribe('click',this.sub2)

    ps.publish('click','第一次点击').unsubscrible('click',this.sub1).publish('click','第二次点击')
    //以上实现存在一点问题，即必须先订阅才能有发布-否则会抛出错误

  },
  methods:{
    sub1(data){
      console.log('sub1'+data)
    },
    sub2(data){
      console.log('sub2'+data)
    }

  },
}
</script>
<style lang="stylus" scoped>
@import './reset.styl'
.border
  height 50px
  width 50px
  margin 0 auto
  background pink
  margin-top 20px
</style>