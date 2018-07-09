import Vue from 'vue'
import Router from 'vue-router'
const login = ()=>import('@/components/login')
const totalPage = ()=> import('@/components/totalPage')
// import {getCookie} from '../../static/js/cookie'
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
  routes: [
    {
      path: '/totalPage',
      name: 'totalPage',
      component: totalPage,
      beforeEnter: (to, from, next) => {
        const _userid=store.state.userID||window.localStorage.getItem('userId');
        if (!getCookie(_userid)) {
          next("login");
        } else {
          next()
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
      redirect: '/totalPage'
    }
  ]
})
