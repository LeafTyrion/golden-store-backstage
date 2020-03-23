<template>
    <div>
        <!--面包屑导航-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>分类管理</el-breadcrumb-item>
        </el-breadcrumb>
        <!--卡片视图区域-->
        <el-card class="box-card">
            <el-row :gutter="20">
                <!--搜索区域-->
                <el-col :span="7">
                    <el-input placeholder="请输入内容" v-model="queryInfo.query">
                        <el-button slot="append" icon="el-icon-search" @click="getTypeList"></el-button>
                    </el-input>
                </el-col>
                <!--按钮区域-->
                <el-col :span="4">
                    <el-button type="primary" @click="addDialogVisible=true">添加商品类型</el-button>
                </el-col>
            </el-row>
            <!--列表区域-->
            <el-table :data="typeList" border stripe>
                <el-table-column type="index" label="#"/>
                <el-table-column label="类型编号" prop="id"/>
                <el-table-column label="类型名称" prop="name"/>
                <!--操作区域-->
                <el-table-column label="操作" width="200px">
                    <template slot-scope="scope">
                        <el-tooltip effect="dark" content="查看详情" placement="top" :enterable="false">
                            <el-button @click="getTypeById(scope.row)" type="warning" icon="el-icon-notebook-2"
                                       size="mini"/>
                        </el-tooltip>
                        <el-tooltip effect="dark" content="编辑" placement="top" :enterable="false">
                            <el-button @click="editType(scope.row)" type="primary" icon="el-icon-edit"
                                       size="mini"/>
                        </el-tooltip>
                        <el-tooltip effect="dark" content="删除" placement="top" :enterable="false">
                            <el-button @click="deleteType(scope.row)" type="danger" icon="el-icon-delete"
                                       size="mini"/>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
            <!--分页区域-->
            <el-pagination @size-change="handleSizeChange"
                           @current-change="handleCurrentChange"
                           :current-page="queryInfo.page"
                           :page-sizes="[5,10,15,20]"
                           :page-size="queryInfo.size"
                           layout="total,sizes,prev,pager,next,jumper"
                           :total="total"/>
        </el-card>
        <!--添加商品类型对话框-->
        <el-dialog
                title="添加商品类型"
                :visible.sync="addDialogVisible"
                width="50%">
            <!--主体内容区域-->
            <el-form :model="typeForm" :rules="typeFormRules" ref="addFormRef" label-width="90px">
                <el-form-item label="类型名称" prop="name">
                    <el-input v-model="typeForm.name"/>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogClosed">取 消</el-button>
                <el-button type="primary" @click="addCategory">确 定</el-button>
            </span>
        </el-dialog>
        <!--编辑商品类型对话框-->
        <el-dialog
                title="编辑商品类型"
                :visible.sync="editDialogVisible"
                width="50%">
            <!--主体内容区域-->
            <el-form :model="typeForm" :rules="typeFormRules" ref="editFormRef" label-width="90px">
                <el-form-item label="类型名称" prop="name">
                    <el-input v-model="typeForm.name"/>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogClosed">取 消</el-button>
                <el-button type="primary" @click="updateCategory">确 定</el-button>
            </span>
        </el-dialog>
        <!--查看商品详细信息对话框-->
        <el-dialog
                title="查看商品类型"
                :visible.sync="viewDialogVisible"
                width="50%">
            <!--主体内容区域-->
            <el-form :model="typeForm" :rules="typeFormRules" ref="addFormRef" label-width="90px">
                <el-form-item label="类型名称" prop="name">
                    <el-input v-model="typeForm.name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="viewDialogVisible=false">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "Category",
        data() {
            return {
                // 分页查询参数
                queryInfo: {
                    page: 1,
                    size: 10,
                    query: '',
                },
                total: 0,
                typeList: [],

                // 查询内容
                queryString: '',

                // 控制对话框打开关闭
                addDialogVisible: false,
                editDialogVisible: false,
                viewDialogVisible: false,
                // 表单数据
                typeForm: {
                    id: null,
                    name: '',
                },
                // 表单数据验证规则
                typeFormRules: {
                    name: [
                        {required: true, message: '请输入商品类别', trigger: 'blur'},
                        {min: 2, max: 10, message: '商品类别长度在2-10个字符之间', trigger: 'blur'}
                    ],
                },

            };
        },
        created() {
            this.getTypeList();
        },
        methods: {
            // 监听pagesize每页显示的条数改变事件
            handleSizeChange(newSize) {
                this.queryInfo.size = newSize;
                this.getTypeList();
            },
            // 监听页码值改变事件
            handleCurrentChange(newPage) {
                this.queryInfo.page = newPage;
                this.getTypeList();

            },
            //对话框点击取消
            addDialogClosed() {
                // 重置内容
                this.$refs.addFormRef.resetFields();
                this.addDialogVisible = false;
            },
            editDialogClosed() {
                this.typeForm.name = "";
                this.editDialogVisible = false;
            },
            // 编辑对话框
            editType(row) {
                console.log(row);
                this.editDialogVisible = true;
                this.typeForm.name = row.name;
                this.typeForm.id = row.id;
            },
            //对话框点击确定添加
            addCategory() {
                // 表单预校验
                this.$refs.addFormRef.validate(async valid => {
                    if (!valid) return;

                    const result = await this.$http.post("http://127.0.0.1:8084/type/addType", this.typeForm);
                    console.log(result);
                    if (result.status !== 200)
                        return this.$message.error("添加类型失败");
                    this.$message.success("添加类型成功");
                    this.$refs.addFormRef.resetFields();
                    this.addDialogVisible = false;
                    this.getTypeList();
                });
            },
            //对话框点击确定修改
            updateCategory() {
                // 表单预校验
                this.$refs.editFormRef.validate(async valid => {
                    if (!valid) return;

                    const result = await this.$http.post("http://127.0.0.1:8084/type/updateType", this.typeForm);
                    console.log(result);
                    if (result.status !== 200)
                        return this.$message.error("修改类型失败");
                    this.$message.success("修改类型成功");
                    this.$refs.editFormRef.resetFields();
                    this.typeForm.id = null;
                    this.typeForm.name = null;
                    this.editDialogVisible = false;
                    this.getTypeList();
                });
            },


            async getTypeList() {
                const result = await this.$http.get("http://127.0.0.1:8084/type/allType", {params: this.queryInfo});
                console.log(result);
                if (result.status !== 200) {
                    return this.$message.error("获取用户列表失败")
                }
                this.typeList = result.data.content;
                this.total = result.data.totalElements;
            },
            async getTypeById(row) {
                this.viewDialogVisible = true;
            },

            async deleteType(row) {
                // 弹框再次确认
                const result = await this.$confirm('是否确认删除此类型？', '提示',
                    {
                        confirmButtonText: '确认',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }
                ).catch(error => {
                    return error;
                });

                if (result !== 'confirm')
                    return this.$message.info("取消删除");
                const {data} = await this.$http.get("http://127.0.0.1:8084/type/deleteType", {params: {id: row.id}});
                if (data === true) {
                    this.getTypeList();
                    return this.$message.success("删除成功");
                }
                return this.$message.error("删除失败");

            }
        }
    }
</script>

<style scoped>

</style>