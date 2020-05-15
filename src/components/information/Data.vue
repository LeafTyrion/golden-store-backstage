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
                    <span>今日交易额</span>
                </div>
                <div class="big_content">￥ 3450.00</div>
            </el-card>

            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span>累计交易额</span>
                </div>
                <div class="big_content">￥ 13450.00</div>
            </el-card>

            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span>今日收益</span>
                </div>
                <div class="big_content">￥ 1280.66</div>
            </el-card>

            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span>累计收益</span>
                </div>
                <div class="big_content">￥ 11280.66</div>
            </el-card>

            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span>今日成交数量</span>
                </div>
                <div class="big_content">66 笔</div>
            </el-card>
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span>累计成交数量</span>
                </div>
                <div class="big_content">666 笔</div>

            </el-card>
        </el-card>
    </div>
</template>

<script>
    export default {
        name: "Data"
    }
</script>

<style scoped>
    .big_content {
        font-size: 36px;
    }

    .text {
        font-size: 14px;
    }

    .item {
        margin-bottom: 18px;
    }

    .clearfix:before,
    .clearfix:after {
        display: table;
        content: "";
    }

    .clearfix:after {
        clear: both
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