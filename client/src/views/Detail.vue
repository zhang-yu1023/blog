<template>
  <div class="container">
    <n-button @click="back()">返回</n-button>
    <!-- 标题 -->
    <n-h1 style="margin-top: 10px; margin-left: 20px">{{ blogInfo.title }}</n-h1>
    <!-- 文章内容 -->
    <div class="blog-content">
      <div v-html="blogInfo.content"></div>
    </div>
  </div>
</template>
<script setup>
import { ref, reactive, inject, onMounted, computed } from 'vue'

import { useRouter, useRoute } from 'vue-router'
const router = useRouter() //跳转
const route = useRoute()
const axios = inject('axios')

const blogInfo = ref({})
onMounted(() => {
  loadBlog()
})

const loadBlog = async () => {
  let res = await axios.get('/blog/detail?id=' + route.query.id)
  blogInfo.value = res.data.rows[0]
  //   console.log(res)
}

const back = () => {
  router.push('/main')
}
</script>

<style>
.blog-content img {
  max-width: 100% !important;
}
</style>
<style lang="scss" scoped>
.container {
  width: 100wh;
  margin: 0 auto;
  padding: 30px;

  .blog-content {
    border: 2px solid #64676a;
    border-radius: 3px;
    padding: 20px;
  }
}
</style>
