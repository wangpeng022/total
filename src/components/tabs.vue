<template>
  <Tabs :animated="false" type="card" class="tabWrap" ref="tabs">
    <TabPane v-for="item in tabCount" :label="item.name" :key="item.name">
      <component :is="item.componentId" :projectList='projectList'></component>
    </TabPane>
  </Tabs>
</template>

<script>
import totalPage1 from "./totalPage";
import totalPage2 from "./totalPage2";
import totalPage3 from "./totalPage3";
import qs from "qs";
import publicu from "../api.js";
export default {
  name: "tabs",
  data() {
    return {
      tabCount: [
        { name: "租户充值记录查询报表", componentId: "totalPage1" },
        { name: "租户退费记录查询报表", componentId: "totalPage2" },
        { name: "租户财务对账分析报表", componentId: "totalPage3" }
      ],
      projectList: [
        {
          id: "万达集团",
          name: "万达集团",
          list: [
            {
              id: "万达北京分公司",
              name: "万达北京分公司",
              list: [
                { name: "万达", id: "万达一号" },
                { name: "万达", id: "万达一号" }
              ]
            },
            {
              id: "万达上海分公司",
              name: "万达上海分公司",
              list: [
                { name: "万达", id: "万达一号" },
                { name: "万达", id: "万达一号" }
              ]
            },
            {
              id: "万达天津分公司",
              name: "万达天津分公司",
              list: [
                { name: "万达", id: "万达一号" },
                { name: "万达", id: "万达一号" }
              ]
            }
          ]
        }
      ]
    };
  },
  methods: {
    getBuildingList() {
      this.$axios
        .post(
          publicu + "unifier/FNCenterBuildingListService",
          qs.stringify({ jsonString: "{}" })
        )
        .then(res => {
          if (res.data && res.data.content) {
            // console.log(res.data.content);
            this.projectList = res.data.content;
          }
        })
        .catch(ex => {
          console.log(ex);
        });
    }
  },
  mounted() {
    // this.getBuildingList();
  },
  components: {
    totalPage1,
    totalPage2,
    totalPage3
  }
};
</script>

<style scoped>
.tabWrap {
  margin: 10px 15px;
  height: calc(100% - 20px);
}
</style>
