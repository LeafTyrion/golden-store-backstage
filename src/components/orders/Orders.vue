<template>
    <div>
        <!--面包屑导航-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>订单管理</el-breadcrumb-item>
            <el-breadcrumb-item>订单管理</el-breadcrumb-item>
        </el-breadcrumb>
        <!--卡片视图区域-->
        <el-card class="box-card">
            <el-row :gutter="20">
                <!--搜索区域-->
                <el-col :span="7">
                    <el-input placeholder="请输入内容" v-model="queryInfo.query">
                        <el-button slot="append" icon="el-icon-search" @click="getOrdersList"></el-button>
                    </el-input>
                </el-col>
            </el-row>
            <!--列表区域-->
            <el-table :data="ordersList" border stripe>
                <el-table-column type="index" label="#"/>
                <el-table-column label="订单编号" prop="id"/>
                <el-table-column label="收货人" prop="userName" width="70"/>
                <el-table-column label="收货地址" prop="detailInfo"/>
                <el-table-column label="订单日期" prop="createTime" width="170"/>
                <el-table-column label="订单状态" prop="status" width="80"/>

                <!--操作区域-->
                <el-table-column label="操作" width="200px">
                    <template slot-scope="scope">
                        <el-tooltip effect="dark" content="查看详情" placement="top" :enterable="false">
                            <el-button @click="viewOrders(scope.row)" type="warning" icon="el-icon-notebook-2"
                                       size="mini"/>
                        </el-tooltip>
                        <el-tooltip effect="dark" content="编辑" placement="top" :enterable="false">
                            <el-button @click="editOrders(scope.row)" type="primary" icon="el-icon-edit"
                                       size="mini"/>
                        </el-tooltip>
                        <el-tooltip effect="dark" content="删除" placement="top" :enterable="false">
                            <el-button @click="deleteOrders(scope.row)" type="danger" icon="el-icon-delete"
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

        <!--编辑修改商品信息对话框-->
        <el-dialog
                title="更新订单信息"
                :before-close="editDialogClosed"
                :visible.sync="editDialogVisible"
                width="50%">
            <!--主体内容区域-->
            <el-form :model="orders" label-width="150px">
                <el-form-item label="订单编号:">{{orders.id}}</el-form-item>
                <el-form-item label="收货人:">{{orders.userName}}</el-form-item>
                <el-form-item label="收货地址:">
                    {{orders.provinceName}}{{orders.cityName}}{{orders.countyName}}{{orders.detailInfo}}
                </el-form-item>
                <el-form-item label="邮政编码:">{{orders.postalCode}}</el-form-item>
                <el-form-item label="联系方式:">{{orders.telNumber}}</el-form-item>
                <el-form-item label="订单总额:">{{orders.price}}</el-form-item>
                <el-form-item label="下单时间:">{{orders.createTime}}</el-form-item>
                <el-form-item label="备注:">
                    <el-input type="textarea" :autosize="{minRows:2,maxRows:5}"
                              v-model="orders.remarks"/>
                </el-form-item>
                <el-form-item label="订单状态:">
                    <template>
                        <el-select v-model="orders.status" placeholder="请选择">
                            <el-option
                                    v-for="item in orderStatus"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </template>
                </el-form-item>

                <el-table :data="orders.goodsVOList">
                    <el-table-column property="goodsId" label="商品编号" width="80"/>
                    <el-table-column property="goodsName" label="商品名称"/>
                    <el-table-column property="price" label="商品单价" width="80"/>
                    <el-table-column property="quantity" label="商品数量" width="80"/>
                </el-table>
            </el-form>
            <span slot="footer" class="dialog-footer">
                        <el-button @click="editDialogClosed">取 消</el-button>
                        <el-button type="primary" @click="updateOrders">确 定</el-button>
                    </span>
        </el-dialog>

        <!--查看订单信息对话框-->
        <el-dialog
                title="查看订单详情"
                :before-close="viewDialogClosed"
                :visible.sync="viewDialogVisible"
                width="50%">
            <!--主体内容区域-->
            <el-form :model="orders" label-width="150px">
                <el-form-item label="订单编号:">{{orders.id}}</el-form-item>
                <el-form-item label="收货人:">{{orders.userName}}</el-form-item>
                <el-form-item label="收货地址:">
                    {{orders.provinceName}}{{orders.cityName}}{{orders.countyName}}{{orders.detailInfo}}
                </el-form-item>
                <el-form-item label="邮政编码:">{{orders.postalCode}}</el-form-item>
                <el-form-item label="联系方式:">{{orders.telNumber}}</el-form-item>
                <el-form-item label="订单总额:">{{orders.price}}</el-form-item>
                <el-form-item label="下单时间:">{{orders.createTime}}</el-form-item>
                <el-form-item label="备注:">{{orders.remarks}}</el-form-item>
                <el-form-item label="订单状态:">{{orders.status}}</el-form-item>

                <el-table :data="orders.goodsVOList">
                    <el-table-column property="goodsId" label="商品编号" width="80"/>
                    <el-table-column property="goodsName" label="商品名称"/>
                    <el-table-column property="price" label="商品单价" width="80"/>
                    <el-table-column property="quantity" label="商品数量" width="80"/>
                </el-table>
            </el-form>
            <span slot="footer" class="dialog-footer">
                        <el-button type="primary" @click="viewDialogClosed">确 定</el-button>
                    </span>
        </el-dialog>
    </div>
</template>

<script>

    export default {
        name: "Orders",
        data() {
            return {
                // 分页查询相关变量
                queryInfo: {
                    page: 1,
                    size: 10,
                    query: '',
                },
                // 订单状态
                orderStatus: [
                    {
                        value: '未处理',
                    }, {
                        value: '备货中',
                    }, {
                        value: '配送中',
                    }, {
                        value: '已完成',
                    }
                ],
                total: 0,

                orders: {},
                ordersList: [],

                // 控制对话框打开关闭
                editDialogVisible: false,
                viewDialogVisible: false,


            };

        },
        created() {
            this.getOrdersList();
        },
        methods: {
            // 监听pageSize每页显示的条数改变事件
            handleSizeChange(newSize) {
                this.queryInfo.size = newSize;
                this.getOrdersList();
            },
            // 监听页码值改变事件
            handleCurrentChange(newPage) {
                this.queryInfo.page = newPage;
                this.getOrdersList();

            },

            async getOrdersList() {
                const result = await this.$http.get("http://localhost:8085/orders/allOrders",
                    {params: this.queryInfo});
                console.log(result);
                if (result.status !== 200) {
                    return this.$message.error("获取商品列表失败")
                }
                this.ordersList = result.data.content;
                this.total = result.data.totalElements;
            },

            async viewOrders(row) {
                this.viewDialogVisible = true;
                const ordersRes = await this.$http.get("http://localhost:8085/orders/queryOrders",
                    {params: {id: row.id}});
                this.orders = ordersRes.data;
                console.log(ordersRes);


            },
            viewDialogClosed() {
                this.orders = {};
                this.viewDialogVisible = false;
            },

            async editOrders(row) {
                this.editDialogVisible = true;
                const ordersRes = await this.$http.get("http://localhost:8085/orders/queryOrders",
                    {params: {id: row.id}});
                console.log(ordersRes);
                this.orders = ordersRes.data;
            },
            async updateOrders() {
                const result = await this.$http.post(
                    "http://localhost:8085/orders/updateOrders",
                    this.orders);
                if (result.status !== 200)
                    return this.$message.error("更新订单信息失败");
                this.$message.success("更新订单信息成功");
                this.editDialogClosed();
                await this.getOrdersList();

            },
            editDialogClosed() {
                this.orders = {};
                this.editDialogVisible = false;
            },

            // 删除商品操作
            async deleteOrders(row) {
                // 弹框再次确认
                const result = await this.$confirm('是否确认删除此订单信息？', '提示', {
                        confirmButtonText: '确认',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }
                ).catch(error => {
                    return error;
                });
                if (result !== 'confirm')
                    return this.$message.info("取消删除");
                const {data} = await this.$http.get("http://127.0.0.1:8085/orders/deleteOrders", {params: {id: row.id}});
                if (data === true) {
                    await this.getOrdersList();
                    return this.$message.success("删除成功");
                }
                return this.$message.error("删除失败");
            },


        },

    }
</script>

<style lang="less" scoped>

</style>
