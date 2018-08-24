<template>
  <div id="app">
    <header>
      <div class="img">
        <img src="../static/imgs/newCity2.png" alt="">

        <h2>能源管理中心平台</h2>
      </div>
      <div class="right">
        <router-link :to='{name:"home"}'>充值管理</router-link>
        <router-link :to='{name:"totalPage"}'>报表管理</router-link>
      </div>
      <div class="quit" @click="quit">
        退出
      </div>
    </header>
    <!-- <keep-alive>
      <router-view/>
    </keep-alive> -->
    <keep-alive>
        <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
  </div>
</template>

<script>
import {setCookie} from '../static/js/cookie.js'
export default {
  name: 'App',
  data(){
    return {

    }

  },
  methods: {
    quit(){
      let c_name = this.$store.state.userID;
      console.log(c_name);
      setCookie(c_name, "", -1);
      setCookie('sessionId', "", -1);
      this.$router.push('/login');
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  width: 100%;
  height: 100%;
  min-width: 950px;
  padding-top: 50px;
}
#app>header{
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  justify-content: space-between;
  width: 100%;
  min-width: 950px;
  height: 50px;
  background-color: #374045;

}
#app>header>.img{
  display: flex;
  justify-content: center;
  color: #fff;
}
#app>header>.img>img{
  height: 100%;
}
#app>header>.img h2{
  width: 350px;
  padding-left: 10px;
  line-height: 50px;
}
#app>header .right{
  line-height: 50px;
  /* margin-left: 200px; */
}
#app>header .quit{
  line-height: 50px;
  color: #fff;
  margin-right: 30px;
  cursor: pointer;
}
#app>header .right a{
  font-size: 16px;
  color: #fff;
  padding: 8px;
}
#app>header .right a.router-link-active{
  color: #fff;
  font-weight: 600;
  font-size: 18px;

}
* {
    margin: 0;
    padding: 0;
}
body{
    /* user-select: none; */
    width: 100%;
    height: 100vh;
    overflow: hidden;
    font-size: 14px;
}

a {
    text-decoration: none;
}

ul li {
    list-style: none;
}
body ::-webkit-scrollbar { width: 10px; height: 10px; }
body ::-webkit-scrollbar-track { background-color: #fff; -webkit-border-radius: 8px; }
body ::-webkit-scrollbar-thumb { -webkit-border-radius: 5px; background: #e6e6e6; border: none; }
body ::-webkit-scrollbar-thumb:vertical:hover { background-color: #a6a6a6; border: none; }
body ::-webkit-scrollbar-thumb:hover { background-color: #a6a6a6; border: none; }
</style>
