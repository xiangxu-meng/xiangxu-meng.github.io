<template>
 <div class="foot_guide">
   <span class="guide_item" @click="goTo('/msite')" :class="{on:'/msite' === $route.path}">
     <span class="item_icon">
       <i class="iconfont icon-u"></i>
     </span>
     <span>外卖</span>
   </span>

   <span  class="guide_item " @click="goTo('/search')" :class="{on:'/search' === $route.path}">
     <span class="item_icon">
       <i class="iconfont icon-search"></i>
     </span>
     <span>搜索</span>
   </span>

   <span class="guide_item " @click="goTo('/order')" :class="{on:'/order' === $route.path}">
     <span class="item_icon">
       <i class="iconfont icon-shangchengxitongtubiaozitihuayuanwenjian90"></i>
     </span>
     <span>订单</span>
   </span>

   <span class="guide_item " @click="goTo('/profile')" :class="{on:'/profile' === $route.path}">
     <span class="item_icon">
       <i class="iconfont icon-geren1"></i>
     </span>
     <span>我的</span>
   </span>
 </div>
</template>

<script>
 export default {
  methods:{
    goTo(path){
      this.$router.replace(path)
    }
  }
 }
</script>

<style lang="stylus">
// @import "../../common/stylus/mixins.styl"
  .foot_guide
    top-border-1px(#e4e4e4)
    position fixed
    z-index 100
    left 0
    right 0
    bottom 0
    background-color #eee
    width 100%
    height 52px
    display flex
    .guide_item
      display flex
      flex 1
      text-align center
      flex-direction column
      align-items center
      margin 5px
      color #999
      &.on
        color red
      span 
        font-size 12px
        margin-top 2px
        margin-bottom 2px
        .iconfont
          font-size 22px
</style>
