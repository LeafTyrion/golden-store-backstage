<template>
    <div>
        <el-container style="border: 1px solid #eee">
            <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
                <el-menu :default-openeds="['1', '3']">
                    <el-submenu index="1">
                        <template slot="title"><i class="el-icon-message"></i>导航一</template>
                        <el-menu-item-group>
                            <template slot="title">分组一</template>
                            <el-menu-item index="1-1">选项1</el-menu-item>
                            <el-menu-item index="1-2">选项2</el-menu-item>
                        </el-menu-item-group>
                        <el-menu-item-group title="分组2">
                            <el-menu-item index="1-3">选项3</el-menu-item>
                        </el-menu-item-group>
                        <el-submenu index="1-4">
                            <template slot="title">选项4</template>
                            <el-menu-item index="1-4-1">选项4-1</el-menu-item>
                        </el-submenu>
                    </el-submenu>
                    <el-submenu index="2">
                        <template slot="title"><i class="el-icon-menu"></i>导航二</template>
                        <el-menu-item-group>
                            <template slot="title">分组一</template>
                            <el-menu-item index="2-1">选项1</el-menu-item>
                            <el-menu-item index="2-2">选项2</el-menu-item>
                        </el-menu-item-group>
                        <el-menu-item-group title="分组2">
                            <el-menu-item index="2-3">选项3</el-menu-item>
                        </el-menu-item-group>
                        <el-submenu index="2-4">
                            <template slot="title">选项4</template>
                            <el-menu-item index="2-4-1">选项4-1</el-menu-item>
                        </el-submenu>
                    </el-submenu>
                    <el-submenu index="3">
                        <template slot="title"><i class="el-icon-setting"></i>导航三</template>
                        <el-menu-item-group>
                            <template slot="title">分组一</template>
                            <el-menu-item index="3-1">选项1</el-menu-item>
                            <el-menu-item index="3-2">选项2</el-menu-item>
                        </el-menu-item-group>
                        <el-menu-item-group title="分组2">
                            <el-menu-item index="3-3">选项3</el-menu-item>
                        </el-menu-item-group>
                        <el-submenu index="3-4">
                            <template slot="title">选项4</template>
                            <el-menu-item index="3-4-1">选项4-1</el-menu-item>
                        </el-submenu>
                    </el-submenu>
                </el-menu>
            </el-aside>

            <el-container>
                <el-header style="text-align: right; font-size: 12px">
                    <el-dropdown>
                        <i class="el-icon-setting" style="margin-right: 15px"></i>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item>查看</el-dropdown-item>
                            <el-dropdown-item>新增</el-dropdown-item>
                            <el-dropdown-item>删除</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                    <span>王小虎</span>
                </el-header>

                <el-main>
                    <el-table :data="tableData">
                        <el-table-column prop="date" label="日期" width="140">
                        </el-table-column>
                        <el-table-column prop="name" label="姓名" width="120">
                        </el-table-column>
                        <el-table-column prop="address" label="地址">
                        </el-table-column>
                    </el-table>
                </el-main>
            </el-container>
        </el-container>

    </div>
</template>

<script>
    import {put, remove} from "../utils/ali-oss";

    export default {
        name: "Test",
        data() {
            const item = {
                date: '2016-05-02',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1518 弄'
            };
            return {
                tableData: Array(20).fill(item)
            };
            return {
                dialogImageUrl: '',
                dialogVisible: false,
                fileList: []  // 定义数组，上传成功的文件都放在此数组中，删除时也从此数组中取
            };
        },
        methods: {
            // 上传合同图片
            upLoad(params) {// item 是当前本地上传的这张图片
                console.log(params)
                const fileName = params.file.name;
                const file = params.file;
                put(fileName, file).then();
                // this.fileList.push(fileName);
                // console.log(this.fileList);
                // 随机命名
                // var fileName = item.file.name  // 当前本地上传的这张图片的名称(没有时间日期)
                // var date = new Date()
                // var year = date.getFullYear()
                // var month = date.getMonth() + 1
                // month = (month < 10 ? '0' + month : month)
                // var mydate = date.getDate()
                // mydate = (mydate < 10 ? '0' + mydate : mydate)
                // this.baseurl = 'img/' + year + '/' + year + month + '/' + year + month + mydate + '/'
                // // 这里是把时间+图片名称拼接起来形成一个新的图片上传至oss，目的是区别于本地图片的名称，避免名称相同会误删，同时便于查看oss上最新上传图片的时间点
                // var filePath = this.baseurl + new Date().getTime() + '-' + fileName
                //
                // var file = item.file // 当前本地上传的这张图片
                put(filePath, file).then(result => {  // 调oss api 上传图片
                    console.log(result)
                    // 文件上传成功后，获取返回值中的文件名name，并把其放入fileList数组中，表示当前已上传的文件
                    this.fileList.push(result.name)
                })
            },
            upLoadImage() {
                this.$refs.fuck.submit();
            },
            // 删除合同图片
            handleRemove() {  // file 当前本地已上传的这张图片
                this.dialogImageUrl = "https://tachikoma.oss-cn-chengdu.aliyuncs.com/tachikoma01.jpg";
                this.dialogVisible = true;
                // const name = "tachikoma03.jpg";
                // remove(name).then()
                // var fileName = file.name  // 当前本地已上传的这张图片的名称(带有时间日期)
                // var removeName = ''
                // this.fileList.forEach(function (name) { // forEach 在循环的数组中(fileList)找到oss和本地相同的文件名称
                //     if (name.match(fileName)) {
                //         removeName = name // 给循环出匹配上文件名的name赋值，这里循环出的图片是带有时间日期
                //     }
                // })
                // console.log(removeName)
                // remove(removeName).then(result => { // 把循环出来的图片传进来，然后进行删除
                //     console.log(result)
                //     if (result.res.status != '204') {
                //         console.log('删除失败')
                //     }
                // })
            },

        }
    }
</script>

<style lang="less" scoped>
    .el-header {
        background-color: #B3C0D1;
        color: #333;
        line-height: 60px;
    }

    .el-aside {
        color: #333;

    }
</style>