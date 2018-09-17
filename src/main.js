/*
 入口js
 */
import Vue from 'Vue'
import App from './App.vue'
import router from './router'
// 新建
new Vue({
    el:'#app',
    render: h => h(App),
    router
})