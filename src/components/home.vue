<template>
    <div class='home'>
        项目：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <a class="search" :class="{'long':search2long}" >
            <Icon class="ser" type="search" @click='searchS(1)'></Icon>
            <Icon class="close" type="close" @click='clear(0)'></Icon>
            <input ref='serKey' class="serKey" type="text" v-model="serText" placeholder="请输入..." @input="pySearch" @blur="clear(0)">
        </a>
        <div class="list" v-show="serText">
            <p v-for="(item,index) in cityListSearch" :key="index" @click="listClick">{{item}}</p>
        </div>
        <Select v-model="model1" style="width:150px">
            <Option v-for="(item,index) in cityList" :value="item.name" :key="index">{{ item.name }}</Option>
        </Select>
            <br/>
            <br/>
        状态：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <Select v-model="model2" style="width:150px" placeholder="已激活">
                    <Option v-for="item in activeList" :value="item.name" :key="item.value"></Option>
        </Select>
        &nbsp;
        能源类型：
        <Select v-model="engeryType" style="width: 150px" placeholder="请输入">
                    <Option v-for="item in engeryTypeList" :value="item.name" :key="item.id"></Option>
                </Select>
                &nbsp;
                <Button @click="getData">查询</Button>
                <Input icon="ios-search" style="width:250px;float:right" placeholder="请输入租户名称或编号"></Input>
        <br/><br/>

        <Table :columns="columns8" stripe :data="data7" :height="tabHeight" size="small" ref="table" :loading='tableLoading' @on-row-click='rowDetails'></Table>
        <div style="margin: 10px;overflow: hidden">
          <div style="float: right;">
            <Page :total="400" size="small" show-elevator show-sizer @on-change="changePage"></Page>
          </div>
          <!-- <Button type="primary" size="large" @click="exportData(1)"><Icon type="ios-download-outline"></Icon> 原始数据下载</Button>
          <Button type="primary" size="large" @click="exportData(2)"><Icon type="ios-download-outline"></Icon> 排序后的数据下载</Button> -->
        </div>
    </div>
</template>
<script>
const PinyinMatch = require("pinyin-match");
import axios from "axios";
import publicu from "../api.js";
import qs from "qs";
export default {
  name: "home",
  data() {
    return {
      cityList: [
        {id: "4101020001", name: "万达0号", costPrice: 1.2},
        {id: "万达一号", name: "万达一号", costPrice: 1.2},
        {id: "万达一号", name: "万达san号", costPrice: 1.2},
        {id: "万达一号", name: "万达si", costPrice: 1.2},
        {id: "万达一号", name: "万达五", costPrice: 1.2},
        {id: "万达一号", name: "万达6", costPrice: 1.2}
      ],
      cityListSearch: [],
      engeryType: "", //参数3 能源类型
      engeryTypeList: [
        {name: "电预付费", id: "Dian_0"},
        {name: "电后付费", id: "Dian_1"}
      ],
      model1: "", //参数1 项目
      search2long: 0,
      serText: "",
      model2: "已激活", //参数2 状态
      activeList: [
        {
          value: 0,
          name: "未激活"
        },
        {
          value: 1,
          name: "已激活"
        }
      ],
      columns8: [
        {
          title: "租户编号",
          key: "tenantId",
          // width: 150,
          sortable: true
        },
        {
          title: "租户名称",
          key: "tenantName"
          // width: 150
        },
        {
          title: "租户全码",
          key: "tenantFlag",
          // width: 150,
          sortable: true
        },
        {
          title: "房间编号",
          key: "roomCodes",
          // width: 150,
          sortable: true
        },
        {
          title: "所属建筑",
          key: "buildingName",
          // width: 150,
          sortable: true
        },
        {
          title: "剩余电量(kWh)",
          key: "remainData",
          // width: 150,
          sortable: true,
          render:(h,params) => {
            return h("div",params.row.remainData?params.row.remainData.toFixed(2):''
            )
          }
        },
        {
          title: "剩余金额(元)",
          key: "remainMoney",
          // width: 150,
          sortable: true,
          render:(h,params) => {
            return h("div",params.row.remainMoney?params.row.remainMoney.toFixed(2):''
            )
          }
        },
        {
          title: "剩余天数",
          key: "remiandays",
          // width: 150,
          sortable: true
        }
      ],
      data7: [
        {
          tenantName: "Name1",
          tenantId: 11,
          tenantFlag: 7302,
          buildingId: 5627,
          buildingName: "www",
          roomIds: 4254,
          remainMoney: 1438,
          remainData: 274,
          remiandays: 285
        },
        {
          tenantName: "Name2",
          tenantId: 12,
          tenantFlag: 7304,
          buildingId: 5626,
          buildingName: "www",
          roomIds: 4255,
          remainMoney: 2438,
          remainData: 284,
          remiandays: 275
        }
      ],
      tabHeight: "",
      tableLoading: false,
    };
  },
  methods: {
    exportData(type) {
      if (type === 1) {
        this.$refs.table.exportCsv({
          filename: "The original data"
        });
      } else if (type === 2) {
        this.$refs.table.exportCsv({
          filename: "Sorting and filtering data",
          original: false
        });
      } else if (type === 3) {
        this.$refs.table.exportCsv({
          filename: "Custom data",
          columns: this.columns8.filter((col, index) => index < 4),
          data: this.data7.filter((data, index) => index < 4)
        });
      }
    },
    changePage() {
      console.log("翻页");
    },
    searchS(i) {
      this.search2long = i;
      if (i==1) {
        setTimeout(() => {
        this.$refs.serKey.focus();
        }, 500);
      }
    },
    clear(i) {
      if (this.serText) {
        this.serText = "";
        this.$refs.serKey.focus();
      }
      this.searchS(i);

    },
    pySearch() {
      this.cityListSearch = [];
      if (this.serText) {
        this.cityList.forEach((cur, index) => {
          let mat = PinyinMatch.match(cur.name, this.serText);
          if (mat) {
            let index0 = PinyinMatch.match(cur.name, this.serText)[0];
            let index1 = PinyinMatch.match(cur.name, this.serText)[0];
            // console.log(PinyinMatch.match(cur.name, this.serText));

            let name = cur.name.slice(index0, index1 + 1);
            this.cityListSearch.push(cur.name);
          }
        });
      }
    },
    listClick(e) {
      console.log(e.target.innerText);
      this.model1 = e.target.innerText;
      this.serText = "";
      this.search2long = 0;
    },
    //单击行跳转到详情
    rowDetails(a, b) {
      console.log(a,b);
      this.$router.push({ path: `/listDetails/${a.name}`, query: a });
    },
    //初始化时获取项目列表
    getProjectList() {
      axios.post(
          publicu + "unifier/FNCenterBuildingListService",
          qs.stringify({ jsonString: JSON.stringify({}) })
        )
        .then(res => {
          // console.log(res);
          // if (res.data.content[0] == "请先授权登录") {
          //   return this.$router.push("login");
          // }
          if (res.data.content[0] && res.data.result) {
            this.cityList = res.data.content[0];
            // console.log(this.cityList);
          } else {
            // console.log(1111);
          }
        })
        .catch(ex => {
          console.log(ex);
        });
    },
    // 初始化获取能源类型列表
    getEnergyType(){
      axios.post(
          publicu + "unifier/FNCCommonEnergyTypePayTypeListService",
          qs.stringify({ jsonString: JSON.stringify({}) })
        )
        .then(res => {
          // console.log(res);
          // if (res.data.content[0] == "请先授权登录") {
          //   return this.$router.push("login");
          // }
          if (res.data.content[0] && res.data.result) {
            // console.log(3333);

            this.engeryTypeList = res.data.content[0];
            // console.log(this.engeryTypeList);
          } else {
            console.log(1111);
          }
        })
        .catch(ex => {
          console.log(ex);
        });
    },
    //查询
    getData() {
      if (!this.model1 || !this.model2 || !this.engeryType) {
        return this.$Message.warning("选择条件");
      }
      // 6个参数 keyword非必须
      let params = {
        buildingId: this.cityList.filter(cur => cur.name == this.model1)[0].id,
        status: this.activeList.filter(cur => cur.name == this.model2)[0].value,
        energyTypeId: this.engeryTypeList.filter(
          item => item["name"] == this.engeryType
        )[0].id,
        // keyword: "",
        pageIndex: 4,
        pageSize: 100
      };
      this.tableLoading = true;
      axios.post(
          publicu + "unifier/FNCenterTenantListService",
          qs.stringify({ jsonString: JSON.stringify(params) })
        )
        .then(res => {
          // console.log(res);
          if (res.data.content[0] == "请先授权登录") {
            // return this.$router.push('login');
          }
          if (res.data.content[0] && res.data.result) {
            this.data7 = res.data.content[0];
            this.tableLoading = false;
          } else {
            console.log(1111);
          }
        })
        .catch(ex => {
          console.log(ex);
          this.tableLoading = false;
        });
    }
  },
  mounted() {
    this.getProjectList();
    this.getEnergyType();
    var bigHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 120;
    this.tabHeight = bigHeight;
  }
};
</script>
<style scoped>
.home {
  position: relative;
  width: 100%;
  height: 100%;
  padding: 10px;
}
.home .search {
  position: absolute;
  top: 10px;
  left: 55px;
  display: inline-block;
  width: 34px;
  height: 34px;
  border: 1px solid #dddee1;
  border-radius: 17px;
  /* text-align: center; */
  line-height: 34px;
  z-index: 15;
  background: #fff;
  transition: width 0.5s;
  overflow: hidden;
}
.home .search.long {
  width: 205px;
}
.home .search:hover {
  border: 1px solid #57a3f3;
}
.home .search:active {
  border: 1px solid #57a3f3;
  box-shadow: 0 0 3px #57a3f3;
}
.home .search .ser {
  font-size: 18px;
  padding: 7px 9px;
  /* margin-left: 10px; */
}
.home .search .serKey {
  position: relative;
  top: -3px;
  outline: none;
  border: 0px;
  width: 140px;
  height: 100%;
}
.home .close {
  position: absolute;
  top: 0;
  left: 175px;
  padding: 10px;
  font-size: 12px;
  color: #c2c2c2;
}
.home .close:hover {
  color: #374045;
}
.home .list {
  position: absolute;
  top: 44px;
  left: 55px;
  width: 206px;
  min-height: 50px;
  border: 1px solid #dddee1;
  border-radius: 4px;
  background: #fff;
  z-index: 16;
}
.home .list p {
  padding-left: 30px;
}
.home .list p:hover {
  background: #57a3f3;
}
</style>