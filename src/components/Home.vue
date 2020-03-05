<template>
    <el-container class="home-container">
        <!--头部区域-->
        <el-header>
            <div>
                <img src="../assets/logo.png" alt="../assets/logo.png">
                <span>电商后台管理系统</span>
            </div>
            <el-button type="info" @click="logout">退出</el-button>
        </el-header>
        <!--页面主体区域-->
        <el-container>
            <!--侧边栏-->
            <el-aside :width="isCollapse?'64px':'200px'">
                <!--菜单折叠展开按钮-->
                <div class="toggle-button" @click="toggleCollapse">|||</div>
                <!--侧边栏菜单,选中颜色，只能展开一个菜单设置,菜单折叠展开设置,折叠动画关闭-->
                <el-menu
                        background-color="#545c64"
                        text-color="#fff"
                        active-text-color="#ffd04b"
                        :unique-opened="true"
                        :collapse="isCollapse"
                        :collapse-transition="false"
                        :router="true"
                        :default-active="activePath">
                    <!--一级菜单-->
                    <el-submenu :index="name"
                                v-for="{id, name, submenuList} in menulist"
                                :key="id">
                        <!--一级菜单模板区域-->
                        <template slot="title">
                            <!--图标-->
                            <i class="el-icon-location"/>
                            <span>{{name}}</span>
                        </template>
                        <!--二级菜单-->
                        <el-menu-item :index="subItem.path"
                                      v-for="subItem in (submenuList)"
                                      :key="subItem.id"
                                      @click="saveNavState(subItem.path)">
                            <!--二级菜单模板区域-->
                            <template slot="title">
                                <!--图标-->
                                <i class="el-icon-menu"/>
                                <span>{{subItem.name}}</span>
                            </template>
                        </el-menu-item>
                    </el-submenu>
                </el-menu>
            </el-aside>
            <!--右侧内容主体-->
            <el-main>
                <router-view/>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
    export default {

        data() {
            return {
                menulist: [],

                isCollapse: false,

                activePath: ''
            }
        },

        created() {
            this.getMenuList();
            this.activePath = window.sessionStorage.getItem("activePath");
        },

        methods: {
            logout() {
                window.sessionStorage.clear();
                this.$router.push("/login");
            },

            async getMenuList() {
                const result = await this.$http.get("http://127.0.0.1:8082/menu/allMenu");
                if (result.status !== 200) return this.$message.error("请求服务器错误！");
                console.log(result);
                this.menulist = result.data


            },
            // 菜单折叠展开按钮
            toggleCollapse() {
                this.isCollapse = !this.isCollapse;
            },

            saveNavState(activePath) {
                window.sessionStorage.setItem('activePath', activePath);
                this.activePath = activePath;
            }

        }
    }
</script>

<style lang="less" scoped>

    .home-container {
        height: 100%;
    }

    .el-header {
        background-color: #77ffff;
        display: flex;
        justify-content: space-between;
        padding-left: 0;
        align-items: center;
        color: #000000;
        font-size: 20px;

        > div {
            display: flex;
            align-items: center;

            img {
                width: 30%;
            }

            span {
                margin-left: 20px;
            }
        }
    }

    .el-aside {
        background-color: #545c64;

        .el-menu {
            border-right: none;
        }
    }

    .el-main {
        background-color: #dddddd;
    }

    .toggle-button {
        background-color: black;
        font-size: 10px;
        line-height: 24px;
        color: #ffffff;
        text-align: center;
        letter-spacing: 0.5em;
    }
</style>