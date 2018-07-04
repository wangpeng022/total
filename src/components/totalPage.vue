<template>
  <div class="content">
    <!-- <Layout>
        <Header>
            <div class="title">汇总信息</div>
            <div class="rButton">
                <Button>退出登录</Button>
            </div>
        </Header>
        <Content :style="{padding: '0 50px'}">
            <Card>
                <div style="min-height: 600px;">
                    Content
                </div>
            </Card>
        </Content>
        <Footer class="layout-footer-center"></Footer>
    </Layout> -->
    <Row>
      <Col span="5">
      <DatePicker type="daterange" v-model="timeList" split-panels placeholder="请选择日期"
                  style="width: 200px"></DatePicker>
      </Col>
      <Col span="4">
      <Select v-model="projectName" style="width: 150px" placeholder="请选择项目类型">
        <Option v-for="item in projectList" :value="item.buildingName" :key="item.buildingId">
        </Option>
      </Select>
      </Col>

      <Col span="4">
      <Select v-model="engeryType" style="width: 150px" placeholder="请选择能源类型">
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
    <Row>
      <Col span="2">
      汇总：</Col>
      <Col span="4" v-text="sumMoney+'元'"></Col>
    </Row>
    <br/>
    <Table ref="table" :height="tabHeight" :columns="columns1" :data="data1"></Table>
  </div>
</template>
<script>
  import axios from 'axios'
  import qs from 'qs'
  import dayjs from 'dayjs'

  export default {
    data() {
      return {
        columns1: [
          {
            title: '项目名称',
            key: 'buildingName'
          },
          {
            title: '微信帐号',
            key: 'WXId'
          },
          {
            title: '租户全码',
            key: 'tenantFlag'
          },
          {
            title: '能耗类型',
            key: 'energyTypeId'
          },
          {
            title: '租户名称',
            key: 'tenantName'
          },
          {
            title: '仪表编码',
            key: 'meterId'
          },
          {
            title: '充值金额',
            key: 'payMoney'
          },
          {
            title: '账单生成时间',
            key: 'orderTime'
          },
          {
            title: '微信支付时间',
            key: 'wxPayTime'
          },
          {
            title: '系统更新状态时间',
            key: 'systemStatusTime'
          },
        ],
        data1: [],
        projectName: '',
        engeryType: '',
        sumMoney: 0,
        projectList: [],
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
        tabHeight: 500,
        timeList: [],
        fileID: ''
      }
    },
    methods: {
      printSome(){
        // this.$refs.table.$el.style.height='auto';
        // this.$refs.table.$el.getElementsByClassName('ivu-table-body')[0].style.height='auto';
        let inner=this.$refs.table.$el.innerHTML
        let link='https://unpkg.com/iview@2.14.3/dist/styles/iview.css'
        let htmlText = `<!DOCTYPE html><html><head><meta charset="UTF-8"><link href="${link}" rel="stylesheet"><style type="text/css">.ivu-table-header table,.ivu-table-body table{width:100%!important;}.ivu-table-overflowY{overflow:hidden!important;}.ivu-table-wrapper{border:1px solid #dddee1!important}</style></head><body><div class="ivu-table-wrapper">${inner}</div></body></html>`;

        const f=document.getElementById('printf')
        f.contentDocument.write(htmlText);
        console.log(window.frames['printf'].document.getElementsByClassName('ivu-table-body')[0].style.height);

        window.frames['printf'].document.getElementsByClassName('ivu-table-body')[0].style.height='auto';
        f.contentDocument.close();
        setTimeout(() => {
        f.contentWindow.print();
        }, 1000);
      },
      downLoad() {
        const param = this.getQuery(1);
        this.getList(param).then((res) => {
          if (res.data && res.data.content) {
            this.fileID = res.data.content[0].id;
            console.log(res.data.content[0].id)
            return res.data.content[0].id
          }
        }).then((id) => {
          this.downFile(id)
        }).catch((ex) => {
          console.log(ex)
        });
      },
      queryList() {
        const param = this.getQuery();
        this.getList(param).then((res) => {
          if (res.data && res.data.content) {
            const buildingName = res.data.content[0].buildingName;
            let temp = res.data.content[0].orderList.map((item) => {
              return Object.assign({buildingName}, item)
            });
            this.data1 = temp;
            this.sumMoney = res.data.content[0].sumMoney;
            temp = null;
          }
        }).catch((ex) => {
          console.log(ex)
        });
      },
      getQuery(isDownload = 0) {
        if (!this.projectName || !this.engeryType || !this.timeList[0]) {
          return this.$Message.warning('选择条件');
        }
        const buildingId = this.projectList.filter(item => item['buildingName'] == this.projectName)[0].buildingId;
        const energyTypeId = this.engeryTypeList.filter(item => item['name'] == this.engeryType)[0].value;
        const param = {
          buildingId,
          energyTypeId,
          timeFrom: dayjs(this.timeList[0]).format('YYYY-MM-DD HH:mm:ss'),
          timeTo: dayjs(this.timeList[1]).format('YYYY-MM-DD HH:mm:ss'),
          isDownload: isDownload
        };
        return param;
      },
      getData() {
        this.$axios.post("/api/FNCentreBuildingListService", qs.stringify({"jsonString": '{}'})).then((res) => {
          if (res.data && res.data.content) {
            this.projectList = res.data.content;
          }
        }).catch((ex) => {
          console.log(ex)
        })
      },
      getList(param) {
        return this.$axios.post("/api/FNCentreGridService", qs.stringify({"jsonString": JSON.stringify(param)}))
      },
      downFile(param = "2bee9cd6-93f2-4b37-a8b4-10102c5a1a9e") {
        this.$axios({
          method: 'post',
          url: '/down/download',
          data: qs.stringify({"resource": param}),
          responseType: 'blob'
        }).then((res) => {
          const filename=decodeURI(res.headers['content-disposition'].split(';').filter((item)=>item.indexOf('filename')>0)[0].split('=')[1].replace(/\"/g,''));
          const blob = new Blob([res.data], { type: "application/vnd.ms-excel" })
          if ('download' in document.createElement('a')) { // 非IE下载
            const elink = document.createElement('a')
            elink.download = filename
            elink.style.display = 'none'
            elink.href = URL.createObjectURL(blob)
            document.body.appendChild(elink)
            elink.click()
            URL.revokeObjectURL(elink.href) // 释放URL 对象
            document.body.removeChild(elink)
          } else { // IE10+下载
            navigator.msSaveBlob(blob, filename)
          }
        }).catch((ex) => {
          console.log(ex)
        })
      }
    },
    mounted() {
      this.getData();
      this.tabHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 20
    }
  }
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
    float: right;;
  }
</style>
