<template>
  <div class="main-panel">
    <div class="menus">
      <!-- <button @click="toMainPage()">回到首页</button> -->
      <div v-for="(menu, index) in menus" @click="toPage(menu)">
        {{ menu.name }}
      </div>
    </div>
    <div style="padding: 20px; width: 100%">
      <router-view></router-view>
    </div>
    <!-- <div class="title">后台管理系统</div> -->
  </div>
</template>
<script setup>
import { AdminStore } from '../../stores/AdminStore'
import { ref, reactive, inject } from 'vue'

import { useRouter, useRoute } from 'vue-router'
const router = useRouter()
const route = useRoute()

const axios = inject('axios')
const adminStore = AdminStore()

let menus = [
  { name: '文章管理', href: '/dashboard/article' },
  { name: '分类管理', href: '/dashboard/category' },
  { name: '退出', href: '/main' }
]

const toPage = (menu) => {
  if (menu.href == 'logout') {
    router.push('/login')
  } else {
    router.push(menu.href)
  }
}

const toMainPage = () => {
  router.push('/main')
}
</script>
<style lang="scss" scoped>
.main-panel {
  display: flex;
  min-height: 100vh;
  color: #64676a;
  max-width: 1500px;
  margin: auto;
}
.menus {
  padding: 50px 0;
  box-sizing: border-box;
  line-height: 55px;
  text-align: center;
  width: 180px;
  border-right: 1px solid grey;

  div {
    cursor: pointer;
    font-size: large;
    margin-bottom: 15px;
    font-weight: 500;
    &:hover {
      color: #12693b;
    }
  }
}
.title {
  font-size: 65px;
  font-weight: bold;
  text-align: right;
  position: fixed;
  color: rgba(0, 0, 0, 20%);
  right: calc((100vw - 1500px) / 2);
  bottom: 20px;
}
</style>
