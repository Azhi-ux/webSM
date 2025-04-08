<template>
  <div class="dashboard">
    <el-row :gutter="20">
      <el-col :span="6" v-for="card in statsCards" :key="card.title">
        <el-card class="stats-card">
          <div class="stats-content">
            <h3>{{ card.title }}</h3>
            <div class="stats-number">{{ card.value }}</div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="chart-row">
      <el-col :span="12">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>漏洞风险等级分布</span>
            </div>
          </template>
          <Doughnut :data="vulnerabilityData" :options="chartOptions" />
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>漏洞类型分布</span>
            </div>
          </template>
          <Bar :data="vulnerabilityTypeData" :options="chartOptions" />
        </el-card>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="24">
        <el-card class="recent-scans">
          <template #header>
            <div class="card-header">
              <span>最近扫描任务</span>
              <el-button type="primary" @click="startNewScan">新建扫描</el-button>
            </div>
          </template>
          <el-table :data="recentScans" style="width: 100%">
            <el-table-column prop="target" label="扫描目标" />
            <el-table-column prop="startTime" label="开始时间" />
            <el-table-column prop="status" label="状态">
              <template #default="scope">
                <el-tag :type="getStatusType(scope.row.status)">
                  {{ scope.row.status }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="vulnerabilities" label="发现漏洞" />
            <el-table-column label="操作">
              <template #default="scope">
                <el-button link type="primary" @click="viewDetails(scope.row)">
                  查看详情
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Doughnut, Bar } from 'vue-chartjs'
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const statsCards = ref([
  { title: '总扫描次数', value: 156 },
  { title: '发现漏洞', value: 48 },
  { title: '已修复', value: 35 },
  { title: '待处理', value: 13 }
])

const vulnerabilityData = {
  labels: ['高危', '中危', '低危'],
  datasets: [{
    data: [15, 20, 13],
    backgroundColor: ['#f56c6c', '#e6a23c', '#67c23a']
  }]
}

const vulnerabilityTypeData = {
  labels: ['SQL注入', 'XSS', '命令注入', '文件包含', '文件上传', '其他'],
  datasets: [{
    label: '漏洞数量',
    data: [8, 12, 5, 7, 6, 10],
    backgroundColor: '#409eff'
  }]
}

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false
}

const recentScans = ref([
  {
    target: 'https://example.com',
    startTime: '2024-02-10 14:30',
    status: '完成',
    vulnerabilities: '3个'
  },
  {
    target: 'https://test.com',
    startTime: '2024-02-10 13:15',
    status: '进行中',
    vulnerabilities: '1个'
  }
])

const getStatusType = (status: string) => {
  switch (status) {
    case '完成':
      return 'success'
    case '进行中':
      return 'warning'
    default:
      return 'info'
  }
}

const startNewScan = () => {
  // TODO: 实现新建扫描功能
}

const viewDetails = (scan: any) => {
  // TODO: 实现查看详情功能
}
</script>

<style scoped>
.dashboard {
  .stats-card {
    margin-bottom: 20px;
    .stats-content {
      text-align: center;
      h3 {
        margin: 0;
        font-size: 16px;
        color: #606266;
      }
      .stats-number {
        font-size: 24px;
        font-weight: bold;
        color: #303133;
        margin-top: 10px;
      }
    }
  }

  .chart-row {
    margin-bottom: 20px;
    .el-card {
      height: 350px;
    }
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .recent-scans {
    margin-top: 20px;
  }
}
</style>