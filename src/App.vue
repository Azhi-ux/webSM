<template>
  <div v-if="isLoading" class="loading-container">
    <el-loading></el-loading>
  </div>
  <div v-else-if="authStore.user">
    <el-container class="layout-container">
      <el-aside width="200px">
        <div class="logo-container">
          <img src="/vite.svg" alt="Logo" class="logo" />
          <h1 class="text-white text-lg">Web安全检测系统</h1>
        </div>
        <el-menu
          :default-active="route.path"
          class="el-menu-vertical"
          :router="true"
          background-color="#304156"
          text-color="#fff"
          active-text-color="#409EFF"
        >
          <el-menu-item index="/">
            <el-icon><Monitor /></el-icon>
            <span>仪表盘</span>
          </el-menu-item>
          <el-menu-item index="/assets">
            <el-icon><Box /></el-icon>
            <span>资产管理</span>
          </el-menu-item>
          <el-menu-item index="/scan-results">
            <el-icon><Search /></el-icon>
            <span>扫描结果</span>
          </el-menu-item>
          <el-menu-item index="/security-baseline">
            <el-icon><Lock /></el-icon>
            <span>安全基线</span>
          </el-menu-item>
          <el-menu-item index="/vulnerability-database">
            <el-icon><DataAnalysis /></el-icon>
            <span>漏洞库</span>
          </el-menu-item>
          <el-menu-item index="/reports">
            <el-icon><Document /></el-icon>
            <span>报告管理</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-container>
        <el-header>
          <div class="header-content">
            <h2>Web应用漏洞检测系统</h2>
            <div class="user-info">
              <el-dropdown @command="handleCommand">
                <span class="el-dropdown-link">
                  {{ authStore.user.email }}
                  <el-icon class="el-icon--right">
                    <arrow-down />
                  </el-icon>
                </span>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item command="logout">退出登录</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </div>
        </el-header>
        <el-main>
          <router-view v-if="route.name"></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
  <router-view v-else></router-view>
</template>

<script setup lang="ts">
import { Monitor, Search, Lock, Document, Box, DataAnalysis, ArrowDown } from '@element-plus/icons-vue'
import { useAuthStore } from './stores/auth'
import { useRouter, useRoute } from 'vue-router'
import { onMounted, ref } from 'vue'

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()
const isLoading = ref(true)

// 初始化时检查认证状态
onMounted(async () => {
  try {
    await authStore.checkAuth()
  } catch (error) {
    console.error('Failed to check auth status:', error)
  } finally {
    isLoading.value = false
  }
})

const handleCommand = async (command: string) => {
  if (command === 'logout') {
    try {
      await authStore.logout()
      router.push('/login')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }
}
</script>

<style>
.loading-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.8);
  z-index: 9999;
}

.layout-container {
  height: 100vh;
}

.logo-container {
  height: 60px;
  display: flex;
  align-items: center;
  padding: 0 20px;
  background-color: #2b3648;
}

.logo {
  width: 30px;
  height: 30px;
  margin-right: 10px;
}

.el-header {
  background-color: #fff;
  border-bottom: 1px solid #dcdfe6;
  padding: 0 20px;
}

.header-content {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.user-info {
  display: flex;
  align-items: center;
}

.el-dropdown-link {
  cursor: pointer;
  display: flex;
  align-items: center;
  color: #409EFF;
}

.el-aside {
  background-color: #304156;
}

.el-menu {
  border-right: none;
}

.el-main {
  background-color: #f0f2f5;
  padding: 20px;
  height: calc(100vh - 60px);
  overflow-y: auto;
}

.el-menu-item {
  display: flex;
  align-items: center;
}

.el-menu-item .el-icon {
  margin-right: 8px;
}
</style>