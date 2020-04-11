<template>
    <div>
        <!--面包屑导航-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>分类管理</el-breadcrumb-item>
            <el-breadcrumb-item>子类型管理</el-breadcrumb-item>
        </el-breadcrumb>
        <!--卡片视图区域-->
        <el-card class="box-card">
            <el-row :gutter="20">
                <!--搜索区域-->
                <el-col :span="7">
                    <el-input placeholder="请输入内容" v-model="queryInfo.query">
                        <el-button slot="append" icon="el-icon-search" @click="getSubTypeList"></el-button>
                    </el-input>
                </el-col>
                <!--按钮区域-->
                <el-col :span="4">
                    <el-button type="primary" @click="addDialogOpen">添加商品子类型</el-button>
                </el-col>
            </el-row>
            <!--列表区域-->
            <el-table :data="subTypeList" border stripe>
                <el-table-column type="index" label="#"/>
                <el-table-column label="子类型编号" prop="id"/>
                <el-table-column label="子类型名称" prop="name"/>
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
                title="添加商品子类型"
                :before-close="addDialogClosed"
                :visible.sync="addDialogVisible"
                width="50%">
            <!--主体内容区域-->
            <el-form :model="subTypeForm" :rules="subTypeFormRules" ref="addFormRef" label-width="100px">
                <el-form-item label="父类型名称" prop="type">
                    <el-select v-model="subTypeForm.type"
                               value-key="id"
                               filterable
                               placeholder="请选择商品父类型">
                        <el-option
                                v-for="item in typeList"
                                :value="item"
                                :key="item.id"
                                :label="item.name">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="子类型名称" prop="name">
                    <el-input v-model="subTypeForm.name"/>
                </el-form-item>
                <el-form-item label="子类型图片">
                    <el-upload action="#"
                               list-type="picture-card"
                               ref="uploadRef"
                               :on-remove="handleRemove"
                               :on-preview="handlePictureCardPreview"
                               :http-request="upLoadImages"
                               :multiple="true"
                               :auto-upload="false"
                               :limit=4
                               :file-list="fileList">
                        <i class="el-icon-plus"/>
                        <div slot="tip">只能上传1张格式为jpg/png文件，且不超过500kb</div>
                    </el-upload>
                    <el-dialog :visible.sync="dialogVisible">
                        <img width="100%" :src="dialogImageUrl" alt="../../logo.png">
                    </el-dialog>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogClosed">取 消</el-button>
                <el-button type="primary" @click="addCategory">确 定</el-button>
            </span>
        </el-dialog>
        <!--编辑商品类型对话框-->
        <el-dialog
                title="修改商品子类型"
                :before-close="editDialogClosed"
                :visible.sync="editDialogVisible"
                width="50%">
            <!--主体内容区域-->
            <el-form :model="subTypeForm" :rules="subTypeFormRules" ref="editFormRef" label-width="100px">
                <el-form-item label="父类型名称" prop="type">
                    <el-select v-model="subTypeForm.type"
                               value-key="id"
                               filterable
                               placeholder="请选择商品父类型">
                        <el-option
                                v-for="item in typeList"
                                :value="item"
                                :key="item.id"
                                :label="item.name">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="子类型名称" prop="name">
                    <el-input v-model="subTypeForm.name"/>
                </el-form-item>
                <el-form-item label="子类型图片">
                    <el-upload action="#"
                               :before-remove="imagesRemove"
                               list-type="picture-card"
                               ref="uploadRef"
                               :on-remove="handleRemove"
                               :on-preview="handlePictureCardPreview"
                               :http-request="upLoadImages"
                               :multiple="true"
                               :auto-upload="false"
                               :limit=1
                               :file-list="fileList">
                        <i class="el-icon-plus"/>
                        <div slot="tip">只能上传1张格式为jpg/png文件，且不超过500kb</div>
                    </el-upload>
                    <el-dialog :visible.sync="dialogVisible">
                        <img width="100%" :src="dialogImageUrl" alt="../../logo.png">
                    </el-dialog>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogClosed">取 消</el-button>
                <el-button type="primary" @click="updateSubCategory">确 定</el-button>
            </span>
        </el-dialog>
        <!--查看商品详细信息对话框-->
        <el-dialog
                title="查看商品子类型"
                :before-close="viewDialogClosed"
                :visible.sync="viewDialogVisible"
                width="50%">
            <!--主体内容区域-->
            <el-form :model="subType" label-width="150px">
                <el-form-item label="子类型编号：" prop="id">{{subType.id}}</el-form-item>
                <el-form-item label="子类型名称：" prop="name">{{subType.name}}</el-form-item>
                <el-form-item label="父类型名称：" prop="type.name">{{subType.type.name}}</el-form-item>
                <el-form-item label="子类型图片：">
                    <el-image :src="subType.imageUrl"/>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="viewDialogClosed">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import {put} from "../../utils/ali-oss";

    export default {
        name: "SubCategory",
        data() {
            return {
                // 分页查询参数
                queryInfo: {
                    page: 1,
                    size: 10,
                    query: null,
                },
                total: 0,

                typeList: [],
                subTypeList: [],

                // 控制对话框打开关闭
                addDialogVisible: false,
                editDialogVisible: false,
                viewDialogVisible: false,
                // 表单数据
                subTypeForm: {
                    id: null,
                    name: '',
                    imageUrl: '',
                    type: {
                        id: null
                    }
                },
                subType: {
                    type: {
                        name: '',
                    }
                },
                // 表单数据验证规则
                subTypeFormRules: {
                    name: [
                        {required: true, message: '请输入商品子类别名称', trigger: 'blur'},
                        {min: 2, max: 10, message: '商品类别长度在2-10个字符之间', trigger: 'blur'}
                    ],
                },
                subTypeId: null,

                //图片相关变量
                dialogImageUrl: '',
                dialogVisible: false,
                fileList: [],
                images: {},
                image: {url: ''},

            };
        },
        created() {
            this.getSubTypeList();
        },
        methods: {
            // 监听pagesize每页显示的条数改变事件
            handleSizeChange(newSize) {
                this.queryInfo.size = newSize;
                this.getSubTypeList();
            },
            // 监听页码值改变事件
            handleCurrentChange(newPage) {
                this.queryInfo.page = newPage;
                this.getSubTypeList();

            },
            // 添加对话框点击打开
            async addDialogOpen() {
                this.addDialogVisible = true;
                const result = await this.$http.get("http://127.0.0.1:8084/type/allType");
                console.log(result);
                this.typeList = result.data;
                console.log(this.typeList)

            },
            //添加对话框点击取消
            addDialogClosed() {
                // 重置内容
                this.$refs.uploadRef.clearFiles();
                this.$refs.addFormRef.resetFields();
                this.addDialogVisible = false;
            },
            editDialogClosed() {
                this.fileList = [];
                this.$refs.uploadRef.clearFiles();
                this.$refs.editFormRef.resetFields();
                this.editDialogVisible = false;
            },
            // 编辑对话框
            async editType(row) {
                console.log(row);
                this.editDialogVisible = true;
                const result = await this.$http.get("http://localhost:8084/subType/querySubType", {params: {id: row.id}});
                console.log(result);
                this.subTypeForm = result.data;

                if (result.data.imageUrl !== null) {
                    const imageObject = {};
                    imageObject.url = result.data.imageUrl;
                    imageObject.id = result.data.id;
                    this.fileList.push(imageObject);
                }
                console.log(this.fileList)

                const {data} = await this.$http.get("http://127.0.0.1:8084/type/allType");
                this.typeList = data;

            },
            //对话框点击确定添加
            addCategory() {
                // 表单预校验
                this.$refs.addFormRef.validate(async valid => {
                    if (!valid) return;
                    const result = await this.$http.post("http://127.0.0.1:8084/subType/addSubType", this.subTypeForm);
                    console.log(result);
                    this.subTypeId = result.data.id;
                    this.$refs.uploadRef.submit();
                    if (result.status !== 200)
                        return this.$message.error("添加类型失败");
                    this.$message.success("添加类型成功");
                    this.$refs.uploadRef.clearFiles();
                    this.$refs.addFormRef.resetFields();
                    this.addDialogVisible = false;
                    await this.getSubTypeList();
                });
            },
            //对话框点击确定修改
            updateSubCategory() {
                // 表单预校验
                this.$refs.editFormRef.validate(async valid => {
                    if (!valid) return;

                    console.log(this.subTypeForm);
                    this.$refs.uploadRef.submit();
                    const result = await this.$http.post("http://127.0.0.1:8084/subType/updateSubType", this.subTypeForm);
                    console.log(result);
                    this.subTypeId = result.data.id;

                    if (result.status !== 200)
                        return this.$message.error("修改类型失败");
                    this.$message.success("修改类型成功");
                    this.fileList = [];
                    this.$refs.editFormRef.resetFields();
                    this.editDialogVisible = false;
                    await this.getSubTypeList();
                });
            },


            async getSubTypeList() {
                const result = await this.$http.get("http://127.0.0.1:8084/subType/allSubType", {params: this.queryInfo});
                console.log(result);
                if (result.status !== 200) {
                    return this.$message.error("获取商品类型信息失败")
                }
                this.subTypeList = result.data.content;
                this.total = result.data.totalElements;
            },

            async getTypeById(row) {
                this.viewDialogVisible = true;
                const result = await this.$http.get("http://localhost:8084/subType/querySubType", {params: {id: row.id}});
                console.log(result);
                this.subType = result.data;
            },
            viewDialogClosed() {
                this.fileList = [];
                this.viewDialogVisible = false;
            },

            async deleteType(row) {
                // 弹框再次确认
                const result = await this.$confirm('是否确认删除此类型？', '提示', {
                        confirmButtonText: '确认',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }
                ).catch(error => {
                    return error;
                });

                if (result !== 'confirm')
                    return this.$message.info("取消删除");
                const {data} = await this.$http.get("http://127.0.0.1:8084/subType/deleteSubType", {params: {id: row.id}});
                if (data === true) {
                    await this.getSubTypeList();
                    return this.$message.success("删除成功");
                }
                return this.$message.error("删除失败");

            },

            // 上传图片的方法
            upLoadImages(params) {// params 是当前本地上传的这张图片
                const fileName = params.file.name;
                const file = params.file;
                // 调oss api 上传图片
                put(fileName, file).then(async result => {
                    const imageUrl = result.url;
                    const res = await this.$http.get("http://localhost:8084/subType/updateImages", {
                        params: {
                            id: this.subTypeId,
                            imageUrl: imageUrl
                        }
                    });
                    console.log(res);
                });
            },
            async imagesRemove() {
                // 弹框再次确认
                await this.$confirm('是否确认删除此图片？', '提示', {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning'
                });
            },

            // 删除待上传文件图片 file为被删除的文件 fileList是剩下的文件列表
            async handleRemove(file, fileList) {
                console.log(file, fileList);
                const {data} = await this.$http.get("http://127.0.0.1:8084/subType/deleteImage",
                    {params: {id: file.id}});
                this.subTypeForm.imageUrl = null;
                console.log(data);
                if (data === true) {
                    this.$message.success("删除成功");
                    return true;
                }
                this.$message.error("删除失败");
            },
            handlePictureCardPreview(file) {
                this.dialogImageUrl = file.url;
                this.dialogVisible = true;
            },

        }
    }
</script>

<style scoped>

</style>