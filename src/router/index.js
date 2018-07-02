import Vue from 'vue'
import Router from 'vue-router'
import login from '@/components/login'
import totalPage from '@/components/totalPage'
import {getCookie} from '../../static/js/cookie'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/totalPage',
      name: 'totalPage',
      component: totalPage,
      beforeEnter: (to, from, next) => {
        if (getCookie("admin")=='') {
            next("login");
        }else{
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
