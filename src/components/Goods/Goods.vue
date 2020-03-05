<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>活动管理</el-breadcrumb-item>
            <el-breadcrumb-item>活动列表</el-breadcrumb-item>
            <el-breadcrumb-item>活动详情</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card class="box-card">
           <el-row :gutter="20">
               <el-col :span="7">
                   <el-input placeholder="请输入内容">
                       <el-button slot="append" icon="el-icon-search"></el-button>
                   </el-input>
               </el-col>
               <el-col :span="4">
                   <el-button type="primary">查找</el-button>
               </el-col>
           </el-row>
        </el-card>
    </div>
</template>

<script>
    export default {
        name: "Goods"
    }
</script>

<style lang="less" scoped>

</style>