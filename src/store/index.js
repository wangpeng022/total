import Vue from 'vue'
import vuex from 'vuex'
Vue.use(vuex);

export default new vuex.Store({
  strict: true,
  state:{
    obj:{
      message:'sdsdsds'
    },
    userID:'',
  },
  mutations:{
    setUserid(state,userid){
      state.userID=userid;
    },
    updateMessage(state,payload){
      state.obj.message=payload
    }
  },
  actions:{

  }
})
