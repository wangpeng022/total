<template>
  <Tabs :animated="false" type="card" @on-click="selected" class="tabWrap">
    <TabPane v-for="item in tabCount" :label="item" :key="item">{{item}}</TabPane>

  </Tabs>
</template>

<script>
    export default {
        name: "tabs",
        data(){
          return {
            tabCount:['租户充值记录查询报表','租户退费记录查询报表','租户财务对账分析报表']
          }
        }
    }
</script>

<style scoped>
  .tabWrap{
    margin: 10px 15px;
    height: calc(100% - 20px);
  }
  .tabWrap .ivu-tabs-content{
    border:1px solid #dddee1;
  }
</style>
