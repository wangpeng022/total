<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  width: 100%;
  height: 100%;
  min-width: 1200px;
}
* {
    margin: 0;
    padding: 0;
}
body{
    /* user-select: none; */
    width: 100%;
    height: 100vh;
    overflow: hidden;
    font-size: 14px;
}

a {
    text-decoration: none;
}

ul li {
    list-style: none;
}
body ::-webkit-scrollbar { width: 10px; height: 10px; }
body ::-webkit-scrollbar-track { background-color: #fff; -webkit-border-radius: 8px; }
body ::-webkit-scrollbar-thumb { -webkit-border-radius: 5px; background: #e6e6e6; border: none; }
body ::-webkit-scrollbar-thumb:vertical:hover { background-color: #a6a6a6; border: none; }
body ::-webkit-scrollbar-thumb:hover { background-color: #a6a6a6; border: none; }
</style>
