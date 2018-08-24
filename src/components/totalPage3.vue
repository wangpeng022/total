<template>
  <div class="content" ref="countWrap">
    <Row>
      <Col span="6">
      <DatePicker type="daterange" v-model="timeList" split-panels confirm  placeholder="请选择日期"
                  style="width: 200px"></DatePicker>
      </Col>
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
      <Col span="4" v-text="amountCost+'元'"></Col>
    </Row>
    <br/>
    <Table  ref="table" :height="tabHeight" :columns="columns1" :row-class-name="rowClassName" :data="data1"></Table>
    <Table :style="style1" ref="tablePrint" width="1096" :height="tabHeight" :columns="columns1" :data="data1"></Table>
    <!-- <div style="margin: 10px;overflow: hidden">
      <div style="float: right;">
        <Button @click="changePage(1)">首页</Button>
        <Button @click="changePage(0,1)">上一页</Button>
        <InputNumber style="width:50px" readonly :min="1" v-model="pageIndex"></InputNumber>
        <Button @click="changePage(0,0)">下一页</Button>
      </div>
    </div> -->
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
        // {
        //   title: "分公司名称",
        //   key: "id"
        // },
        {
          title: "项目名称",
          key: "name"
        },
        {
          title: "总能耗",
          key: "amount"
        },
        {
          title: "总能耗成本（元）",
          key: "amountCost"
        },
        {
          title: "总能耗收入（元）",
          key: "money"
        },
         {
          title: "总能耗溢价（元）",
          key: "premiumMoney"
        },
        {
          title: "充值总金额(元)",
          key: "prepayMoney"
        },
        {
          title: "剩余总金额（元）",
          key: "remainMoney"
        },

      ],
      dataList: [],
      data1: [],
      projectName: "",
      showList: 0,
      engeryType: "电",
      amountCost: 0,
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
      tabHeight: 676,
      style1: {
        display: "none"
      },
      timeList: [],
      fileID: "",
      pageTotal: 200, //分页总条数
      pageIndex: 1,
      pageSize: 50,
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
      this.getList(param).then(res=>res.data)
        .then(res => {
          console.log(res);

          if (res.result=='success'&&res.content) {
            this.dataList =  res.content;
            this.data1 = [];
            this.fixData(this.dataList);
          }
        })
        .catch(ex => {
          console.log(ex);
        });
    },
    // 拼数据
    fixData(data) {
      for (var i = 0; i < data.length; i++) {
        var cur = data[i];
        console.log(cur);
        if (cur['list']) {
          this.fixData(cur['list']);
            var item = {
            amount: cur.amount,
            amountCost: cur.amountCost,
            money: cur.money,
            name:  cur.name+'汇总',
            prepayMoney: cur.prepayMoney,
            remainMoney: cur.remainMoney,
            premiumMoney: cur.premiumMoney,
            isSum: 1
          }
          this.data1.push(item);
        }else{
          this.data1.push(cur);
        }
        console.log(this.data1);
      }
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
      };
      return param;
    },
    // 查询|下载接口
    getList(param) {
      return this.$axios.post(
        publicu + "unifier/FNCenterRecordCostService",
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
          // console.log(res);
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

      // console.log(this.$refs.drop.$children[1].$el);
    },
    dropShow(){
      // this.$refs.drop.$children[1].$el.style.display='block';
    },
    rowClassName(row,index){
        if (row.isSum==1) {
          return 'table-sum-row'
        }
        if (row.isSum==2) {
          return 'table-sum2-row'
        }
        return ''
    },
  },
  mounted() {
  }
};
</script>
<style>
.content {
  margin: 18px;
}

.title {
  display: inline-block;
  color: white;
}

.ivu-table .table-sum-row td{
  /* font-size: 14px; */
  font-weight: 600;
  background-color: #ececec;
}
.ivu-table .table-sum2-row td{
  /* font-size: 14px; */
  font-weight: 650;
  background-color: #b6b3b3;
}
</style>
