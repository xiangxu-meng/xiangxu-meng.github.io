<template>
  <div class="msite">
    <!-- 首页头部 -->
    <header class="msite_header">
      <span class="header_search">
        <i class="iconfont icon-search1"></i>
      </span>
      <span class="header_title">
        <span class="header_title_text ellipsis">test</span>
       </span>
       <span class="header_login">
         <span class="header_login_text">登录|注册</span>
       </span>
    </header>
    <!-- 首页导航 -->
    <nav class="msite_nav">
    </nav>
    <!-- 首页附近商家 -->
    <div class="msite_shop_list">

    </div>

  </div>

</template>

<script>
 export default {
   data () {
     return {

     }
   },
   components: {

   }
 }
</script>
<style lang="stylus">
  .msite
    width:100%
    .msite_header
      height 45px
      width 100%
      background-color #02a774
      position fixed
      z-index 100
      left 0
      top 0
      line-height: 44px;
      .header_search
        margin-right 15px
        margin-left 5px
        height: 45px
        width: 60px
        float left
        .icon-search1
          font-size 22px
      .header_title
        .header_title_text
              width: 187px;
              display: inline-block;  
      .header_login
        float right 
          
      
</style>
