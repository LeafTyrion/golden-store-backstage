<template>
    <div>
        <!--面包屑导航-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        </el-breadcrumb>
        <!--卡片视图区域-->
        <el-card class="box-card">
            <el-row :gutter="20">
                <!--搜索区域-->
                <el-col :span="7">
                    <el-input placeholder="请输入内容" v-model="queryInfo.query">
                        <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
                    </el-input>
                </el-col>
                <!--按钮区域-->
                <el-col :span="4">
                    <el-button type="primary" @click="addDialogOpen">添加商品</el-button>
                </el-col>
            </el-row>
            <!--列表区域-->
            <el-table :data="goodsList" border stripe>
                <el-table-column type="index" label="#"/>
                <el-table-column label="商品编号" prop="id"/>
                <el-table-column label="商品名称" prop="name"/>
                <el-table-column label="商品成本价" prop="costPrice"/>
                <el-table-column label="商品平台价" prop="tradePrice"/>
                <el-table-column label="商品零售价" prop="price"/>
                <el-table-column label="商品库存" prop="stock"/>
                <el-table-column label="上架状态" width="90px" prop="sell">
                    <template slot-scope="scope">
                        <el-switch v-model="scope.row.sell" @change="goodsStateChanged(scope.row)"></el-switch>
                    </template>
                </el-table-column>
                <!--操作区域-->
                <el-table-column label="操作" width="200px">
                    <template slot-scope="scope">
                        <el-tooltip effect="dark" content="查看详情" placement="top" :enterable="false">
                            <el-button @click="viewGoods(scope.row)" type="warning" icon="el-icon-notebook-2"
                                       size="mini"/>
                        </el-tooltip>
                        <el-tooltip effect="dark" content="编辑" placement="top" :enterable="false">
                            <el-button @click="editGoods(scope.row)" type="primary" icon="el-icon-edit"
                                       size="mini"/>
                        </el-tooltip>
                        <el-tooltip effect="dark" content="删除" placement="top" :enterable="false">
                            <el-button @click="deleteGoods(scope.row)" type="danger" icon="el-icon-delete"
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
        <!--添加商品信息对话框-->
        <el-dialog
                title="添加商品"
                :before-close="addDialogClosed"
                :visible.sync="addDialogVisible"
                width="50%">
            <!--主体内容区域-->
            <el-form :model="goodsForm" :rules="goodsFormRules" ref="addFormRef" label-width="150px">
                <el-form-item label="商品名称" prop="name">
                    <el-input v-model="goodsForm.name"/>
                </el-form-item>
                <el-form-item label="库存数量" prop="stock">
                    <el-input v-model="goodsForm.stock"/>
                </el-form-item>
                <el-form-item label="商品类型" prop="type">
                    <el-cascader
                            v-model="cascaderValue"
                            ref="cascaderRef"
                            :filterable="true"
                            :props="optionProps"
                            :options="typeList"
                            @change="handleChange"
                            placeholder="请选择商品类型"/>
                </el-form-item>
                <el-form-item label="成本价" prop="costPrice">
                    <el-input v-model="goodsForm.costPrice"/>
                </el-form-item>
                <el-form-item label="批发价" prop="tradePrice">
                    <el-input v-model="goodsForm.tradePrice"/>
                </el-form-item>
                <el-form-item label="建议零售价" prop="price">
                    <el-input v-model="goodsForm.price"/>
                </el-form-item>
                <el-form-item label="每个批发单位数量" prop="numSpec">
                    <el-input v-model="goodsForm.numSpec"/>
                </el-form-item>
                <el-form-item label="商品规格" prop="specification">
                    <el-input v-model="goodsForm.specification"/>
                </el-form-item>
                <el-form-item label="商品详细信息" prop="detail">
                    <el-input type="textarea" :autosize="{minRows:2,maxRows:5}"
                              v-model="goodsForm.detail"/>
                </el-form-item>
                <el-form-item label="商品图片">
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
                        <div slot="tip">只能上传4张格式为jpg/png文件，且不超过500kb</div>
                    </el-upload>
                    <el-dialog :visible.sync="dialogVisible">
                        <img width="100%" :src="dialogImageUrl" alt="../../logo.png">
                    </el-dialog>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogClosed">取 消</el-button>
                <el-button type="primary" @click="addGoods">确 定</el-button>
            </span>
        </el-dialog>

        <!--编辑修改商品信息对话框-->
        <el-dialog
                title="修改商品"
                :before-close="editDialogClosed"
                :visible.sync="editDialogVisible"
                width="50%">
            <!--主体内容区域-->
            <el-form :model="goods" :rules="goodsFormRules" ref="editFormRef" label-width="150px">
                <el-form-item label="商品名称" prop="name">
                    <el-input v-model="goods.name"/>
                </el-form-item>
                <el-form-item label="库存数量" prop="stock">
                    <el-input v-model="goods.stock"/>
                </el-form-item>
                <el-form-item label="商品类型" prop="type">
                    <el-cascader
                            v-model="cascaderValue"
                            ref="cascaderRef"
                            :filterable="true"
                            :props="optionProps"
                            :options="typeList"
                            @change="handleChange"
                            placeholder="请选择商品类型"/>
                </el-form-item>
                <el-form-item label="成本价" prop="costPrice">
                    <el-input v-model="goods.costPrice"/>
                </el-form-item>
                <el-form-item label="批发价" prop="tradePrice">
                    <el-input v-model="goods.tradePrice"/>
                </el-form-item>
                <el-form-item label="建议零售价" prop="price">
                    <el-input v-model="goods.price"/>
                </el-form-item>
                <el-form-item label="每个批发单位数量" prop="numSpec">
                    <el-input v-model="goods.numSpec"/>
                </el-form-item>
                <el-form-item label="商品规格" prop="specification">
                    <el-input v-model="goods.specification"/>
                </el-form-item>
                <el-form-item label="商品详细信息" prop="detail">
                    <el-input type="textarea" :autosize="{minRows:2,maxRows:5}"
                              v-model="goods.detail"/>
                </el-form-item>
                <el-form-item label="商品图片">
                    <el-upload action="#"
                               :before-remove="imagesRemove"
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
                        <div slot="tip">只能上传4张格式为jpg/png文件，且不超过500kb</div>
                    </el-upload>
                    <el-dialog :visible.sync="dialogVisible">
                        <img width="100%" :src="dialogImageUrl" alt="../../logo.png">
                    </el-dialog>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogClosed">取 消</el-button>
                <el-button type="primary" @click="updateGoods">确 定</el-button>
            </span>
        </el-dialog>
        <!--查看商品信息对话框-->
        <el-dialog
                title="查看商品详细信息"
                :before-close="viewDialogClosed"
                :visible.sync="viewDialogVisible"
                width="50%">
            <!--主体内容区域-->
            <el-form :model="goods" label-width="150px">
                <el-form-item label="商品名称" prop="name">{{goods.name}}</el-form-item>
                <el-form-item label="库存数量" prop="stock">{{goods.stock}}</el-form-item>
                <el-form-item label="商品类型" prop="type">
                    {{goods.subType.type.name}}/{{goods.subType.name}}
                </el-form-item>
                <el-form-item label="成本价" prop="costPrice">{{goods.costPrice}}</el-form-item>
                <el-form-item label="批发价" prop="tradePrice">{{goods.tradePrice}}</el-form-item>
                <el-form-item label="建议零售价" prop="price">{{goods.price}}</el-form-item>
                <el-form-item label="每个批发单位数量" prop="numSpec">{{goods.numSpec}}</el-form-item>
                <el-form-item label="商品规格" prop="specification">{{goods.specification}}</el-form-item>
                <el-form-item label="商品详细信息" prop="detail">{{goods.detail}}</el-form-item>
                <el-form-item label="商品图片">
                    <el-image v-for="imageUrls in fileList" :key="imageUrls.id" :src="imageUrls.url"/>
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
        name: "Goods",
        data() {
            return {
                // 级联选择器相关变量
                subType: {},
                optionProps: {
                    value: 'id',
                    label: 'name',
                    children: 'subType'
                },
                cascaderValue: [],
                // 分页查询相关变量
                queryInfo: {
                    page: 1,
                    size: 10,
                    query: '',
                },
                total: 0,
                goodsList: [],
                typeList: [],
                // 控制对话框打开关闭
                addDialogVisible: false,
                editDialogVisible: false,
                viewDialogVisible: false,
                // 表单数据
                goodsForm: {
                    name: null,
                    stock: null,
                    // 成本
                    costPrice: null,
                    // 批发价
                    tradePrice: null,
                    // 零售价
                    price: null,
                    // 每个批发单位数量
                    numSpec: null,
                    // 规格
                    specification: null,
                    detail: null,
                    subType: {
                        id: null,
                    },
                },
                goods: {
                    subType: {
                        id: null,
                        name: null,
                        type: {
                            id: null,
                        }
                    }
                },
                goodsId: null,
                // 表单数据验证规则
                goodsFormRules: {
                    name: [
                        {required: true, message: '请输入商品类别', trigger: 'blur'},
                        {min: 2, max: 10, message: '商品类别长度在2-10个字符之间', trigger: 'blur'}
                    ],
                },
                //图片相关变量
                dialogImageUrl: '',
                dialogVisible: false,
                fileList: [],
                images: {},
            };

        },
        created() {
            this.getGoodsList();
        },
        methods: {
            handleChange(value) {
                console.log(value);
                this.goodsForm.subType.id = value[1];
                this.goods.subType.id = value[1];
            },
            // 监听pageSize每页显示的条数改变事件
            handleSizeChange(newSize) {
                this.queryInfo.size = newSize;
                this.getGoodsList();
            },
            // 监听页码值改变事件
            handleCurrentChange(newPage) {
                this.queryInfo.page = newPage;
                this.getGoodsList();

            },

            async addDialogOpen() {
                this.addDialogVisible = true;
                const result = await this.$http.get("http://127.0.0.1:8084/type/allType");
                console.log(result);
                if (result.status !== 200) {
                    return this.$message.error("获取商品类型信息失败")
                }
                this.typeList = result.data;
            },
            // 添加商品操作
            addGoods() {
                // 表单预校验
                this.$refs.addFormRef.validate(async valid => {
                    if (!valid) return;
                    // 先存入商品文本信息
                    const result = await this.$http.post(
                        "http://127.0.0.1:8084/goods/addGoods",
                        this.goodsForm);

                    if (result.status !== 200)
                        return this.$message.error("添加商品失败");

                    this.goodsId = result.data.id;
                    // 触发上传图片
                    this.$refs.uploadRef.submit();

                    this.$message.success("添加商品成功");

                    this.cascaderValue = [];
                    this.$refs.uploadRef.clearFiles();
                    this.$refs.addFormRef.resetFields();
                    this.addDialogVisible = false;
                    await this.getGoodsList();
                });
            },
            //对话框点击取消
            addDialogClosed() {
                // 重置内容
                this.cascaderValue = [];
                this.$refs.uploadRef.clearFiles();
                this.$refs.addFormRef.resetFields();
                this.addDialogVisible = false;
            },


            async getGoodsList() {
                const result = await this.$http.get("http://127.0.0.1:8084/goods/allGoods",
                    {params: this.queryInfo});
                console.log(result);
                if (result.status !== 200) {
                    return this.$message.error("获取商品列表失败")
                }
                this.goodsList = result.data.content;
                this.total = result.data.totalElements;
            },
            // 上传图片的方法
            upLoadImages(params) {// params 是当前本地上传的这张图片
                console.log("开始修改图片");
                const fileName = params.file.name;
                const file = params.file;
                console.log(this.fileList);
                // 调oss api 上传图片
                put(fileName, file).then(async result => {
                    console.log(fileName);
                    console.log("修改图片成功");
                    this.images.url = result.url;
                    this.images.name = result.name;
                    const goods = {};
                    goods.id = this.goodsId;
                    this.images.goods = goods;
                    const res = await this.$http.post(
                        "http://localhost:8084/images/addImages",
                        this.images);
                    console.log(res);
                });
            },

            async goodsStateChanged(row) {
                console.log(row.sell);
                const result = await this.$http.get("http://127.0.0.1:8084/goods/updateIsSell",
                    {params: {id: row.id, isSell: row.sell}});
                console.log(result);

            },

            async viewGoods(row) {
                this.viewDialogVisible = true;
                const goodsRes = await this.$http.get("http://127.0.0.1:8084/goods/queryGoods",
                    {params: {id: row.id}});
                this.goods = goodsRes.data;
                console.log(goodsRes);

                const imagesRes = await this.$http.get("http://127.0.0.1:8084/images/getImagesByGoodsId",
                    {params: {id: row.id}});
                console.log(imagesRes);
                this.fileList = imagesRes.data;
                console.log(this.fileList);
            },
            // 关闭查看商品信息对话框
            viewDialogClosed() {
                this.cascaderValue = [];
                this.fileList = [];
                this.viewDialogVisible = false;
            },

            async editGoods(row) {
                this.editDialogVisible = true;
                const goodsRes = await this.$http.get("http://127.0.0.1:8084/goods/queryGoods",
                    {params: {id: row.id}});
                console.log(goodsRes);
                this.goods = goodsRes.data;

                this.cascaderValue = [this.goods.subType.type.id, this.goods.subType.id];

                const typeRes = await this.$http.get("http://127.0.0.1:8084/type/allType");
                console.log(typeRes);
                if (typeRes.status !== 200) {
                    return this.$message.error("获取商品类型信息失败")
                }
                this.typeList = typeRes.data;

                const imagesRes = await this.$http.get("http://127.0.0.1:8084/images/getImagesByGoodsId",
                    {params: {id: row.id}});
                console.log(imagesRes);
                this.fileList = imagesRes.data;
                console.log(this.fileList)

            },
            updateGoods() {
                // 表单预校验
                this.$refs.editFormRef.validate(async valid => {
                    if (!valid) return;
                    // 先存入商品文本信息
                    const result = await this.$http.post(
                        "http://127.0.0.1:8084/goods/updateGoods",
                        this.goods);
                    if (result.status !== 200)
                        return this.$message.error("修改商品失败");

                    this.goodsId = result.data.id;
                    this.$refs.uploadRef.submit();
                    this.$message.success("修改商品成功");
                    this.$refs.uploadRef.clearFiles();
                    this.$refs.editFormRef.resetFields();
                    this.fileList = [];
                    this.cascaderValue = [];
                        this.editDialogVisible = false;
                    await this.getGoodsList();
                });
            },
            editDialogClosed() {
                this.cascaderValue = [];
                this.$refs.uploadRef.clearFiles();
                this.$refs.editFormRef.resetFields();
                this.fileList = [];
                this.editDialogVisible = false;
            },

            // 删除商品操作
            async deleteGoods(row) {
                // 弹框再次确认
                const result = await this.$confirm('是否确认删除此商品？', '提示', {
                        confirmButtonText: '确认',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }
                ).catch(error => {
                    return error;
                });

                if (result !== 'confirm')
                    return this.$message.info("取消删除");
                const {data} = await this.$http.get("http://127.0.0.1:8084/goods/deleteGoods", {params: {id: row.id}});
                if (data === true) {
                    await this.getGoodsList();
                    return this.$message.success("删除成功");
                }
                return this.$message.error("删除失败");
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
                const {data} = await this.$http.get("http://127.0.0.1:8084/images/deleteImageById",
                    {params: {id: file.id}});
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

        },

    }
</script>

<style lang="less" scoped>
    .el-image {
        width: 150px;
        height: 150px;
    }

</style>
