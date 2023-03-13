import { createRouter, createWebHistory } from 'vue-router'
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/test", component: () => import("../views/test.vue") },
    { path: "", component: () => import("../views/HomePage.vue") },
    { path: "/login", component: () => import("../views/Login.vue") },
    { path: "/detail", component: () => import("../views/Detail.vue") },
    {
      path: "/dashboard", component: () => import("../views/dashboard/Dashboard.vue"),
      children: [
        { path: "/dashboard/category", component: () => import("../views/dashboard/Category.vue") },
        { path: "/dashboard/article", component: () => import("../views/dashboard/Article.vue") },
      ]
    }
    // {
    //   path: '/',
    //   name: 'home',
    //   component: HomeView
    // },
    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (About.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import('../views/AboutView.vue')
    // }
  ]
})

export { router, routes }
