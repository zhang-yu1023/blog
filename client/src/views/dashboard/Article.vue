<template>
  <n-tabs v-model:value="tabValue" type="line" justify-content="start" animated>
    <n-tab-pane name="list" tab="文章列表">
      <div v-for="(blog, index) in blogListInfo" style="margin-bottom: 15px">
        <n-card :title="blog.title">
          <div v-html="blog.content"></div>

          <template #footer>
            <!-- 对齐发布时间和按钮 -->
            <n-space align="center">
              <div>发布时间：{{ blog.create_time }}</div>
              <n-button @click="toUpdate(blog)">修改</n-button>
              <n-button @click="toDelete(blog)">删除</n-button>
            </n-space>
          </template>
        </n-card>
      </div>
      <n-space>
        <div @click="toPage(pageNum)" v-for="pageNum in pageInfo.pageCount">
          <div :style="'color:' + (pageNum == pageInfo.page ? 'blue' : '')">
            {{ pageNum }}
          </div>
        </div>
      </n-space>
    </n-tab-pane>
    <n-tab-pane name="add" tab="添加文章">
      <n-form-item label="标题">
        <n-input v-model:value="addArtical.title" placeholder="请输入标题" />
      </n-form-item>
      <n-form-item label="分类">
        <n-select v-model:value="addArtical.categoryId" :options="categoryOptions" />
      </n-form-item>
      <n-form-item label="文章">
        <rich-text-editor v-model="addArtical.content"></rich-text-editor>
      </n-form-item>
      <n-form-item label="">
        <n-button @click="add">提交</n-button>
      </n-form-item>
    </n-tab-pane>

    <n-tab-pane name="update" tab="修改文章" disabled>
      <n-form-item label="标题">
        <n-input v-model:value="updateArtical.title" placeholder="请输入标题" />
      </n-form-item>
      <n-form-item label="分类">
        <n-select v-model:value="updateArtical.categoryId" :options="categoryOptions" />
      </n-form-item>
      <n-form-item label="文章">
        <rich-text-editor v-model="updateArtical.content"></rich-text-editor>
      </n-form-item>
      <n-form-item label="">
        <n-button @click="update">修改</n-button>
      </n-form-item>
    </n-tab-pane>
  </n-tabs>
</template>
<script setup>
import { AdminStore } from '../../stores/AdminStore'
import { ref, reactive, inject, onMounted } from 'vue'
import RichTextEditor from '../../components/RichTextEditor.vue'

import { useRouter, useRoute } from 'vue-router'
const router = useRouter()
const route = useRoute()

const axios = inject('axios')

const message = inject('message')
const dialog = inject('dialog')
const adminStore = AdminStore()
const addArtical = reactive({
  categoryId: 0,
  title: '',
  content: ''
})
const updateArtical = reactive({
  id: 0,
  categoryId: 0,
  title: '',
  content: 'hello'
})

const categoryOptions = ref([])
const blogListInfo = ref([])
const tabValue = ref('list')
const pageInfo = reactive({
  page: 1,
  pageSize: 3,
  pageCount: 0,
  count: 0
})

onMounted(() => {
  loadBlogs()
  loadCategorys()
})

const loadBlogs = async () => {
  // let res = await axios.get('/blog/search')
  let res = await axios.get(`/blog/search?page=${pageInfo.page}&pageSize=${pageInfo.pageSize}`)
  let temp_rows = res.data.data.rows
  // console.log(res)
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

const loadCategorys = async () => {
  let res = await axios.get('/category/list')

  categoryOptions.value = res.data.rows.map((item) => {
    return {
      label: item.name,
      value: item.id
    }
  })
  // console.log(categoryOptions.value)
  // categoryList.value = res.data.rows
}
const add = async () => {
  let res = await axios.post('/blog/_token/add', addArtical)
  if (res.data.code == 200) {
    addArtical.title = ''
    addArtical.categoryId = ''
    //TODO: 还需要清除content内容
    // addArtical.content = null
    message.info(res.data.msg)
    tabValue.value = 'list'
    loadBlogs()
  } else {
    message.error(res.data.msg)
  }
  // console.log(addArtical,'!!!')
}

const toPage = async (pageNum) => {
  pageInfo.page = pageNum
  loadBlogs()
}

const toUpdate = async (blog) => {
  tabValue.value = 'update'
  let res = await axios.get('/blog/detail?id=' + blog.id)
  updateArtical.id = blog.id
  updateArtical.title = res.data.rows[0].title
  updateArtical.categoryId = res.data.rows[0].category_id
  updateArtical.content = res.data.rows[0].content
  // console.log(res)
}

const update = async () => {
  let res = await axios.put('/blog/_token/update', updateArtical)
  if (res.data.code == 200) {
    message.info(res.data.msg)
    loadBlogs()
    tabValue.value = 'list'
  } else {
    message.error(res.data.msg)
  }
}

const toDelete = async (blog) => {
  let res = await axios.delete('/blog/_token/delete?id=' + blog.id)
  if (res.data.code == 200) {
    message.info(res.data.msg)
    loadBlogs()
  } else {
    message.error(res.data.msg)
  }
}
</script>
<style lang="scss" scoped></style>
