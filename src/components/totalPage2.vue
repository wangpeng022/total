<template>
  <div class="content" ref="countWrap">
    <Row>
      <Col span="5">
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
      <Col span="4" v-text="sumMoney+'元'"></Col>
    </Row>
    <br/>
    <Table ref="table" :height="tabHeight" :columns="columns1" :data="data1"></Table>
    <Table :style="style1" ref="tablePrint" width="1096" :height="tabHeight" :columns="columns1" :data="data1"></Table>
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
          title: "分公司id",
          key: "branchCompanyId"
        },
         {
          title: "分公司名称",
          key: "branchCompanyName"
        },
         {
          title: "项目名称",
          key: "buildingName"
        },
        {
          title: "账单编号",
          key: "orderId"
        },
        // {
        //   title: "租户全码",
        //   key: "tenantFlag"
        // },
        {
          title: "能耗类型",
          key: "energyTypeId"
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
          title: "退费金额",
          key: "returnData"
        },
        {
          title: "操作时间",
          key: "operateTime"
        },
        {
          title: "操作人",
          key: "userName"
        },
        // {
        //   title: "微信支付时间",
        //   key: "wxPayTime"
        // },
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
      fileID: ""
    };
  },
  props: ["projectList"],
  watch: {
    name1(newVal, oldVal) {
      console.log(newVal, oldVal);
    }
  },
  methods: {
    inputhandle(e) {
      this.from.a = e.target.value;
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
    // downLoad() {
    //   if (!this.projectName || !this.engeryType || !this.timeList[0]) {
    //     return this.$Message.warning("选择条件");
    //   }
    //   const param = this.getQuery(1);
    //   console.log(param);

    //   this.getList(param)
    //     .then(res => {
    //       if (res.data && res.data.content) {
    //         this.fileID = res.data.content[0].id;
    //         console.log(res.data.content[0].id);
    //         return res.data.content[0].id;
    //       }
    //     })
    //     .then(id => {
    //       this.downFile(id);
    //     })
    //     .catch(ex => {
    //       console.log(ex);
    //     });
    // },

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
          if (res.data && res.data.content) {
            const name = res.data.content[0].name;
            let temp = res.data.content[0].list
            this.data1 = temp;
            console.log(this.data1);

            this.sumMoney = res.data.content[0].sumMoney;
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
        isDownload: isDownload
      };
      return param;
    },
    // 查询|下载接口
    getList(param) {
      return this.$axios.post(
        publicu + "unifier/FNCenterRecordReturnGridService",
        qs.stringify({ jsonString: JSON.stringify(param) })
      );
    },

    downFile(param) {
      this.$axios({
        responseType: 'arraybuffer',
        method: "post",
        url: publicu + "unifier/FNCenterRecordCostService",
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
      selected = null;

      // this.$refs.drop.$children[1].$el.style.display='none';
      console.log(this.$refs.drop.$children[1].$el);
    },
    dropShow(){
      // this.$refs.drop.$children[1].$el.style.display='block';
    }
  },
  mounted() {
    var bigHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 20;
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
