<template>
  <div class='login'>
    <div class="middle">
      <header>
        <h1>租户报表显示系统</h1>
      </header>
      <Input v-model="username" icon="ios-personadd" size="large" placeholder="admin" clearable style="width: 300px;textAlign:center" autofocus @on-focus="back2empy"></Input>
      <br/>
      <Input v-model="password" icon="ios-locked-outline" size="large" placeholder="password" clearable style="width: 300px;textAlign:center;margin:10px 0" @on-enter="login" @on-focus="back2empy"></Input>
      <br/>
      <Button type="primary" style="width:300px;marginBottom:10px" @click.native="login">登录</Button>
      <br/>
      <span style="color:red">{{returntext}}</span>
    </div>
  </div>
</template>
<script>
  import axios from 'axios'
  import qs from 'qs'
  import publicu from '../api.js'
  // import store from '../store'
  import {mapMutations} from 'vuex'
  const setCookie=(c_name,value,expire)=>{
    var date=new Date()
    date.setSeconds(date.getSeconds()+expire)
    document.cookie=c_name+ "="+escape(value)+"; expires="+date.toGMTString()
  }
  export default {
    mounted(){
    console.log(this.$store.state.obj.message)

    },
    computed:{
      message:{
        get(){
          return this.$store.state.obj.message
        },
        set(value){
          this.updateMessage(value)
        }
      },
    },
    data () {
      return {
        flag : false,
        username:'',
        password:'',
        returntext:'',
        err:'',
        sessionId: ''
      }
    },
    methods:{
      login(){
        if (this.username == '') {
          this.returntext = "账号不能为空"
        }else if(this.password == ''){
          this.returntext = "密码不能为空"
        }else{
          axios.post(publicu+"unifier/FNCenterLoginService",qs.stringify({"jsonString": JSON.stringify({userId:this.username,password:this.password})})) .then((res)=>{
            console.log(res);
            if(res.data.content[0]&&res.data.content[0].result){
              this.sessionId = res.data.content[0].sessionId;
              setCookie('sessionId',this.sessionId);
              setCookie('admin',this.sessionId);
              this.$store.commit('setUserid',this.username);
              this.$Message.success('欢迎回来');
              this.$router.push({path:"/totalPage",params:{userid:this.username}});
            }else{
              this.$Message.warning('登录失败');
              this.returntext = '用户名或密码错误'
            }
          }).catch((ex)=>{
            console.log(ex)
          })
        }
      },
      back2empy(){
        this.returntext=''
      },
      // bgMove(e){
      //   console.log(e);

      // },
      ...mapMutations(['updateMessage'])
    }
  }
</script>
<style>
  .login{
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: #e9e9e9;
    z-index: 10;
  }
  .middle{
    position: absolute;
    top: 50%;
    left: 50%;
    width: 500px;
    height: 300px;
    border-radius: 4px;
    transform: translate(-50%,-50%);
    text-align: center;
    background: #fff;
  }
  .middle header{
    margin: 50px 0 30px;
  }
  .forget{
    position: absolute;
    bottom: 0;
    right: 0;
  }
</style>
