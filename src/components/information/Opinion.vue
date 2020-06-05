<template>
    <div>
        <!--面包屑导航-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>信息收集</el-breadcrumb-item>
            <el-breadcrumb-item>意见反馈</el-breadcrumb-item>
        </el-breadcrumb>
        <!--卡片视图区域-->
        <el-card class="box-card">
            <!--列表区域-->
            <el-table :data="opinionList" border stripe>
                <el-table-column type="index" label="#"/>
                <el-table-column label="意见编号" prop="id"/>
                <el-table-column label="意见内容" prop="text"/>

                <el-table-column label="操作" width="120px">
                    <template slot-scope="scope">
                        <el-tooltip effect="dark" content="查看详情" placement="top" :enterable="false">
                            <el-button @click="viewOpinion(scope.row)" type="warning" icon="el-icon-notebook-2"
                                       size="mini"/>
                        </el-tooltip>
                        <el-tooltip effect="dark" content="删除" placement="top" :enterable="false">
                            <el-button @click="deleteOpinion(scope.row)" type="danger" icon="el-icon-delete"
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
                title="查看用户意见反馈"
                :visible.sync="viewDialogVisible"
                width="65%">
            <!--主体内容区域-->
            <el-form :model="opinion" label-width="150px">
                <el-form-item label="用户编号：">{{opinion.user.id}}</el-form-item>
                <el-form-item label="用户头像：">
                    <el-image :src="opinion.user.avatarUrl"/>
                </el-form-item>
                <el-form-item label="用户昵称：">{{opinion.user.nickName}}</el-form-item>
                <el-form-item label="用户意见：">{{opinion.text}}</el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="viewDialogVisible=false">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "Opinion",

        data() {
            return {
                //请求后台的参数
                queryInfo: {
                    page: 1,
                    size: 10,
                },
                opinion: {
                    user: {
                        id: null,
                        avatarUrl: null,
                        nickName: null,
                    }
                },
                opinionList: [],
                total: 0,
                // 控制对话框打开关闭
                viewDialogVisible: false
            }
        },
        created() {
            this.getOpinionList();
        },
        methods: {
            async getOpinionList() {
                const result = await this.$http.get("http://localhost:8085/wx-opinions/allOpinions", {params: this.queryInfo});
                console.log(result);
                if (result.status !== 200) {
                    return this.$message.error("获取意见列表失败")
                }
                this.opinionList = result.data.content;
                this.total = result.data.totalElements;
            },

            async viewOpinion(row) {
                this.viewDialogVisible = true;
                const result = await this.$http.get("http://localhost:8085/wx-opinions/queryOpinion", {params: {id: row.id}});
                console.log(result);
                if (result.status !== 200) {
                    return this.$message.error("获取意见信息失败")
                }
                this.opinion = result.data;
            },
            async deleteOpinion(row) {
                // 弹框再次确认
                const result = await this.$confirm('是否确认删除此意见？', '提示', {
                        confirmButtonText: '确认',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }
                ).catch(error => {
                    return error;
                });

                if (result !== 'confirm')
                    return this.$message.info("取消删除");
                const {data} = await this.$http.get("http://localhost:8085/wx-opinions/deleteOpinion", {params: {id: row.id}});
                if (data === true) {
                    await this.getOpinionList();
                    return this.$message.success("删除成功");
                }
                return this.$message.error("删除失败");
            },

            // 监听pagesize每页显示的条数改变事件
            handleSizeChange(newSize) {
                this.queryInfo.size = newSize;
                this.getOpinionList();
            },
            // 监听页码值改变事件
            handleCurrentChange(newPage) {
                this.queryInfo.page = newPage;
                this.getOpinionList();
            },

        }
    }
</script>

<style scoped>

</style>