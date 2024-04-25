<template>
  <div class="container">
    <div class="nav">
      <router-link to="/main" active-class="link" exact-active-class="link"> 首页 </router-link>
      <n-popselect
        @update:value="searchByCategory"
        v-model:value="selectCategory"
        :options="categoryOptions"
        trigger="click"
      >
        <a>
          分类<span>{{ cagetoryName }}</span></a
        >
      </n-popselect>
      <router-link to="/login">后台</router-link>
    </div>
    <n-divider />
    <n-space class="search">
      <n-input
        v-model:value="pageInfo.keyword"
        :style="{ width: '500px' }"
        placeholder="请输入关键字"
      ></n-input>
      <n-button type="primary" ghost @click="loadBlogs(0)">搜索</n-button>
    </n-space>

    <div v-for="(blog, index) in blogListInfo" class="blog-card">
      <n-card :title="blog.title" @click="toDetail(blog)">
        <!-- 去除标签显示 -->
        <p v-html="blog.content"></p>

        <template #footer>
          <!-- 对齐发布时间和按钮 -->
          <n-space align="center">
            <div>发布时间：{{ blog.create_time }}</div>
          </n-space>
        </template>
      </n-card>
    </div>
    <n-pagination
      @update:page="loadBlogs"
      v-model:page="pageInfo.page"
      :page-count="pageInfo.pageCount"
    />

    <n-divider />
    <div class="footer">
      <div>Power by ann</div>
      <div>XICP 备XXXXXXX号-1</div>
    </div>
  </div>
</template>
<script setup>
import { ref, reactive, inject, onMounted, computed } from 'vue'

import { useRouter, useRoute } from 'vue-router'
const router = useRouter()
const route = useRoute()

const axios = inject('axios')
const message = inject('message')
const dialog = inject('dialog')

const selectCategory = ref(0)
const categoryOptions = ref([])
const blogListInfo = ref([])
const pageInfo = reactive({
  page: 1,
  pageSize: 3,
  pageCount: 0,
  count: 0,
  keyword: '',
  categoryId: 0
})

onMounted(() => {
  loadCategorys()
  loadBlogs()
})

const cagetoryName = computed(() => {
  let selectedOption = categoryOptions.value.find((option) => {
    return option.value == selectCategory.value
  })
  return selectedOption ? selectedOption.label : ''
})

const loadCategorys = async () => {
  let res = await axios.get('/category/list')

  categoryOptions.value = res.data.rows.map((item) => {
    return {
      label: item.name,
      value: item.id
    }
  }) // categoryList.value = res.data.rows
}
const homePage = () => {
  router.push('/main')
}
const dashboard = () => {
  router.push('/login')
}

const loadBlogs = async (page = 0) => {
  if (page != 0) {
    pageInfo.page = page
  }
  let res = await axios.get(
    `/blog/search?keyword=${pageInfo.keyword}&page=${pageInfo.page}&pageSize=${pageInfo.pageSize}&categoryId=${pageInfo.categoryId}`
  )
  let temp_rows = res.data.data.rows

  for (let rows of temp_rows) {
    rows.content += '...'
    let d = new Date(rows.create_time)
    rows.create_time = `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`
  }
  blogListInfo.value = temp_rows
  pageInfo.count = res.data.data.count
  pageInfo.pageCount =
    parseInt(pageInfo.count / pageInfo.pageSize) + (pageInfo.count % pageInfo.pageSize > 0 ? 1 : 0)
  // console.log(res)
}

const toDetail = (blog) => {
  console.log(blog)

  router.push({ path: '/detail', query: { id: blog.id } })
}

const searchByCategory = (categoryId) => {
  pageInfo.categoryId = categoryId
  loadBlogs()
}
</script>

<style lang="scss" scoped>
.container {
  // width: 100%;

  max-width: calc(100% - 30px);
  margin: 0 30px;
  margin: 0 auto;
}

.nav {
  display: flex;
  font-size: 20px;
  padding-top: 20px;
  color: #64676a;

  a {
    cursor: pointer;
    margin: 0 20px;
    color: inhert;

    &:hover {
      color: orange;
    }
  }
}
.link {
  color: orange;
}
.blog-card {
  margin-bottom: 15px;
  cursor: pointer;
  // width: 65%;
  // background-color: rgba(255, 255, 255, 0.5);
}

.footer {
  text-align: center;
  line-height: 25px;
  color: #64676a;
}
.search {
  margin-bottom: 15px;
}
</style>
