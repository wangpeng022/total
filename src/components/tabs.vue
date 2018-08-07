<template>
  <Tabs :animated="false" type="card" class="tabWrap" ref="tabs">
    <TabPane v-for="item in tabCount" :label="item.name" :key="item.name">
      <component :is="item.componentId"></component>
    </TabPane>
  </Tabs>
</template>

<script>
  import totalPage1  from './totalPage'
  import totalPage2  from './totalPage2'
  import totalPage3  from './totalPage3'
    export default {
        name: "tabs",
        data(){
          return {
            tabCount:[
              {name:'租户充值记录查询报表',componentId:'totalPage1'},
              {name:'租户退费记录查询报表',componentId:'totalPage2'},
              {name:'租户财务对账分析报表',componentId:'totalPage3'}
            ]
          }
        },
      components:{
        totalPage1,
        totalPage2,
        totalPage3
      }
    }
</script>

<style scoped>
  .tabWrap{
    margin: 10px 15px;
    height: calc(100% - 20px);
  }
</style>
