<template>
    <div class="login_container">
        <div class="login_box">
            <div class="avatar_box">
                <img src="../assets/logo.png" alt="../assets/logo.png">
            </div>
            <!--ref指定实例-->
            <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" label-width="0px" class="login_form">
                <!--用户名-->
                <el-form-item prop="username">
                    <el-input v-model="loginForm.username" prefix-icon="el-icon-user"/>
                </el-form-item>
                <!--密码-->
                <el-form-item prop="password">
                    <el-input type="password" v-model="loginForm.password" prefix-icon="el-icon-lock"/>
                </el-form-item>
                <!--按钮-->
                <el-form-item class="buttons">
                    <el-button type="primary" @click="login">登录</el-button>
                    <!--绑定重置事件-->
                    <el-button type="info" @click="resetLoginForm">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Login",
        data() {
            return {
                // 用户名密码双向数据绑定
                loginForm: {
                    username: '920201895',
                    password: '1234567890',
                },
                loginFormRules: {
                    username: [
                        {required: true, message: '请输入用户名', trigger: 'blur'},
                        {min: 5, max: 10, message: '长度在 5 到 10 个字符', trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: '请输入密码', trigger: 'blur'},
                        {min: 10, max: 15, message: '长度在 10 到 15 个字符', trigger: 'blur'}
                    ]
                }
            }
        },
        methods: {
            // 表单验证
            resetLoginForm() {
                this.$refs.loginFormRef.resetFields();
            },
            // 表单预验证
            login() {
                this.$refs.loginFormRef.validate(async valid => {
                    if (!valid) return;

                    try {
                        const result = await this.$http.post("http://127.0.0.1:8081/admin/login", this.loginForm);
                        console.log(result);
                        const data = result.data;
                        if (data.success !== true) return this.$message.error("用户名或密码错误");
                        if (data.success === true) {
                            this.$message.success("登录成功");
                            //todo 将token登录信息存入session
                            window.sessionStorage.setItem("token", data.token);
                            // 跳转页面
                            await this.$router.push('/home')
                        }
                    } catch (e) {
                        console.log(e);
                        this.$message.error("服务暂不可用，请稍后再试")
                    }


                })
            }
        }
    }
</script>

<style lang="less" scoped>

    .login_container {
        background-color: #409EFF;
        height: 100%;
    }

    .login_box {
        width: 450px;
        height: 300px;
        background-color: #ffffff;
        border-radius: 3px;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
    }

    .avatar_box {
        height: 130px;
        width: 130px;
        border: 1px solid #eeeeee;
        border-radius: 50%;
        padding: 10px;
        box-shadow: 0 0 10px #dddddd;
        position: absolute;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: #ffffff;

        img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            background-color: #eeeeee;
        }
    }

    .buttons {
        display: flex;
        justify-content: flex-end;
    }

    .login_form {
        position: absolute;
        bottom: 0;
        width: 100%;
        padding: 0 20px;
        box-sizing: border-box;
    }

</style>
