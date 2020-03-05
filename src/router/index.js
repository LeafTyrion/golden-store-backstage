import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from "../components/Login";
import Home from "../components/Home";
import Welcome from "../components/Welcome";
import Goods from "../components/Goods/Goods";

Vue.use(VueRouter);

const routes = [
    {
        path: '/login',
        name: 'Login',
        component: Login
    },
    {
        path: '/home',
        name: 'Home',
        component: Home,
        redirect: '/welcome',
        children: [
            {path: '/welcome', component: Welcome},
            {path: '/addGoods', component: Goods}
        ]
    }
];

const router = new VueRouter({
    routes
});

router.beforeEach((to, from, next) => {
    // to代表要访问的路径
    // from代表从哪个路径跳转来
    // next是一个函数，表示放行
    // 如果访问login页面，直接放行
    if (to.path === '/login') return next();
    // 访问其他页面，严重session中token是否存在
    const tokenStr = window.sessionStorage.getItem('token');
    if (!tokenStr) return next('/login');
    next()

});


export default router
