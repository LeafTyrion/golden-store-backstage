<template>
    <div>
        <!--面包屑导航-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>信息收集</el-breadcrumb-item>
            <el-breadcrumb-item>数据统计</el-breadcrumb-item>
        </el-breadcrumb>
        <!--卡片视图区域-->
        <el-card class="box">
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span>最近24小时交易额</span>
                </div>
                <div class="big_content">￥ {{dataInfo.todayTrade}}</div>
            </el-card>

            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span>累计交易额</span>
                </div>
                <div class="big_content">￥ {{dataInfo.allTrade}}</div>
            </el-card>

            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span>最近24小时收益</span>
                </div>
                <div class="big_content">￥ {{dataInfo.todayReturn}}</div>
            </el-card>

            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span>累计收益</span>
                </div>
                <div class="big_content">￥ {{dataInfo.allReturn}}</div>
            </el-card>

            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span>最近24小时成交数量</span>
                </div>
                <div class="big_content">{{dataInfo.volumeToday}} 笔</div>
            </el-card>
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span>累计成交数量</span>
                </div>
                <div class="big_content">{{dataInfo.volume}} 笔</div>

            </el-card>
        </el-card>
    </div>
</template>

<script>


    export default {
        name: "Data",
        data() {
            return {
                dataInfo: {},

            }
        },
        created() {
            this.getDataInfo();
        },
        methods: {
            async getDataInfo() {
                const result = await this.$http.get("http://127.0.0.1:8085/data/allData");
                console.log(result);
                if (result.status !== 200) {
                    return this.$message.error("获取数据信息失败")
                }
                this.dataInfo = result.data;
            },
        }
    }
</script>

<style scoped>
    .big_content {
        font-size: 36px;
    }

    .box-card {
        display: inline-block;
        margin-bottom: 20px;
        width: 400px;
        margin-right: 20px;
    }

    .box {
        width: 885px;
    }
</style>