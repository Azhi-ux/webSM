<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
    <div class="max-w-md w-full bg-white rounded-lg shadow-xl overflow-hidden">
      <div class="p-8">
        <h2 class="text-2xl font-bold text-center text-gray-800 mb-2">
          {{ isLogin ? '登录' : '注册' }}
        </h2>
        <p v-if="isDev" class="text-center text-gray-500 mb-6 text-sm">
          开发环境下，任意邮箱 + 6位以上密码均可登录
        </p>
        <el-form
          ref="formRef"
          :model="form"
          :rules="rules"
          class="space-y-6"
        >
          <el-form-item prop="email">
            <el-input
              v-model="form.email"
              placeholder="邮箱"
              prefix-icon="Message"
            />
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="form.password"
              type="password"
              placeholder="密码"
              prefix-icon="Lock"
              show-password
            />
          </el-form-item>
          <el-form-item v-if="!isLogin" prop="confirmPassword">
            <el-input
              v-model="form.confirmPassword"
              type="password"
              placeholder="确认密码"
              prefix-icon="Lock"
              show-password
            />
          </el-form-item>
          <div>
            <el-button
              type="primary"
              class="w-full"
              :loading="loading"
              @click="handleSubmit"
            >
              {{ isLogin ? '登录' : '注册' }}
            </el-button>
          </div>
        </el-form>
        <div class="mt-6 text-center">
          <el-button
            link
            type="primary"
            @click="toggleMode"
          >
            {{ isLogin ? '没有账号？立即注册' : '已有账号？立即登录' }}
          </el-button>
        </div>
        <div v-if="isDev" class="mt-3 text-center">
          <el-button
            link
            type="info"
            size="small"
            @click="fillTestCredentials"
          >
            使用测试账户
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const formRef = ref<FormInstance>()
const loading = ref(false)
const isLogin = ref(true)
const isDev = ref(import.meta.env.DEV)

const form = reactive({
  email: '',
  password: '',
  confirmPassword: ''
})

// 如果是开发环境，在组件挂载时填充测试账号
onMounted(() => {
  if (isDev.value) {
    console.log('开发环境下，可以使用任意邮箱和6位以上密码登录')
  }
})

// 填充测试账号
const fillTestCredentials = () => {
  form.email = 'test@example.com'
  form.password = 'password123'
  if (!isLogin.value) {
    form.confirmPassword = 'password123'
  }
}

const validatePass = (rule: any, value: string, callback: Function) => {
  if (value === '') {
    callback(new Error('请输入密码'))
  } else {
    if (!isLogin.value && form.confirmPassword !== '') {
      formRef.value?.validateField('confirmPassword')
    }
    callback()
  }
}

const validateConfirmPass = (rule: any, value: string, callback: Function) => {
  if (value === '') {
    callback(new Error('请再次输入密码'))
  } else if (value !== form.password) {
    callback(new Error('两次输入密码不一致'))
  } else {
    callback()
  }
}

const rules: FormRules = {
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  password: [
    { validator: validatePass, trigger: 'blur' }
  ],
  confirmPassword: [
    { validator: validateConfirmPass, trigger: 'blur' }
  ]
}

const handleSubmit = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        if (isLogin.value) {
          await authStore.login(form.email, form.password)
          ElMessage.success('登录成功')
          router.push('/')
        } else {
          await authStore.register(form.email, form.password)
          ElMessage.success('注册成功，请登录')
          isLogin.value = true
        }
      } catch (error: any) {
        ElMessage.error(error.message || '操作失败')
      } finally {
        loading.value = false
      }
    }
  })
}

const toggleMode = () => {
  isLogin.value = !isLogin.value
  formRef.value?.resetFields()
}
</script>