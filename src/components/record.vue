<template>
    <div class="recording">
        <Row  style="padding:10px 0;border-bottom: 1px solid #D9E2E8">
            <Col span="12">
                <Button class="back" icon="arrow-return-left" style="width:80px" title="返回" @click="goBack"></Button>
            </Col>
            <Col span="12">
                <span style="font-size: 16px;font-weight: 600;">充值记录</span>
            </Col>
        </Row>
        <br/>
        <Row>
            <Col span="6">
                <DatePicker type="daterange" v-model="timeList" split-panels confirm  placeholder="请选择日期" style="width: 200px" @on-ok="getList"></DatePicker>
            </Col>
        </Row>
        <br/>
        <Col style="margin:10px 140px;border:1px solid #D9E2E8;">
            <Row style="padding:50px 60px;background:#E3E7EE">
                <Col span="16" style="font-size: 36px;font-weight: 900;">预付费-充钱-1017充值记录</Col>
                <Col span="6" style="float:right;font-size: 18px;
        font-weight: 600;line-height:54px">郑州中原万达广场</Col>
                <Col>2018.12.03~2019.01.02</Col>
            </Row>
            <Col style="padding:50px 60px 100px;">
                <Row style="padding:0 30px 10px">租户编号：ZHBH_1017</Row>
                <Row style="padding:0 30px 20px;border-bottom:1px solid #D9E2E8;">能耗类型：电</Row>
                <Row style="border-bottom:1px solid #D9E2E8;font-size:14px">
                    <Col span="6" style="padding:20px">
                        充值单号
                    </Col>
                    <Col span="6" style="padding:20px">
                        操作时间
                    </Col>
                    <Col span="6" style="padding:20px">
                        操作人
                    </Col>
                    <Col span="6" style="padding:20px">
                        充值金额（元）
                    </Col>
                </Row>
                <Row style="border-bottom:1px solid #D9E2E8;font-size:14px" v-for="(item,index) in 1" :key="index">
                    <Col span="6" style="padding:20px">
                        --
                    </Col>
                    <Col span="6" style="padding:20px">
                        --
                    </Col>
                    <Col span="6" style="padding:20px">
                        --
                    </Col>
                    <Col span="6" style="padding:20px">
                        --
                    </Col>
                </Row>
            </Col>
        </Col>
    </div>
</template>
<script>
import axios from "axios";
import qs from "qs";
import dayjs from "dayjs";
import publicu from "../api.js";
export default {
  data() {
    return {
        dataList: '',
        tenantId:'',
        pageIndex: 1,
        pageSize: 50,
        timeList: [],
        buildingId: '',

    };
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    // 获取数据
    getList(){
        if (!this.timeList[0]) {
             return this.$Message.warning("选择条件");
        }
      var params = {
        buildingId: this.buildingId,
        tenantId: this.tenantId,
        energyTypeId:this.energyTypeId,
        timeFrom: dayjs(this.timeList[0]).format("YYYY-MM-DD HH:mm:ss"),
        timeTo: dayjs(this.timeList[1])
          .add(1, "day")
          .format("YYYY-MM-DD HH:mm:ss"),
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
      };
      axios.post(publicu+"unifier/FNCenterRechargeListService",qs.stringify({"jsonString": JSON.stringify(params)})) .then((res)=>{
            // console.log(res);
            if (res.data.content[0]=='请先授权登录') {
                // return this.$router.push('login');
            }
            if(res.data.content[0]&&res.data.result){
              //  this.cityList = res.data.content[0];
              //  console.log(this.cityList);
            }else{
                console.log(1111);
            }
          }).catch((ex)=>{
            console.log(ex)
          })
    },
  },
  mounted() {
      this.tenantId = this.$route.query.tenantId;
      this.buildingId = this.$route.query.buildingId;
      this.energyTypeId = this.$route.query.energyTypeId;
      console.log(this.$route.query,11111);
  },
};
</script>
<style scoped>
    .recording{
        min-width: 1380px;
        margin: 10px;
        overflow-y: scroll;
    }
</style>