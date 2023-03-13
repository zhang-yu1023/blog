import { createApp } from 'vue'
import { createPinia } from 'pinia'
import naive from 'naive-ui'
import { createDiscreteApi } from 'naive-ui'
import { AdminStore } from "./stores/AdminStore"

import App from './App.vue'
import { router } from './router'

import './assets/main.css'
import axios from 'axios'

axios.defaults.baseURL = "http://localhost:8080"

const { message, dialog, notification } = createDiscreteApi(['message', 'dialog', 'notification'])


/**
 * axios  //与服务端通信
 * pinia  //状态管理
 * sass
 * vue-router
 * naive-ui
 * wangeditor  //富文本编辑
 * 
*/

const app = createApp(App)
app.provide("axios", axios)
app.provide("message", message)
app.provide("dialog", dialog)
app.provide("notification", notification)
app.provide("server_url", axios.defaults.baseURL)

app.use(naive)

app.use(createPinia())
//拦截器  
//每次执行请求前先执行下面代码   得在app.use(createPinia())后面，否则adminStore无效
const adminStore = AdminStore()
axios.interceptors.request.use((config) => {
    config.headers.token = adminStore.token
    return config
})


app.use(router)

app.mount('#app')
