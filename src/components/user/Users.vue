<template>
    <div>
        <!--面包屑导航-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>活动管理</el-breadcrumb-item>
            <el-breadcrumb-item>活动列表</el-breadcrumb-item>
            <el-breadcrumb-item>活动详情</el-breadcrumb-item>
        </el-breadcrumb>
        <!--卡片视图区域-->
        <el-card class="box-card">
            <el-row :gutter="20">
                <!--搜索区域-->
                <el-col :span="7">
                    <el-input placeholder="请输入内容">
                        <el-button slot="append" icon="el-icon-search"></el-button>
                    </el-input>
                </el-col>
                <!--按钮区域-->
                <el-col :span="4">
                    <el-button type="primary">添加用户</el-button>
                </el-col>
            </el-row>
            <!--列表区域-->
            <el-table :data="userList" border stripe>
                <el-table-column type="index" label="#"/>
                <el-table-column label="姓名" prop="name"/>
                <el-table-column label="昵称" prop="nickName"/>
                <el-table-column label="地址" prop="address"/>
                <el-table-column label="手机号" prop="telephone"/>
                <el-table-column label="状态" width="90px">
                    <template slot-scope="scope">
                        <el-switch v-model="scope.row.status" @change="userStateChanged(scope.row)"/>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="200px">
                    <template slot-scope="scope">
                        <el-tooltip effect="dark" content="编辑" placement="top" :enterable="false">
                            <el-button type="primary" icon="el-icon-edit" size="mini"/>
                        </el-tooltip>
                        <el-tooltip effect="dark" content="删除" placement="top" :enterable="false">
                            <el-button type="danger" icon="el-icon-delete" size="mini"/>
                        </el-tooltip>
                        <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
                            <el-button type="warning" icon="el-icon-setting" size="mini"/>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
            <!--分页区域-->
            <el-pagination @size-change="handleSizeChange"
                           @current_change="handleCurrentChange"
                           :current-page="queryInfo.pagenum"
                           :page-sizes="[1,2,5,10]"
                           :page-size="queryInfo.pagesize"
                           layout="total,sizes,prev,pager,next,jumper"
                           :total="total"/>
        </el-card>
    </div>
</template>

<script>
    export default {
        name: "Users",
        data() {
            return {
                //请求后台的参数
                queryInfo: {
                    query: '',
                    pagenum: 1,
                    pagesize: 2
                },
                userList: [],
                total: 0,
            }
        },
        created() {
            this.getUserList();
        },
        methods: {
            async getUserList() {
                const result = await this.$http.get("http://127.0.0.1:8083/user/allUser", {params: this.queryInfo});
                console.log(result);
                if (result.status !== 200) {
                    return this.$message.error("获取用户列表失败")
                }
                this.userList = result.data.users;
                this.total = result.data.total;
            },
            // 监听pagesize每页显示的条数改变事件
            handleSizeChange(newSize) {
                this.queryInfo.pagesize = newSize;
                this.getUserList();
            },
            // 监听页码值改变事件
            handleCurrentChange(newPage) {
                this.queryInfo.pagenum = newPage;
                this.getUserList();

            },
            // 监听状态开关的改变
            async userStateChanged(userinfo) {
                console.log(userinfo);
                //todo 调用接口改变状态
                // const result = await this.$http.put("url地址 userinfo.status")
                // if (result.status !== 200) {
                //     userinfo.status = !userinfo.status;
                //     return this.$message.error("更新用户状态失败")
                // }


            }
        }


    }
</script>

<style lang="less" scoped>


</style>