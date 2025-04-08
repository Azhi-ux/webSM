<template>
  <el-container class="layout-container">
    <el-aside width="200px">
      <el-menu
        default-active="/"
        class="el-menu-vertical"
        :router="true"
      >
        <el-menu-item index="/">
          <el-icon><Monitor /></el-icon>
          <span>仪表盘</span>
        </el-menu-item>
        <el-menu-item index="/scan-results">
          <el-icon><Search /></el-icon>
          <span>扫描结果</span>
        </el-menu-item>
        <el-menu-item index="/security-baseline">
          <el-icon><Shield /></el-icon>
          <span>安全基线</span>
        </el-menu-item>
        <el-menu-item index="/reports">
          <el-icon><Document /></el-icon>
          <span>报告管理</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header>
        <h2>Web应用漏洞检测系统</h2>
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { Monitor, Search, Shield, Document } from '@element-plus/icons-vue'
</script>

<style>
.layout-container {
  height: 100vh;
}

.el-header {
  background-color: #fff;
  border-bottom: 1px solid #dcdfe6;
  display: flex;
  align-items: center;
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
}
</style>