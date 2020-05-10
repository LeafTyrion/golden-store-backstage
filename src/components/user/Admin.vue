<template>
    <div>
        <!--面包屑导航-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
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
                        <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
                    </el-input>
                </el-col>
                <!--按钮区域-->
                <el-col :span="4">
                    <el-button type="primary" @click="addDialogVisible=true">添加管理员</el-button>
                </el-col>
            </el-row>
            <!--列表区域-->
            <el-table :data="userList" border stripe>
                <el-table-column type="index" label="#"/>
                <el-table-column label="姓名" prop="name"/>
                <el-table-column label="昵称" prop="nickName"/>
                <el-table-column label="地址" prop="address"/>
                <el-table-column label="手机号" prop="telephone"/>
                <el-table-column label="状态" width="90px" prop="status">
                    <template slot-scope="scope">
                        <el-switch v-model="scope.row.status" @change="userStateChanged(scope.row)"/>
                    </template>
                </el-table-column>
                <!--操作区域-->
                <el-table-column label="操作" width="200px">
                    <template slot-scope="scope">
                        <el-tooltip effect="dark" content="编辑" placement="top" :enterable="false">
                            <el-button @click="showEditDialog(scope.row.name)" type="primary" icon="el-icon-edit"
                                       size="mini"/>
                        </el-tooltip>
                        <el-tooltip effect="dark" content="删除" placement="top" :enterable="false">
                            <el-button @click="removeAdminById(scope.row.name)" type="danger" icon="el-icon-delete"
                                       size="mini"/>
                        </el-tooltip>
                        <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
                            <el-button type="warning" icon="el-icon-setting" size="mini"/>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
            <!--分页区域-->
            <el-pagination @size-change="handleSizeChange"
                           @current-change="handleCurrentChange"
                           :current-page="queryInfo.pagenum"
                           :page-sizes="[1,2,5,10]"
                           :page-size="queryInfo.pagesize"
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
                <el-form-item label="手机号" prop="telephone">
                    <el-input v-model="addForm.telephone"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogClosed">取 消</el-button>
                <el-button type="primary" @click="addAdmin">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog
                title="修改管理员信息"
                :visible.sync="editDialogVisible"
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
                <el-form-item label="手机号" prop="telephone">
                    <el-input v-model="addForm.telephone"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogClosed">取 消</el-button>
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
                    query: '',
                    pagenum: 1,
                    pagesize: 2
                },
                userList: [],
                total: 0,
                // 控制对话框打开关闭
                addDialogVisible: false,
                editDialogVisible: false,
                // 表单数据
                addForm: {
                    name: '',
                    username: '',
                    password: '',
                    confirmPwd: '',
                    telephone: '',
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
            this.getUserList();
        },
        methods: {
            async getUserList() {
                const result = await this.$http.get("http://127.0.0.1:8083/user/allUser", {params: this.queryInfo});
                console.log(result);
                if (result.status !== 200) {
                    return this.$message.error("获取用户列表失败")
                }
                this.userList = result.data.userList;
                this.total = result.data.total;
            },
            // 监听pagesize每页显示的条数改变事件
            handleSizeChange(newSize) {
                console.log(newSize);
                this.queryInfo.pagesize = newSize;
                this.getUserList();
            },
            // 监听页码值改变事件
            handleCurrentChange(newPage) {
                console.log(newPage);
                this.queryInfo.pagenum = newPage;
                this.getUserList();

            },
            // 监听状态开关的改变
            async userStateChanged(userinfo) {
                console.log(userinfo);
                const id = 1;
                const result = await this.$http.get("http://127.0.0.1:8084/goods/updateIsSell",
                    {params: {id: id, isSell: userinfo.status}});
                console.log(result);
                //todo 调用接口改变状态
                // const result = await this.$http.put("url地址 userinfo.status")
                // if (result.status !== 200) {
                //     userinfo.status = !userinfo.status;
                //     return this.$message.error("更新用户状态失败")
                // }
            },
            //对话框点击取消
            dialogClosed() {
                // 重置内容
                this.$refs.addFormRef.resetFields();

                this.addDialogVisible = false;
            },
            //对话框点击确定
            addAdmin() {
                // 表单预校验
                this.$refs.addFormRef.validate(async valid => {
                    if (!valid) return;

                    const result = await this.$http.post("http://127.0.0.1:8083/user/addUser", this.addForm);
                    console.log(result);
                    if (result.data.message !== "success") {
                        this.$message.error("添加用户失败");
                        return;
                    }
                    this.$message.success("添加用户成功");
                    this.$refs.addFormRef.resetFields();
                    this.addDialogVisible = false;
                    this.getUserList();
                });


            },
            //todo 添加修改操作
            showEditDialog(username) {
                this.editDialogVisible = true;
                console.log(username)
            },
            //todo 添加删除操作
            async removeAdminById(name) {
                // 弹框再次确认
                const result = await this.$confirm('是否确认删除此管理员？', '提示',
                    {
                        confirmButtonText: '确认',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }
                ).catch(error => {
                    return error;
                });
                console.log(result)

                if (result === 'cancel') {
                    //取消删除
                } else {
                    // 确认删除，调用删除接口
                }
            }
        }


    }
</script>

<style lang="less" scoped>


</style>