<template>
  <Menu :theme="theme3" active-name="1" class="menuWrap">
    <MenuGroup>
      <MenuItem name="1">
        <Icon type="md-document"/>
        租户充值记录查询报表
      </MenuItem>
      <MenuItem name="2">
        <Icon type="md-chatbubbles"/>
        租户退费记录查询报表
      </MenuItem>
      <MenuItem name="3">
        <Icon type="md-chatbubbles"/>
        租户财务对账分析报表
      </MenuItem>
    </MenuGroup>
  </Menu>
</template>

<script>
  export default {
    name: "menu",
    data() {
      return {
        theme3: 'dark'
      }
    }
  }
</script>

<style scoped>
.menuWrap{
  height:100%;
}
</style>
