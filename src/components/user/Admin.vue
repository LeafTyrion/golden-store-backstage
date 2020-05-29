<template>
    <div>
        <!--面包屑导航-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>管理员管理</el-breadcrumb-item>
        </el-breadcrumb>
        <!--卡片视图区域-->
        <el-card class="box-card">
            <el-row :gutter="20">
                <!--搜索区域-->
                <el-col :span="7">
                    <el-input placeholder="请输入内容" v-model="queryInfo.query">
                        <el-button slot="append" icon="el-icon-search" @click="getAdminList"></el-button>
                    </el-input>
                </el-col>
                <!--按钮区域-->
                <el-col :span="4">
                    <el-button type="primary" @click="addDialogVisible=true">添加管理员</el-button>
                </el-col>
            </el-row>
            <!--列表区域-->
            <el-table :data="adminList" border stripe>
                <el-table-column type="index" label="#"/>
                <el-table-column label="姓名" prop="name"/>
                <el-table-column label="用户名" prop="username"/>
                <el-table-column label="密码" prop="password"/>
                <!--操作区域-->
                <el-table-column label="操作" width="200px">
                    <template slot-scope="scope">
                        <el-tooltip effect="dark" content="删除" placement="top" :enterable="false">
                            <el-button @click="removeAdminById(scope.row)" type="danger" icon="el-icon-delete"
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
        <!--添加用户对话框-->
        <el-dialog
                title="添加管理员"
                :visible.sync="addDialogVisible"
                width="50%">
            <!--主体内容区域-->
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="90px">
                <el-form-item label="姓名" prop="name">
                    <el-input v-model="addForm.name"></el-input>
                </el-form-item>
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="addForm.username"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input type="password" v-model="addForm.password"></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="confirmPwd">
                    <el-input type="password" v-model="addForm.confirmPwd"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogClosed">取 消</el-button>
                <el-button type="primary" @click="addAdmin">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "Admin",
        data() {
            //校验规则 手机号、密码、确认密码
            const checkMobile = (rule, value, callback) => {
                const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
                if (regMobile.test(value)) {
                    //合法的手机号码
                    return callback()
                }
                callback(new Error('手机号码格式不正确'))
            };
            const checkPwd2 = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入密码'));
                } else if (value !== this.addForm.password) {
                    callback(new Error('两次输入密码不一致'));
                } else {
                    callback();
                }
            };
            return {
                //请求后台的参数
                queryInfo: {
                    page: 1,
                    size: 10,
                    query: '',
                },
                adminList: [],
                total: 0,
                // 控制对话框打开关闭
                addDialogVisible: false,
                // 表单数据
                addForm: {
                    name: '',
                    username: '',
                    password: '',
                    confirmPwd: '',
                },
                // 表单数据验证规则
                addFormRules: {
                    name: [
                        {required: true, message: '请输入管理员姓名', trigger: 'blur'},
                        {min: 2, max: 10, message: '用户名长度在2-10个字符之间', trigger: 'blur'}
                    ],
                    username: [
                        {required: true, message: '请输入用户名', trigger: 'blur'},
                        {min: 3, max: 10, message: '用户名长度在3-10个字符之间', trigger: 'blur'}
                    ],
                    password: [
                        {required: true, min: 6, max: 15, message: '密码长度在6-15个字符之间', trigger: 'blur'},
                    ],
                    confirmPwd: [
                        {required: true, message: '请再次输入密码'},
                        {validator: checkPwd2, trigger: 'blur'},
                    ],
                    telephone: [
                        {required: true, message: '请输入管理员手机号'},
                        {validator: checkMobile, trigger: 'blur'},
                    ],
                },


            };

        },
        created() {
            this.getAdminList();
        },
        methods: {
            async getAdminList() {
                const result = await this.$http.get("http://127.0.0.1:8081/admin/allAdmin", {params: this.queryInfo});
                console.log(result);
                if (result.status !== 200) {
                    return this.$message.error("获取用户列表失败")
                }
                this.adminList = result.data.content;
                this.total = result.data.totalElements;
            },
            // 监听pagesize每页显示的条数改变事件
            handleSizeChange(newSize) {
                console.log(newSize);
                this.queryInfo.size = newSize;
                this.getAdminList();
            },
            // 监听页码值改变事件
            handleCurrentChange(newPage) {
                console.log(newPage);
                this.queryInfo.page = newPage;
                this.getAdminList();

            },

            //对话框点击取消
            addDialogClosed() {
                // 重置内容
                this.$refs.addFormRef.resetFields();

                this.addDialogVisible = false;
            },
            //对话框点击确定
            addAdmin() {
                // 表单预校验
                this.$refs.addFormRef.validate(async valid => {
                    if (!valid) return;

                    const result = await this.$http.post("http://127.0.0.1:8081/admin/addAdmin", this.addForm);
                    console.log(result);
                    if (result.status !== 200) {
                        this.$message.error("添加用户失败");
                        return;
                    }
                    this.$message.success("添加用户成功");
                    this.$refs.addFormRef.resetFields();
                    this.addDialogVisible = false;
                    await this.getAdminList();
                });


            },

            // 添加删除操作
            async removeAdminById(row) {
                // 弹框再次确认
                const result = await this.$confirm('是否确认删除此管理员？', '提示', {
                        confirmButtonText: '确认',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }
                ).catch(error => {
                    return error;
                });
                if (result !== 'confirm')
                    return this.$message.info("取消删除");
                const {data} = await this.$http.get("http://127.0.0.1:8081/admin/deleteAdmin", {params: {id: row.id}});
                if (data === true) {
                    await this.getAdminList();
                    return this.$message.success("删除成功");
                }
                return this.$message.error("删除失败");
            }
        }


    }
</script>

<style lang="less" scoped>


</style>