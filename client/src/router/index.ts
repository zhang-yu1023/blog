import { createRouter, createWebHistory } from 'vue-router'

// 静态导入
// import HomeView from '../views/HomePage.vue'
// import LoginView from '../views/Login.vue'
// import DetailView from '../views/Detail.vue'
// import DashboardView from '../views/dashboard/Dashboard.vue'
// import CategoryView from '../views/dashboard/Category.vue'
// import ArticleView from '../views/dashboard/Article.vue'
// import TestView from '../views/test.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    // 路由懒加载
    // which is lazy-loaded when the route is visited.
    { path: '/', redirect: '/main' },
    { path: '/test', component: () => import('../views/test.vue') },
    { path: '/main', component: () => import('../views/HomePage.vue') },
    { path: '/login', component: () => import('../views/Login.vue') },
    { path: '/detail', component: () => import('../views/Detail.vue') },
    {
      path: '/dashboard',
      component: () => import('../views/dashboard/Dashboard.vue'),
      children: [
        { path: '/dashboard/category', component: () => import('../views/dashboard/Category.vue') },
        { path: '/dashboard/article', component: () => import('../views/dashboard/Article.vue') }
      ]
    }
  ]
})

export { router }
