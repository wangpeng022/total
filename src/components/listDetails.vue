<template>
    <div class="details" ref="details" :class="{'up': toUp&&recordShow==0}">
        <header>
            <!-- 项目： {{this.projectName}} -->
            <span>项目：<span>{{buildingName}}</span></span>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <Button class="back" icon="arrow-return-left" style="width:60px" title="返回" @click="goBack"></Button>
        </header>
        <div class="content">
            <p>能耗使用信息：</p>
            <div class="card" >
                <p>{{buildingName}}</p>
                <div class="center" v-if="dianList" v-for="(cur,index) in dianList" :key="index">
                    <ul class="first">
                        <li>仪表ID</li>
                        <li>租户编号</li>
                        <li>租户名称</li>
                        <li>剩余金额</li>
                        <li>剩余时间</li>
                        <li>操作</li>
                    </ul>
                    <ul>
                        <li>{{cur.meterId?cur.meterId:'--'}}</li>
                        <li>{{dataList.tenantId}}</li>
                        <li>{{dataList.tenantName}}</li>
                        <li>{{cur.remainData?cur.remainData.toFixed(2):'--'}}</li>
                        <li>{{cur.remainDays}}</li>
                        <li class="play">
                            <span @click="boxShow(1)">充值</span>
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            <!-- <span>充值记录</span> -->
                        </li>
                    </ul>
                </div>
                <div class="center" v-if="!dianList">
                    <ul class="first">
                        <li>仪表ID</li>
                        <li>租户编号</li>
                        <li>租户名称</li>
                        <li>剩余金额</li>
                        <li>剩余时间</li>
                        <li>操作</li>
                    </ul>
                    <ul>
                        <li>--</li>
                        <li>--</li>
                        <li>--</li>
                        <li>--</li>
                        <li>--</li>
                        <li>--</li>
                    </ul>
                </div>
                <div class="btn" style="">
                  <router-link :to="{path:'/record',query:{tenantId: this.dataList.tenantId,buildingId: this.dataList.buildingId,energyTypeId: this.energyTypeId,tenantName:this.dataList.tenantName}}">充值记录</router-link>
                </div>
            </div>
            <!-- <div class="card" >
               热水啊，燃气啊，没有数据，不写呢先
            </div> -->
            <!-- <div class="recordingBox" :class="{'h0':recordShow}">
                <h3 style="text-align:center" @click="tableShow" :title="recordShow?'点击展开':'点击收起'">充值记录&nbsp;&nbsp;<Icon type="arrow-down-b"></Icon></h3>
                <Table class="recording" :columns="columns1" :data="data1" ref='table' :height="tabHeight"></Table>
            </div> -->
        </div>
        <div class="cover" v-show="boxShowF">
            <div class="box">
                <Icon type="close" @click="boxShow(0)"></Icon>
                <h3>充 值</h3>
                <div class="boxContent">
                    <P>
                        仪 表 I D：<span> {{curParams.meterId}}</span>
                    </P>
                    <P>
                        剩余金额：<span>  {{curParams.remainData?curParams.remainData.toFixed(2):'--'}}元</span>
                    </P>
                    <P>
                        用 户 I D：<span> {{curParams.tenantId}}</span>
                    </P>
                    <span>充值金额：</span>
                    <InputNumber :max="1000000" :step="1" v-model="value2"></InputNumber> 元
                    <p>
                        租户名称：<span>{{dataList.tenantName}}</span>
                    </p>
                    <p>
                        <!-- 能耗类型：<span>预付费</span> -->
                    </p>
                </div>
                <Button type="primary" id="payBtn" @click="Recharge">充 值</Button>


            </div>
        </div>
    </div>
</template>
<script>
import axios from "axios";
import publicu from '../api.js';
import qs from "qs";
import {mapMutations} from 'vuex'
export default {
  name: "listDetails",
  data() {
    return {
      toUp: 1,//上移
      boxShowF: 0,//充值框显示|隐藏
      recordShow: 1,//充值记录显示|隐藏
      value2: 0,
      columns1: [
        {
          title: "充值单号",
          key: "name"
        },
        {
          title: "操作时间",
          key: "age"
        },
        {
          title: "操作人",
          key: "address"
        },
        {
          title: "仪表ID",
          key: "address"
        },
        {
          title: "充值金额（元）",
          key: "age"
        },
        {
          title: "操作后剩余金额（元）",
          key: "age"
        }
      ],
      data1: [],
      tabHeight: "",
      dataList: '',
      pageIndex: 1,
      pageSize: 50,
      dianList: [],
      buildingName: '',
      energyTypeId: '',
      curParams: {}
    };
  },
  props: ["projectName"],
  methods: {
    //充值列表
    getDetails() {
      let params = {
        tenantId: this.dataList.tenantId,
        pageIndex: this.pageIndex,
        pageSize: this.pageSize
      };
      axios.post(publicu+"unifier/FNCenterRechargeListService",qs.stringify({"jsonString": JSON.stringify(params)})) .then((res)=>{
            // console.log(res);
            if (res.data.content[0]=='请先授权登录') {
                return this.$router.push('login');
            }
            if(res.data.content[0]&&res.data.result){
               this.cityList = res.data.content[0];
               console.log(this.cityList);

            }else{
                console.log(1111);

            }
          }).catch((ex)=>{
            console.log(ex)
          })
    },
    boxShow(flag) {
      this.boxShowF = flag;
      this.value2 = 0;
      if (flag==1) {
        this.beforeMoney();
      }
    },
    //展开充值记录
    // tableShow(){
    //   if(this.recordShow){
    //     this.getDetails();
    //   }
    //     this.recordShow=!this.recordShow;
    // },
    goBack(){
      this.$router.go(-1);
    },
    // 进入页面查询meterId
    findMeterId(){
      var params = {
        buildingId: this.dataList.buildingId,
        tenantFlag: this.dataList.tenantFlag,
      };
      axios.post(publicu+"unifier/FNCenterTenantDetailService",qs.stringify({"jsonString": JSON.stringify(params)})) .then((res)=>{
            // console.log(res);
            if (res.data.content[0]=='请先授权登录') {
                // return this.$router.push('login');
            }
            if(res.data.content[0]&&res.data.result){
              console.log(res.data.content[0],1111111);

              this.dataList = res.data.content[0];
              this.buildingName = res.data.content[0].buildingName;
              this.dianList = res.data.content[0].dianList
              this.energyTypeId = this.dianList[0].energyTypeId;

              this.curParams.meterId = this.dianList[0].meterId,
              this.curParams.buildingName = res.data.content[0].buildingName;
              this.curParams.tenantId = this.dataList.tenantId,
              this.curParams.energyTypeId = this.dianList[0].energyTypeId;
              console.log(this.curParams.tenantName,11);

            }else{
                console.log(1111);
            }
          }).catch((ex)=>{
            console.log(ex)
          })
    },
    // 充值前金额查询
    beforeMoney(){
      console.log(this.dataList,222222);
      var params = {
        meterId: this.dianList[0].meterId,
        buildingId: this.dataList.buildingId,
        tenantId: this.dataList.tenantId,
        energyTypeId: this.energyTypeId
      };
      axios.post(publicu+"unifier/FNCenterBeforePrePayService",qs.stringify({"jsonString": JSON.stringify(params)})) .then((res)=>{
            // console.log(res);
            if (res.data.content[0]=='请先授权登录') {
                // return this.$router.push('login');
            }
            if(res.data.content[0]&&res.data.result){
              // this.curParams.remainData = res.data.content[0].remainData;
              this.$set(this.curParams,'remainData',res.data.content[0].remainData);
              this.dianList[0].remainData = this.curParams.remainData;
            }else{
                console.log(1111);
            }
          }).catch((ex)=>{
            console.log(ex)
          })
    },
    // 充值
    Recharge(){
      if (this.value2<=0) {
        return this.$Message.warning('请输入正确金额')
      }
      console.log(this.curParams);

      var params = {
        tenantId: this.curParams.tenantId,
        buildingId: this.dataList.buildingId,
        meterId: this.curParams.meterId,
        energyTypeId: this.energyTypeId,
        money: this.value2
      };
      axios.post(publicu+"unifier/FNCenterRechargeService",qs.stringify({"jsonString": JSON.stringify(params)})) .then((res)=>{
            console.log(res);
            if (res.data.content[0]=='请先授权登录') {
                // return this.$router.push('login');
            }
            if(res.data.content[0]&&res.data.result=='success'){
              this.$Message.success('充值成功');
              this.boxShowF = 0;
              this.value2 = 0;
            }else{
                this.$Message.failed('充值失败');
                this.boxShowF = 0;
            }
          }).catch((ex)=>{
            console.log(ex)
          })
    }
  },
  activated () {
    this.dataList = this.$route.query;
    console.log(this.dataList);

    this.recordShow = 1;
    // console.log(this.$store.state.energyTypeId);
    this.findMeterId();
    // this.$refs.table.addEventListener('scroll',()=>{
    //   console.log(3333);
    // });
  },
  deactivated(){
    console.log(22);

  },
  mounted() {
    console.log(this.$route.query);
    // let bigHeight = window.innerHeight - this.$refs.table.$el.offsetTop + 190;
    // this.tabHeight = bigHeight;
  }
};
</script>
<style lang="less">
.details {
  padding: 20px;
  position: none;
  top: 0;
  left: 0;
  transition: top .4s;
  header {
    p{
      font-size: 16px;
    }
    .back i{
      font-size: 18px;
    }
  }
  &.up{
    position: relative;
    top: -300px;
  }
}
.details .content {
  margin-top: 60px;
  padding: 10px;
  border: 1px solid #CFCFCF;
  border-radius: 4px;
  transition: all .8s linear;
  .card {
    margin: 10px;
    padding: 10px 10px 0;
    border: 1px solid #CFCFCF;
    border-radius: 4px;
    &:hover{
        box-shadow: 1px 2px 3px rgba(0, 0, 0, 0.2);
      }
    .center {
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 80px;
      border: 1px solid #cfcfcf;
      margin: 10px 0;
      ul {
        flex: 1;
        display: flex;
        flex-direction: row;
        &.first {
          background: #eaeef0;
          border-bottom: 1px solid #cfcfcf;
        }
        li {
          flex: 1;
          padding: 10px 0 0 10px;
          border-right: 1px solid #cfcfcf;
          &:nth-last-child(1) {
            border-right: none;
          }
          &.play span{
            display: inline-block;
            color: #57A3F3;
            cursor: pointer;
            &:hover{
              background: #F0F0F0;
            }
            &:active{
              position: relative;
              top: 1px;
            }
          }
        }
      }
    }
    .btn{
      margin: 10px 0;
      display: flex;
      flex-direction: row-reverse;
      a{
        margin-right: 75px;
      }
    }
  }
  .recordingBox{
      margin: 20px 10px 10px;
      padding: 10px;
      // height: 400px;
      height: 700px;
      border: 1px solid #cfcfcf;
      border-radius: 4px;
      transition: height .5s ;
      overflow: hidden;
      h3{
          height: 35px;
          i{
              transition: transform .5s ;
          }
      }
      &:hover{
        box-shadow: 1px 2px 3px rgba(0, 0, 0, 0.2);
      }
  }
  .recordingBox.h0{
      height: 45px;
      h3 i{
          transform: rotate(180deg);
      }
  }
}

/* 弹出框样式 */
.details .cover {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 8;
  .box {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 400px;
    height: 500px;
    transform: translate(-50%, -50%);
    background: #fff;
    i {
      position: absolute;
      top: 0;
      right: 0;
      padding: 13px;
      color: rgb(194, 190, 190);
      &:hover {
        color: #cfcfcf;
        background: rgba(45, 121, 192, 0.438);
        &:active {
          color: #fff;
          background: rgba(58, 81, 158, 0.911);
        }
      }
    }
    h3 {
      width: 100%;
      height: 40px;
      line-height: 40px;
      background: #6985a1;
      text-align: center;
      color: #fff;
    }
    .boxContent {
      padding: 20px 50px;
      line-height: 40px;
    }
    #payBtn {
      position: absolute;
      bottom: 40px;
      left: 50%;
      transform: translateX(-50%);
      width: 300px;
    }
  }
}
</style>