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
                <DatePicker type="daterange" split-panels placeholder="请选择日期" style="width: 200px"></DatePicker>
            </Col>
            <Col span="4">
                <Select v-model="projectName" style="width: 150px" placeholder="请选择项目类型">
                    <Option v-for="item in projectList" :value="item.value" :key="item.value"></Option>
                </Select>
            </Col>

            <Col span="4">
                <Select v-model="engeryType" style="width: 150px" placeholder="请选择能源类型">
                    <Option v-for="item in engeryTypeList" :value="item.value" :key="item.value"></Option>
                </Select>
            </Col>
            <Col span="4">
                <Button>下载</Button>
                <Button>打印</Button>
            </Col>
        </Row>
        <br/>
        <Row>
            <Col span="2">汇总：</Col>
            <Col span="2">333.22元</Col>
        </Row>
        <br/>
        <Table :columns="columns1" :data="data1"></Table>
    </div>
</template>
<script>
import axios from 'axios'
    export default {
        data () {
            return {
                columns1:[
                    {
                        title: '项目名称',
                        key: 'name'
                    },
                    {
                        title: '微信帐号',
                        key: 'wName'
                    },
                    {
                        title: '租户全码',
                        key: 'fullCode'
                    },
                    {
                        title: '能耗类型',
                        key: 'engyType'
                    },
                    {
                        title: '租户名称',
                        key: 'userName'
                    },
                    {
                        title: '仪表编码',
                        key: 'meterCode'
                    },
                    {
                        title: '充值金额',
                        key: 'value'
                    },
                ],
                data1:[
                    {
                        name: '万达',
                        wName: 'wx22881700',
                        fullCode: 'xxxeeeffffedddgg',
                        engyType: 'Dian',
                        userName: 'nike',
                        meterCode: 'nike',
                        value: '230'
                    },
                    {
                        name: '万达',
                        wName: 'wx22881700',
                        fullCode: 'xxxeeeffffedddgg',
                        engyType: 'Dian',
                        userName: 'nike',
                        meterCode: 'nike',
                        value: '230'
                    },
                    {
                        name: '万达',
                        wName: 'wx22881700',
                        fullCode: 'xxxeeeffffedddgg',
                        engyType: 'Dian',
                        userName: 'nike',
                        meterCode: 'nike',
                        value: '230'
                    },
                    {
                        name: '万达',
                        wName: 'wx22881700',
                        fullCode: 'xxxeeeffffedddgg',
                        engyType: 'Dian',
                        userName: 'nike',
                        meterCode: 'nike',
                        value: '230'
                    },
                ],
                projectName: '',
                engeryType: '',
                projectList: [
                    {
                       value: "soho1",
                       name: "soho1"
                    },
                    {
                       value: "soho2",
                       name: "soho2"
                    }
                ],
                engeryTypeList: [
                    {
                       value: "soho3",
                       name: "soho3"
                    },
                    {
                       value: "soho4",
                       name: "soho4"
                    }
                ]
            }
        },
        methods:{
            getData(){
                this.$axios.post("https://wx.persagy.com/EMS_Finein_WX/Spring/MVC/entrance/unifier/FNCentreBuildingListService",{
                    data:{
                        "jsonString":'{}'
                    }
                }).then((res)=>{
                    console.log(res);

                })
            }
        },
        mounted () {
            this.getData();
        }

    }
</script>
<style scoped>
    .content{
        margin: 18px;
    }
    .title{
        display: inline-block;
        color: white;
    }
    .tButton{
        display: inline-block;
        float: right;;
    }
</style>