import Vue from 'vue'
import vuex from 'vuex'
Vue.use(vuex);

export default new vuex.Store({
  state:{
    userID:''
  },
  mutations:{
    setUserid(state,userid,random){
      state.userID=userid;
      state.random=random;
    }
  }
})
