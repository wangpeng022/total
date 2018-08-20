import Vue from 'vue'
import Router from 'vue-router'
import login from '@/components/login'
import totalPage from '@/components/totalPage'
import tabs from '@/components/tabs'
import home from '@/components/home'
import store from '../store'
const getCookie=(c_name)=>{
  if (document.cookie.length>0){

    let c_start=document.cookie.indexOf(c_name + "=")
    if (c_start!=-1){
      c_start=c_start + c_name.length+1
      let c_end=document.cookie.indexOf(";",c_start)
      if (c_end==-1) c_end=document.cookie.length
      return unescape(document.cookie.substring(c_start,c_end))
    }
  }
  return ""
}
Vue.use(Router)
export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name:'/',
      redirect: '/home',
    },
    {
      path: '/home',
      name:'home',
      component: home,
      beforeEnter: (to, from, next) => {
        if (getCookie("admin")) {
            next();
        }else{
          next("login")
          }
      }
    },
    {
      path: '/totalPage',
      name:'totalPage',
      component: tabs,
      beforeEnter: (to, from, next) => {
        if (getCookie("admin")) {
            next();
        }else{
          next("login")
          }
      }
    },

    {
      path: '/login',
      name: 'login',
      component: login
    },
    {
      path: '*',
      redirect: '/login'
    }
  ]
})
