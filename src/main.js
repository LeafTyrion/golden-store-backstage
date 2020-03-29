import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/css/global.css'
import './plugins/element.js'
import axios from "axios";

// axios.defaults.baseURL = 'http://127.0.0.1:8081'//

// 配置请求拦截器token
axios.interceptors.request.use(config => {
    config.headers.Authorization = window.sessionStorage.getItem("token");
    return config;
});

Vue.prototype.$http = axios;

axios.interceptors.request.use(config => {
    console.log(config);
    config.headers.Authorization = window.sessionStorage.getItem("token");
    return config;
});


Vue.config.productionTip = false;

new Vue({
    router: router,
    store,
    render: h => h(App)
}).$mount('#app');
