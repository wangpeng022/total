<template>
  <div class="content" ref="countWrap">
    <Row>
      <Col span="6">
      <DatePicker type="daterange" v-model="timeList" split-panels confirm  placeholder="请选择日期"
                  style="width: 200px"></DatePicker>
      </Col>
      <!-- <Col span="4">
      <Select v-model="projectName" style="width: 150px" placeholder="请选择项目类型">
        <Option v-for="item in projectList" :value="item.name" :key="item.id">
        </Option>
      </Select>
      </Col> -->
      <Col span="4">
        <Dropdown trigger="click" style="width: 130px" @on-click="selectMenu" ref="drop">
          <Button style="width: 130px" @click="dropShow">
            <span v-text="projectName||'请选择项目'"></span>&nbsp;<Icon type="ios-arrow-down" />
          </Button>
          <DropdownMenu slot="list" v-for="(item,index1) in projectList" :key="item.id" >
              <Dropdown placement="right-start" >
                  <DropdownItem style="text-align: center" :name="index1">
                      {{item.name}}
                      <Icon type="ios-arrow-forward"></Icon>
                  </DropdownItem>
                  <DropdownMenu slot="list" v-for="(item,index2) in item.list" :key="item.id" style="width: 130px">
                      <Dropdown placement="right-start" >
                        <DropdownItem :name="index1+'-'+index2">
                            {{item.name}}
                            <Icon type="ios-arrow-forward"></Icon>
                        </DropdownItem>
                        <DropdownMenu slot="list" v-for="(item,index3) in item.list" :key="index3" style="width: 130px">
                            <DropdownItem :name="index1+'-'+index2+'-'+index3" >{{item.name}}</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                  </DropdownMenu>
              </Dropdown>
          </DropdownMenu>
        </Dropdown>
      </Col>

      <Col span="4">
      <Select v-model="engeryType" style="width: 150px" placeholder="电">
        <Option v-for="item in engeryTypeList" :value="item.name" :key="item.value"></Option>
      </Select>
      </Col>
      <Col span="2">
      <Button @click="queryList">查询</Button>
      </Col>
      <Col span="4">
      <Button @click="downLoad">下载</Button>
      <Button @click="printSome">打印</Button>
      </Col>
    </Row>
    <br/>
    <Row ref="total">
      <Col span="2">汇总：</Col>
      <Col span="3" v-text="sumMoney?sumMoney.toFixed(2)+' 元':0+' 元'"></Col>
      <Col span="2">微信汇总：</Col>
      <Col span="3">
        <span v-text="wxMoney?wxMoney.toFixed(2)+' 元':0+' 元'"></span>
        &nbsp;
        <span v-text="wxCount+' 笔'"></span>
      </Col>
      <Col span="2">PC充值汇总：</Col>
      <Col span="3">
        <span v-text="pcMoney?pcMoney.toFixed(2)+' 元':0+' 元'"></span>
        &nbsp;
        <span v-text="pcCount+' 笔'"></span>
      </Col>

    </Row>
    <br/>
    <Table ref="table" :height="tabHeight" :columns="columns1" :data="data1"></Table>
    <Table :style="style1" ref="tablePrint" width="1096" :height="tabHeight" :columns="columns1" :data="data1"></Table>
    <div style="margin: 10px;overflow: hidden">
      <div style="float: right;">
        <!-- <Page :total="pageTotal" size="small" show-elevator show-sizer @on-change="changePage" :page-size='pageSize' :page-size-opts='[50,100,150]' :current='pageIndex'></Page> -->
        <Button @click="changePage(1)">首页</Button>
        <Button @click="changePage(0,1)">上一页</Button>
        <InputNumber style="width:50px" readonly :min="1" v-model="pageIndex"></InputNumber>
        <Button @click="changePage(0,0)">下一页</Button>
      </div>
    </div>
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
      columns1: [
        {
          title: "分公司名称",
          key: "branchCompanyName"
        },
        {
          title: "项目名称",
          key: "buildingName"
        },
        {
          title: "充值单号",
          key: "orderId"
        },
        {
          title: "能耗类型",
          key: "energyTypeId",
          render:(h,params) => {
            return h("div", this.engeryTypeList.filter(
              item => item["value"] == params.row.energyTypeId
            )[0].name
            )
          }
        },
        {
          title: "租户名称",
          key: "tenantName"
        },
        {
          title: "仪表编码",
          key: "meterId"
        },
        {
          title: "充值金额",
          key: "payMoney"
        },
        {
          title: "账单生成时间",
          key: "orderTime"
        },
        {
          title: "操作人",
          key: "operateName"
        },
        // {
        //   title: "更新状态时间",
        //   key: "updateTime"
        // }
      ],
      data1: [],
      projectName: "",
      showList: 0,
      engeryType: "电",
      sumMoney: 0,
      wxMoney: 0,
      pcCount: 0,
      wxCount: 0,
      pcMoney: 0,
      selectedProject: {},
      engeryTypeList: [
        {
          value: "Dian",
          name: "电"
        },
        {
          value: "Shui",
          name: "水"
        },
        {
          value: "ReShui",
          name: "热水"
        },
        {
          value: "RanQi",
          name: "燃气"
        }
      ],
      tabHeight: 800,
      style1: {
        display: "none"
      },
      timeList: [],
      fileID: "",
      sessionId: '',
      pageTotal: 200, //分页总条数
      pageIndex: 1,
      pageSize: 50
    };
  },
  props: ["projectList"],
  // watch: {
  //   name1(newVal, oldVal) {
  //     console.log(newVal, oldVal);
  //   }
  // },
  methods: {
    inputhandle(e) {
      this.from.a = e.target.value;
    },
    getCookie(c_name){
    if (document.cookie.length>0){
        let c_start=document.cookie.indexOf(c_name + "=")
        if (c_start!=-1){
            c_start=c_start + c_name.length+1
            let c_end=document.cookie.indexOf(";",c_start)
            if (c_end==-1) c_end=document.cookie.length
                return unescape(document.cookie.substring(c_start,c_end))
            }
        }
    return ""
    },
    printSome() {
      let inner = this.$refs.tablePrint.$el.innerHTML;
      let link = "https://unpkg.com/iview@2.14.3/dist/styles/iview.css";
      let totalText = `<div style="margin: 10px 0 0 10px" data-v-6c37fe9a="" class="ivu-row">${
        this.$refs.total.$el.innerHTML
      }</div>`;
      let htmlText = `<!DOCTYPE html><html><head><meta charset="UTF-8"><link href="${link}" rel="stylesheet"><style type="text/css">.ivu-table-header table,.ivu-table-body table{width:100%!important;}.ivu-table-overflowY{overflow:hidden!important;}.ivu-table-wrapper{border:1px solid #dddee1!important}</style></head><body style="width: 1096px;">${totalText}<div class="ivu-table-wrapper">${inner}</div></body></html>`;
      const f = document.getElementById("printf");
      f.contentDocument.write(htmlText);
      window.frames["printf"].document.getElementsByClassName(
        "ivu-table-body"
      )[0].style.height =
        "auto";
      f.contentDocument.close();
      setTimeout(() => {
        f.contentWindow.print();
      }, 1000);
    },
    // 下载
    downLoad() {
      if (!this.projectName || !this.engeryType || !this.timeList[0]) {
        return this.$Message.warning("选择条件");
      }
      const param = this.getQuery(1);
      this.downFile(param)
    },

    // 查询
    queryList() {
      if (!this.projectName || !this.engeryType || !this.timeList[0]) {
        return this.$Message.warning("选择条件");
      }
      const param = this.getQuery();
      this.getList(param)
        .then(res => {
          // console.log(res);
          if (res.data && res.data.content) {
            console.log(res.data);

            if (res.data.content[0]=='请先授权登录') {
              this.$router.push({path:"/login"});
              return this.$Message.warning("请先授权登录");
            }
            let temp = res.data.content[0];
            this.data1 = temp.list;
            // console.log(this.data1);
            this.sumMoney = temp.sumMoney;
            this.wxMoney = temp.wxMoney;
            this.pcCount = temp.pcCount;
            this.wxCount = temp.wxCount;
            this.pcMoney = temp.pcMoney;
            temp = null;
          }
        })
        .catch(ex => {
          console.log(ex);
        });
    },
    // 拼参数
    getQuery(isDownload = 0) {
      const parentCompanyId = this.selectedProject.parentCompanyId;
      const branchCompanyId = this.selectedProject.branchCompanyId;
      const buildingId = this.selectedProject.buildingId;
      const energyTypeId = this.engeryTypeList.filter(
        item => item["name"] == this.engeryType
      )[0].value;
      const param = {
        parentCompanyId,
        branchCompanyId,
        buildingId,
        energyTypeId,
        timeFrom: dayjs(this.timeList[0]).format("YYYY-MM-DD HH:mm:ss"),
        timeTo: dayjs(this.timeList[1])
          .add(1, "day")
          .format("YYYY-MM-DD HH:mm:ss"),
        isDownload: isDownload,
        pageIndex: this.pageIndex,
        pageSize: this.pageSize
      };
      return param;
    },
    // 查询|下载接口
    getList(param) {
      return this.$axios({
        method: "post",
        url: publicu + "unifier/FNCenterRecordPrePayGridService",
        data: qs.stringify({ jsonString: JSON.stringify(param) }),
      }

      );
    },

    downFile(param) {
      this.$axios({
        responseType: 'arraybuffer',
        method: "post",
        url: publicu + "unifier/FNCenterRecordPrePayGridService",
        data: qs.stringify({ jsonString: JSON.stringify(param) }),
        responseType: "blob"
      })
      // this.getList(param)
        .then(res => {
          console.log(res);

          const filename = decodeURI(
            res.headers["content-disposition"]
              .split(";")
              .filter(item => item.indexOf("filename") >= 0)[0]
              .split("=")[1]
              .replace(/\"/g, "")
          );
          const blob = new Blob([res.data], {
            type: "application/vnd.ms-excel",
            data: 'text/csv',
            charset: 'utf-8',
          });
          if ("download" in document.createElement("a")) {
            // 非IE下载
            const elink = document.createElement("a");
            elink.download = filename;
            elink.style.display = "none";
            elink.href = URL.createObjectURL(blob);
            document.body.appendChild(elink);
            elink.click();
            URL.revokeObjectURL(elink.href); // 释放URL 对象
            document.body.removeChild(elink);
          } else {
            // IE10+下载
            navigator.msSaveBlob(blob, filename);
          }
        })
        .catch(ex => {
          console.log(ex);
        });
    },
    // 下拉选项触发
    selectMenu(name) {
      console.log(name);
      var indexArr = name===0?[0]:name.split("-"),
        selected;
      switch (indexArr.length) {
        case 1:
          selected = this.projectList[indexArr[0]];
          selected.parentCompanyId = selected.id;
          break;
        case 2:
          selected = this.projectList[indexArr[0]].list[indexArr[1]];
          selected.parentCompanyId = this.projectList[indexArr[0]].id;
          selected.branchCompanyId = selected.id;
          break;
        case 3:
          selected = this.projectList[indexArr[0]].list[indexArr[1]].list[
            indexArr[2]];
          selected.parentCompanyId = this.projectList[indexArr[0]].id;
          selected.branchCompanyId = this.projectList[indexArr[0]].list[indexArr[1]].id;
          selected.buildingId = selected.id;
          break;
        default:
          break;
      }
      this.selectedProject = selected;
      this.projectName = selected.name;
      // console.log(this.$refs.drop.handleClose);
      // this.$refs.drop.handleClose();

      selected = null;
      // this.$refs.drop.$children[1].$el.style.display='none';
      // console.log(this.$refs.drop.$children[1].$el);
    },
    dropShow(){
      // this.$refs.drop.$children[1].$el.style.display='block';
    },
    //分页事件
    changePage(page,up){
      if (page) {
        this.pageIndex = page;
      }else{
        if (up) {
          this.pageIndex-=1;
          if (this.pageIndex<=0) {
            return this.pageIndex+=1;
          }
        }else{
          this.pageIndex+=1;
        }
      }
      this.queryList();
    }
  },
  mounted() {
    this.sessionId = this.getCookie('admin');
    // console.log(this.sessionId);
    let bigHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 120;
    this.tabHeight = bigHeight;
  }
};
</script>
<style scoped>
.content {
  margin: 18px;
}

.title {
  display: inline-block;
  color: white;
}

.tButton {
  display: inline-block;
  float: right;
}
</style>
