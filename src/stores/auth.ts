import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '../supabase'
import type { User } from '@supabase/supabase-js'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const loading = ref(false)

  // 模拟用户数据
  const mockUser = {
    id: 'mock-user-id',
    email: 'test@example.com',
    user_metadata: {
      name: '测试用户'
    }
  } as unknown as User

  const login = async (email: string, password: string) => {
    loading.value = true
    try {
      // 开发环境下使用模拟数据
      if (import.meta.env.DEV) {
        await new Promise(resolve => setTimeout(resolve, 800)) // 模拟网络延迟
        console.log('使用模拟登录')
        
        // 简单验证
        if (email && password.length >= 6) {
          user.value = {
            ...mockUser,
            email // 使用输入的邮箱
          } as User
          return { user: user.value }
        } else {
          throw new Error('邮箱或密码不正确')
        }
      } else {
        // 生产环境仍然使用Supabase
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        })
        if (error) throw error
        user.value = data.user
        return data
      }
    } finally {
      loading.value = false
    }
  }

  const register = async (email: string, password: string) => {
    loading.value = true
    try {
      // 开发环境下使用模拟数据
      if (import.meta.env.DEV) {
        await new Promise(resolve => setTimeout(resolve, 800)) // 模拟网络延迟
        console.log('使用模拟注册')
        return { user: { ...mockUser, email } }
      } else {
        // 生产环境仍然使用Supabase
        const { data, error } = await supabase.auth.signUp({
          email,
          password
        })
        if (error) throw error
        return data
      }
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    try {
      if (import.meta.env.DEV) {
        await new Promise(resolve => setTimeout(resolve, 500)) // 模拟网络延迟
        console.log('使用模拟登出')
        user.value = null
      } else {
        const { error } = await supabase.auth.signOut()
        if (error) throw error
        user.value = null
      }
    } catch (error) {
      console.error('Error logging out:', error)
      throw error
    }
  }

  const checkAuth = async () => {
    try {
      // 如果用户状态已经存在，则直接返回
      if (user.value) return user.value
      
      // 开发环境尝试从本地存储恢复用户会话
      if (import.meta.env.DEV) {
        console.log('开发环境中检查认证状态')
        const storedUser = localStorage.getItem('auth-store')
        if (storedUser) {
          try {
            const parsed = JSON.parse(storedUser)
            if (parsed.user) {
              user.value = parsed.user as User
              console.log('从本地存储恢复用户会话:', user.value.email)
            }
          } catch (e) {
            console.error('解析存储的用户数据出错:', e)
          }
        }
      } else {
        // 生产环境使用Supabase
        const { data: { session } } = await supabase.auth.getSession()
        user.value = session?.user || null
        
        supabase.auth.onAuthStateChange((event, newSession) => {
          user.value = newSession?.user || null
        })
      }
      
      return user.value
    } catch (error) {
      console.error('Error checking auth status:', error)
      return null
    }
  }

  return {
    user,
    loading,
    login,
    register,
    logout,
    checkAuth
  }
}, {
  persist: {
    key: 'auth-store',
    paths: ['user']
  }
})