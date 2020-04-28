import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from "../components/Login";
import Home from "../components/Home";
import Index from "../components/index/Index";
import Goods from "../components/goods/Goods";
import Category from "../components/category/Category";
import Admin from "../components/user/Admin";
import Orders from "../components/orders/Orders";
import Test from "../components/Test";
import Users from "../components/user/Users";
import SubCategory from "../components/category/SubCategory";

Vue.use(VueRouter);

const routes = [
    {
        path: '/test',
        name: 'Test',
        component: Test
    },
    {
        path: '/login',
        name: 'Login',
        component: Login
    },
    {
        path: '/home',
        name: 'Home',
        component: Home,
        redirect: '/index',
        children: [
            {path: '/index', component: Index},
            {path: '/admins', component: Admin},
            {path: '/users', component: Users},
            {path: '/goods', component: Goods},
            {path: '/category', component: Category},
            {path: '/orders', component: Orders},
            {path: '/subCategory', component: SubCategory},
        ]
    },

];

const router = new VueRouter({
    mode: 'history',
    routes
});

router.beforeEach((to, from, next) => {
    // to代表要访问的路径
    // from代表从哪个路径跳转来
    // next是一个函数，表示放行
    // 如果访问login页面，直接放行
    if (to.path === '/login') return next();
    // 访问其他页面，验证session中token是否存在
    const tokenStr = window.sessionStorage.getItem('token');
    if (!tokenStr) return next('/login');
    next()

});


export default router
