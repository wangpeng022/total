<template>
  <div class='login'>
    <div class="middle">
      <Input v-model="username" icon="ios-personadd" size="large" placeholder="admin" clearable style="width: 300px;textAlign:center" autofocus @on-focus="back2empy"></Input>
      <br/>
      <Input v-model="password" icon="ios-locked-outline" size="large" placeholder="admin" clearable style="width: 300px;textAlign:center;margin:10px 0" @on-enter="login" @on-focus="back2empy"></Input>
      <br/>
      <Button type="success" style="width:300px;marginBottom:10px" @click.native="login">登录</Button>
      <br/>
      <span style="color:red">{{returntext}}</span>
    </div>
  </div>
</template>
<script>
  import axios from 'axios'
  import qs from 'qs'
  import publicu from '../api.js'
  // import {setCookie} from '../../static/js/cookie'
  const setCookie=(c_name,value,expire)=>{
    var date=new Date()
    date.setSeconds(date.getSeconds()+expire)
    document.cookie=c_name+ "="+escape(value)+"; expires="+date.toGMTString()
    // console.log(document.cookie)
  }
  export default {
    data () {
      return {
        flag : false,
        username:'',
        password:'',
        returntext:'',
        err:'',
      }
    },
    methods:{
      login(){
        if (this.username == '') {
          this.returntext = "账号不能为空"
        }else if(this.password == ''){
          this.returntext = "密码不能为空"
        }else{
          axios.post(publicu+"unifier/FNCentreLoginService",qs.stringify({"jsonString": JSON.stringify({userId:this.username,password:this.password})})) .then((res)=>{
            console.log(res)
            if(res.data.content[0]&&res.data.content[0].result){
              this.$store.commit('setUserid',this.username,res.data.content[0].random)
              window.localStorage.setItem('userId',this.username)
              setCookie(this.username,res.data.content[0].random);
              this.$Message.success('欢迎回来');
              this.$router.push({path:"/totalPage",params:{userid:this.username}});
            }else{
              this.$Message.warning('登录失败');
            }
          }).catch((ex)=>{
            console.log(ex)
          })
        }
      },
      back2empy(){
        this.returntext=''
      },
    },
    mounted(){


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
    background: linear-gradient(lightblue, pink);
    z-index: 1000;
  }
  .middle{
    position: absolute;
    top: 50%;
    left: 50%;
    height: 160px;
    transform: translate(-50%,-50%);
    text-align: center;
  }
  .forget{
    position: absolute;
    bottom: 0;
    right: 0;
  }
</style>
