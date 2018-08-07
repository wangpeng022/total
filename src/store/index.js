import Vue from 'vue'
import vuex from 'vuex'
Vue.use(vuex);

export default new vuex.Store({
  strict: true,
  state:{
    obj:{
      message:'sdsdsds'
    },
    userID:''
  },
  mutations:{
    setUserid(state,userid,random){
      state.userID=userid;
      state.random=random;
    },
    updateMessage(state,payload){
      state.obj.message=payload
    }
  },
  actions:{

  }
})
