<template>
    <div class="details">
        <header>
            <!-- 项目： {{this.projectName}} -->
            <p>项目：长春金街</p>
        </header>
        <div class="content">
            <p>能耗使用信息：</p>
            <div class="card">
                <p>电-预付费-软充软扣</p>
                <div class="center">
                    <ul class="first">
                        <li>仪表ID</li>
                        <li>剩余金额</li>
                        <li>剩余时间</li>
                        <li>操作</li>
                    </ul>
                    <ul>
                        <li>1111</li>
                        <li>-1090</li>
                        <li>0~0</li>
                        <li class="play">
                            <span @click="boxShow(1)">充值</span>
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            <!-- <span>充值记录</span> -->
                        </li>
                    </ul>
                </div>
            </div>
            <div class="recordingBox" :class="{'h0':recordShow}">
                <h3 style="text-align:center" @click="tableShow">充值记录&nbsp;&nbsp;<Icon type="arrow-down-b"></Icon></h3>
                <Table class="recording" :columns="columns1" :data="data1"></Table>
            </div>
        </div>
        <div class="cover" v-show="boxShowF">
            <div class="box">
                <Icon type="close" @click="boxShow(0)"></Icon>
                <h3>充 值</h3>
                <div class="boxContent">
                    <P>
                        用户ID：<span> 44332121</span>
                    </P>
                    <p>
                        全码： <span>01020203203203023020320</span>
                    </p>
                    <span>充值金额：</span>
                    <InputNumber :max="99999" :min="1" :step="1" v-model="value2"></InputNumber> 元
                    <p>
                        仪表id: <span>339493478347</span>
                    </p>
                    <p>
                        租户名称：<span>北京XXX有限公司</span>
                    </p>
                    <p>
                        能耗类型：<span>预付费</span>
                    </p>
                </div>
                <Button type="primary" id="payBtn">充 值</Button>


            </div>
        </div>
    </div>
</template>
<script>
export default {
  name: "listDetails",
  data() {
    return {
      boxShowF: 0,
      recordShow: 1,
      value2: 0,
      columns1: [
        {
          title: "Name",
          key: "name"
        },
        {
          title: "Age",
          key: "age"
        },
        {
          title: "Address",
          key: "address"
        }
      ],
      data1: [
        {
          name: "John Brown",
          age: 18,
          address: "New York No. 1 Lake Park",
          date: "2016-10-03"
        },
        {
          name: "Jim Green",
          age: 24,
          address: "London No. 1 Lake Park",
          date: "2016-10-01"
        },
        {
          name: "Joe Black",
          age: 30,
          address: "Sydney No. 1 Lake Park",
          date: "2016-10-02"
        },
        {
          name: "Jon Snow",
          age: 26,
          address: "Ottawa No. 2 Lake Park",
          date: "2016-10-04"
        }
      ]
    };
  },
  props: ["projectName"],
  methods: {
    boxShow(flag) {
      this.boxShowF = flag;
    },
    tableShow(){
        this.recordShow=!this.recordShow;
    }
  },
  mounted() {
    console.log(this.$route.query);
  }
};
</script>
<style lang="less">
.details {
  padding: 20px;
  header p {
    font-size: 16px;
  }
}
.details .content {
  margin-top: 60px;
  padding: 10px;
  border: 1px solid #CFCFCF;
  transition: all .8s linear;
  .card {
    margin: 10px;
    padding: 10px 10px 0;
    border: 1px solid #CFCFCF;
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
          &.play span {
            color: #7dc5fa;
            cursor: pointer;
          }
        }
      }
    }
  }
  .recordingBox{
      margin: 10px;
      padding: 10px;
      height: 400px;
      border: 1px solid #cfcfcf;
      transition: height .5s ;
      overflow: hidden;
      h3{
          height: 35px;
          i{
              transition: transform .5s ;
          }
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