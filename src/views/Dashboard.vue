<template>
  <div class="dashboard">
    <el-row :gutter="20">
      <el-col :span="6" v-for="card in statsCards" :key="card.title">
        <el-card class="stats-card" shadow="hover">
          <div class="stats-content">
            <h3>{{ card.title }}</h3>
            <div class="stats-number">{{ card.value }}</div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="chart-row">
      <el-col :span="12">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>漏洞风险等级分布</span>
            </div>
          </template>
          <div style="height: 300px">
            <Doughnut :data="vulnerabilityData" :options="chartOptions" />
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>漏洞类型分布</span>
            </div>
          </template>
          <div style="height: 300px">
            <Bar :data="vulnerabilityTypeData" :options="chartOptions" />
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="24">
        <el-card class="recent-scans" shadow="hover">
          <template #header>
            <div class="card-header">
              <span>最近扫描任务</span>
              <el-button type="primary" @click="startNewScan">
                <el-icon><Plus /></el-icon>新建扫描
              </el-button>
            </div>
          </template>
          <el-table :data="recentScans" style="width: 100%" v-loading="loading">
            <el-table-column prop="target" label="扫描目标" min-width="200" />
            <el-table-column prop="startTime" label="开始时间" width="160" />
            <el-table-column prop="status" label="状态" width="100">
              <template #default="scope">
                <el-tag :type="getStatusType(scope.row.status)">
                  {{ scope.row.status }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="vulnerabilities" label="发现漏洞" width="100" />
            <el-table-column label="操作" width="120" fixed="right">
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

    <!-- 新建扫描对话框 -->
    <el-dialog v-model="scanDialog.visible" title="新建扫描" width="500px">
      <el-form :model="scanForm" :rules="scanRules" ref="scanFormRef" label-width="100px">
        <el-form-item label="目标地址" prop="target">
          <el-input v-model="scanForm.target" placeholder="请输入要扫描的URL" />
        </el-form-item>
        <el-form-item label="扫描类型" prop="scanTypes">
          <el-checkbox-group v-model="scanForm.scanTypes">
            <el-checkbox label="sql">SQL注入</el-checkbox>
            <el-checkbox label="xss">XSS</el-checkbox>
            <el-checkbox label="cmd">命令注入</el-checkbox>
            <el-checkbox label="file">文件包含</el-checkbox>
            <el-checkbox label="upload">文件上传</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="扫描深度" prop="depth">
          <el-radio-group v-model="scanForm.depth">
            <el-radio label="1">快速扫描</el-radio>
            <el-radio label="2">标准扫描</el-radio>
            <el-radio label="3">深度扫描</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="scanDialog.visible = false">取消</el-button>
          <el-button type="primary" @click="submitScan(scanFormRef)">开始扫描</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { Doughnut, Bar } from 'vue-chartjs'
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'

// 注册Chart.js组件
ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

// 添加错误处理
onMounted(() => {
  try {
    console.log('Dashboard component mounted')
  } catch (error) {
    console.error('Dashboard mount error:', error)
  }
})

const loading = ref(false)
const scanFormRef = ref<FormInstance>()

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
    backgroundColor: ['#f56c6c', '#e6a23c', '#67c23a'],
    borderWidth: 0
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
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom' as const
    }
  }
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

const scanDialog = reactive({
  visible: false
})

const scanForm = reactive({
  target: '',
  scanTypes: [],
  depth: '1'
})

const scanRules: FormRules = {
  target: [
    { required: true, message: '请输入目标地址', trigger: 'blur' },
    { type: 'url', message: '请输入有效的URL地址', trigger: 'blur' }
  ],
  scanTypes: [
    { type: 'array', required: true, message: '请至少选择一种扫描类型', trigger: 'change' }
  ],
  depth: [
    { required: true, message: '请选择扫描深度', trigger: 'change' }
  ]
}

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
  scanDialog.visible = true
}

const submitScan = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  
  await formEl.validate((valid) => {
    if (valid) {
      loading.value = true
      // 模拟API调用
      setTimeout(() => {
        loading.value = false
        scanDialog.visible = false
        ElMessage.success('扫描任务已创建')
        // 重置表单
        formEl.resetFields()
        // 添加新的扫描记录
        recentScans.value.unshift({
          target: scanForm.target,
          startTime: new Date().toLocaleString(),
          status: '进行中',
          vulnerabilities: '0个'
        })
      }, 1500)
    }
  })
}

const viewDetails = (scan: any) => {
  ElMessage.info('查看详情功能开发中...')
}
</script>

<style scoped lang="scss">
.dashboard {
  .stats-card {
    margin-bottom: 20px;
    transition: all 0.3s;
    
    &:hover {
      transform: translateY(-5px);
    }
    
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
    margin: 20px 0;
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

  :deep(.el-card__body) {
    padding: 20px;
  }

  :deep(.el-table) {
    border-radius: 4px;
    overflow: hidden;
  }
}

.dialog-footer {
  padding-top: 20px;
  text-align: right;
}
</style>