<template>
    <div>
        <div class="block">
            <span class="demonstration">默认 click 触发子菜单</span>
            <el-cascader
                    v-model="value"
                    :options="options"
                    @change="handleChange"></el-cascader>
        </div>

    </div>
</template>

<script>
    // import {put, remove} from "../utils/ali-oss";

    export default {
        name: "Test",
        data() {
            // const item = {
            //     date: '2016-05-02',
            //     name: '王小虎',
            //     address: '上海市普陀区金沙江路 1518 弄'
            // };
            return {
                value: [],
                options: [{
                    value: 'ziyuan',
                    label: '资源',
                    children: [{
                        value: 'axure',
                        label: 'Axure Components'
                    }, {
                        value: 'sketch',
                        label: 'Sketch Templates'
                    }, {
                        value: 'jiaohu',
                        label: '组件交互文档'
                    }]
                },
                    {
                        value: 'ziyuan',
                        label: '资源',
                        children: [{
                            value: 'axure',
                            label: 'Axure Components'
                        }, {
                            value: 'sketch',
                            label: 'Sketch Templates'
                        }, {
                            value: 'jiaohu',
                            label: '组件交互文档'
                        }]
                    },
                    {
                        value: 'ziyuan',
                        label: '资源',
                        children: [{
                            value: 'axure',
                            label: 'Axure Components'
                        }, {
                            value: 'sketch',
                            label: 'Sketch Templates'
                        }, {
                            value: 'jiaohu',
                            label: '组件交互文档'
                        }]
                    }],

                // tableData: Array(20).fill(item)
            };
            // return {
            //     dialogImageUrl: '',
            //     dialogVisible: false,
            //     fileList: []  // 定义数组，上传成功的文件都放在此数组中，删除时也从此数组中取
            // };
        },
        methods: {
            handleChange(value) {
                console.log(value);
            },
            // 上传合同图片
            // upLoad(params) {// item 是当前本地上传的这张图片
            //     console.log(params)
            //     const fileName = params.file.name;
            //     const file = params.file;
            //     put(fileName, file).then();
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
            // put(filePath, file).then(result => {  // 调oss api 上传图片
            //     console.log(result)
            // 文件上传成功后，获取返回值中的文件名name，并把其放入fileList数组中，表示当前已上传的文件
            //         this.fileList.push(result.name)
            //     })
            // },
            // upLoadImage() {
            //     this.$refs.fuck.submit();
            // },
            // 删除合同图片
            // handleRemove() {  // file 当前本地已上传的这张图片
            //     this.dialogImageUrl = "https://tachikoma.oss-cn-chengdu.aliyuncs.com/tachikoma01.jpg";
            //     this.dialogVisible = true;
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
            // },

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