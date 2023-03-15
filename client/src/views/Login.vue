<template>
  <div class="login-page">
    <div class="login-pannel">
      <n-card title="后台管理系统" class="clearfix">
        <n-form :model="admin" :rules="rules">
          <n-form-item label="账号" path="account">
            <n-input v-model:value="admin.account" placeholder="请输入账号" />
          </n-form-item>

          <n-form-item label="密码" path="password">
            <n-input v-model:value="admin.password" placeholder="请输入密码" />
          </n-form-item>
        </n-form>
        <template #footer>
          <n-checkbox v-model:checked="admin.remember" label="记住我" />
          <n-button @click="login" style="position: absolute; bottom: 15px; right: 20px">
            登陆
          </n-button>
        </template>
      </n-card>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, inject } from 'vue'
import { AdminStore } from '../stores/AdminStore'

import { useRouter, useRoute } from 'vue-router'
const router = useRouter()
const route = useRoute()

const axios = inject('axios')
const adminstore = AdminStore()
const message = inject('message')

let rules = {
  account: [
    { required: true, message: '请输入账号', trigger: 'blur' },
    { min: 3, max: 12, message: '账号长度在3到12个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 18, message: '密码长度在6到18个字符', trigger: 'blur' }
  ]
}

const admin = reactive({
  account: localStorage.getItem('account') || '',
  password: localStorage.getItem('password') || '',
  remember: localStorage.getItem('remember') == 1 || false
})

const login = async () => {
  let result = await axios.post('/admin/login', {
    account: admin.account,
    password: admin.password
  })
  // console.log(result)
  if (result.data.code == 200) {
    adminstore.token = result.data.data.token
    adminstore.account = result.data.data.account
    adminstore.id = result.data.data.id

    if (admin.remember) {
      localStorage.setItem('account', admin.account)
      localStorage.setItem('password', admin.password)
      localStorage.setItem('remember', admin.remember ? 1 : 0)
    }
    router.push('/dashboard/article')
    message.info('登陆成功')
    //TODO: 需在页面内标明登录状态
  } else {
    message.error('登陆失败')
  }
}
</script>
<style lang="scss" scoped>
.login-page {
  width: 100%;
  height: 100vh;
  display: grid;
  place-content: center;
}
.login-pannel {
  width: 100%;
  min-width: 400px;
}
</style>
