<template>
    <div>
        <!--面包屑导航-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>客户管理</el-breadcrumb-item>
        </el-breadcrumb>
        <!--卡片视图区域-->
        <el-card class="box-card">
            <el-row :gutter="20">
                <!--搜索区域-->
                <el-col :span="7">
                    <el-input placeholder="请输入内容" v-model="queryInfo.query">
                        <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
                    </el-input>
                </el-col>
            </el-row>
            <!--列表区域-->
            <el-table :data="userList" border stripe>
                <el-table-column type="index" label="#"/>
                <el-table-column label="openID" prop="openId" width="230px"/>
                <el-table-column label="头像" width="80px">
                    <template slot-scope="scope">
                        <el-image :src="scope.row.avatarUrl"/>
                    </template>
                </el-table-column>
                <el-table-column label="昵称" prop="nickName" width="100px"/>
                <el-table-column label="操作" width="120px">
                    <template slot-scope="scope">
                        <el-tooltip effect="dark" content="查看详情" placement="top" :enterable="false">
                            <el-button @click="viewUser(scope.row)" type="warning" icon="el-icon-notebook-2"
                                       size="mini"/>
                        </el-tooltip>
                        <el-tooltip effect="dark" content="删除" placement="top" :enterable="false">
                            <el-button @click="deleteUser(scope.row)" type="danger" icon="el-icon-delete"
                                       size="mini"/>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
            <!--分页区域-->
            <el-pagination @size-change="handleSizeChange"
                           @current-change="handleCurrentChange"
                           :current-page="queryInfo.pagenum"
                           :page-sizes="[5,10,15,20]"
                           :page-size="queryInfo.pagesize"
                           layout="total,sizes,prev,pager,next,jumper"
                           :total="total"/>
        </el-card>

        <!--查看用户信息对话框-->
        <el-dialog
                title="查看用户详细信息"
                :visible.sync="viewDialogVisible"
                width="65%">
            <!--主体内容区域-->
            <el-form :model="user" label-width="150px">
                <el-form-item label="用户编号：">{{user.id}}</el-form-item>
                <el-form-item label="用户头像：">
                    <el-image :src="user.avatarUrl"/>
                </el-form-item>
                <el-table :data="user.addressVOList">
                    <el-table-column property="id" label="编号" width="50"/>
                    <el-table-column property="userName" label="收货人" width="70"/>
                    <el-table-column property="telNumber" label="联系方式" width="120"/>
                    <el-table-column property="provinceName" label="省份" width="70"/>
                    <el-table-column property="cityName" label="城市" width="70"/>
                    <el-table-column property="countyName" label="区/县" width="70"/>
                    <el-table-column property="detailInfo" label="详细地址" width="120"/>
                    <el-table-column property="postalCode" label="邮政编码" width="80"/>
                    <el-table-column property="nationalCode" label="地区编码" width="80"/>
                </el-table>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="viewDialogVisible=false">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "Users",
        data() {
            return {
                //请求后台的参数
                queryInfo: {
                    page: 1,
                    size: 10,
                    query: '',
                },
                user:{},
                userList: [],
                addressList:[],
                total: 0,
                // 控制对话框打开关闭
                viewDialogVisible: false
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
                this.userList = result.data.content;
                this.total = result.data.totalElements;
            },

            async viewUser(row){
                this.viewDialogVisible=true;
                const result = await this.$http.get("http://127.0.0.1:8083/user/getUser", {params: {id:row.id}});
                console.log(result);
                if (result.status !== 200) {
                    return this.$message.error("获取用户信息失败")
                }
                this.user=result.data;
            },
            async deleteUser(row){
                // 弹框再次确认
                const result = await this.$confirm('是否确认删除此用户？', '提示', {
                        confirmButtonText: '确认',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }
                ).catch(error => {
                    return error;
                });

                if (result !== 'confirm')
                    return this.$message.info("取消删除");
                const {data} = await this.$http.get("http://127.0.0.1:8083/user/deleteUser", {params: {id: row.id}});
                if (data === true) {
                    await this.getUserList();
                    return this.$message.success("删除成功");
                }
                return this.$message.error("删除失败");
            },

            // 监听pagesize每页显示的条数改变事件
            handleSizeChange(newSize) {
                this.queryInfo.size = newSize;
                this.getUserList();
            },
            // 监听页码值改变事件
            handleCurrentChange(newPage) {
                this.queryInfo.page = newPage;
                this.getUserList();
            },

        }


    }
</script>

<style lang="less" scoped>
    .el-image {
        border-radius: 10px;
        width: 60px;
        height: 60px;
    }

</style>