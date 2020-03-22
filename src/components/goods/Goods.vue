<template>
    <div>
        <el-input v-model="input" placeholder="请输入内容"></el-input>
        <el-upload
                action="#"
                list-type="picture-card"
                :on-preview="handlePictureCardPreview"
                :on-remove="handleRemove"
                :multiple="true"
                :before-upload="beforeupload">
            <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="fuck">
        </el-dialog>
        <el-button @click="upload">确定</el-button>
    </div>
</template>

<script>
    export default {
        name: "Users",
        data() {
            return {
                input: '',
                dialogImageUrl: '',
                dialogVisible: false,
                uploadForm: new FormData(),
            };

        },
        created() {

        },
        methods: {
            handleRemove(file, fileList) {
                console.log(file, fileList);
            },
            handlePictureCardPreview(file) {
                this.dialogImageUrl = file.url;
                this.dialogVisible = true;
            },
            beforeupload(file) {
                console.log(file)
                this.uploadForm.append('file', file);
                console.log(this.uploadForm.get("file"))
                return false;
            },
            clearUpload() {
                this.uploadForm = new FormData();
            },
            async upload() {
                console.log(this.uploadForm);
                const result=await this.$http.post("http://127.0.0.1:8084/goods/addGoods",this.uploadForm)

            }
        },

    }
</script>

<style lang="less" scoped>


</style>