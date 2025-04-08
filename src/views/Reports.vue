<template>
  <div class="reports">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>漏洞分析报告</span>
          <div class="header-actions">
            <el-button type="primary" @click="generateReport">生成报告</el-button>
            <el-button @click="exportReport">导出报告</el-button>
          </div>
        </div>
      </template>

      <!-- 报告列表 -->
      <el-table :data="reports" style="width: 100%">
        <el-table-column prop="target" label="扫描目标" />
        <el-table-column prop="scanTime" label="扫描时间" width="180" />
        <el-table-column prop="vulnerabilities" label="漏洞数量" width="120">
          <template #default="scope">
            <el-tag type="danger" v-if="scope.row.high > 0">高危 {{ scope.row.high }}</el-tag>
            <el-tag type="warning" class="ml-2" v-if="scope.row.medium > 0">中危 {{ scope.row.medium }}</el-tag>
            <el-tag type="info" class="ml-2" v-if="scope.row.low > 0">低危 {{ scope.row.low }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)">
              {{ scope.row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="250">
          <template #default="scope">
            <el-button link type="primary" @click="viewReport(scope.row)">查看</el-button>
            <el-button link type="primary" @click="downloadReport(scope.row)">下载</el-button>
            <el-button link type="danger" @click="deleteReport(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :total="total"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 报告详情对话框 -->
    <el-dialog
      v-model="reportDialog.visible"
      :title="reportDialog.title"
      width="80%"
      class="report-dialog"
    >
      <div class="report-content" v-if="reportDialog.data">
        <!-- 报告头部 -->
        <div class="report-header">
          <h2>Web应用安全漏洞分析报告</h2>
          <div class="report-meta">
            <p><strong>扫描目标：</strong>{{ reportDialog.data.target }}</p>
            <p><strong>扫描时间：</strong>{{ reportDialog.data.scanTime }}</p>
            <p><strong>报告生成时间：</strong>{{ reportDialog.data.generateTime }}</p>
          </div>
        </div>

        <!-- 漏洞统计 -->
        <div class="vulnerability-stats">
          <h3>漏洞风险等级分布</h3>
          <div class="stats-cards">
            <el-card class="risk-card danger">
              <h4>高危漏洞</h4>
              <div class="number">{{ reportDialog.data.high }}</div>
            </el-card>
            <el-card class="risk-card warning">
              <h4>中危漏洞</h4>
              <div class="number">{{ reportDialog.data.medium }}</div>
            </el-card>
            <el-card class="risk-card info">
              <h4>低危漏洞</h4>
              <div class="number">{{ reportDialog.data.low }}</div>
            </el-card>
          </div>
        </div>

        <!-- 漏洞详情列表 -->
        <div class="vulnerability-details">
          <h3>漏洞详情</h3>
          <el-collapse v-model="activeVulnerabilities">
            <el-collapse-item
              v-for="vuln in reportDialog.data.vulnerabilities"
              :key="vuln.id"
              :title="vuln.name"
              :name="vuln.id"
            >
              <div class="vuln-detail">
                <p><strong>风险等级：</strong>
                  <el-tag :type="getRiskType(vuln.level)">{{ vuln.level }}</el-tag>
                </p>
                <p><strong>漏洞类型：</strong>{{ vuln.type }}</p>
                <p><strong>影响URL：</strong>{{ vuln.url }}</p>
                <p><strong>漏洞描述：</strong></p>
                <p class="description">{{ vuln.description }}</p>
                <p><strong>修复建议：</strong></p>
                <p class="suggestion">{{ vuln.suggestion }}</p>
              </div>
            </el-collapse-item>
          </el-collapse>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

interface Report {
  id: number
  target: string
  scanTime: string
  generateTime: string
  status: string
  high: number
  medium: number
  low: number
  vulnerabilities: Vulnerability[]
}

interface Vulnerability {
  id: number
  name: string
  level: string
  type: string
  url: string
  description: string
  suggestion: string
}

const reports = ref<Report[]>([
  {
    id: 1,
    target: 'https://example.com',
    scanTime: '2024-02-10 14:30:00',
    generateTime: '2024-02-10 15:00:00',
    status: '已完成',
    high: 2,
    medium: 3,
    low: 1,
    vulnerabilities: [
      {
        id: 1,
        name: 'SQL注入漏洞',
        level: '高危',
        type: 'SQL注入',
        url: 'https://example.com/api/users',
        description: '在用户查询接口发现SQL注入漏洞，可能导致未授权数据访问。',
        suggestion: '使用参数化查询，避免直接拼接SQL语句。'
      },
      {
        id: 2,
        name: 'XSS漏洞',
        level: '中危',
        type: 'XSS',
        url: 'https://example.com/search',
        description: '搜索功能存在反射型XSS漏洞。',
        suggestion: '对用户输入进行HTML转义，使用安全的模板引擎。'
      }
    ]
  }
])

const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(100)

const reportDialog = reactive({
  visible: false,
  title: '报告详情',
  data: null as Report | null
})

const activeVulnerabilities = ref([])

const getStatusType = (status: string) => {
  switch (status) {
    case '已完成':
      return 'success'
    case '生成中':
      return 'warning'
    case '失败':
      return 'danger'
    default:
      return 'info'
  }
}

const getRiskType = (level: string) => {
  switch (level) {
    case '高危':
      return 'danger'
    case '中危':
      return 'warning'
    case '低危':
      return 'info'
    default:
      return 'info'
  }
}

const generateReport = () => {
  // TODO: 实现生成报告功能
  ElMessage.success('开始生成报告')
}

const exportReport = () => {
  // TODO: 实现导出报告功能
  ElMessage.success('报告导出成功')
}

const viewReport = (report: Report) => {
  reportDialog.data = report
  reportDialog.visible = true
}

const downloadReport = (report: Report) => {
  // TODO: 实现下载报告功能
  ElMessage.success('报告下载成功')
}

const deleteReport = (report: Report) => {
  ElMessageBox.confirm('确定要删除该报告吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // TODO: 实现删除报告功能
    ElMessage.success('报告删除成功')
  }).catch(() => {})
}

const handleSizeChange = (val: number) => {
  pageSize.value = val
  // TODO: 重新加载数据
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
  // TODO: 重新加载数据
}
</script>

<style scoped>
.reports {
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .header-actions {
    .el-button {
      margin-left: 10px;
    }
  }

  .ml-2 {
    margin-left: 8px;
  }

  .pagination {
    margin-top: 20px;
    text-align: right;
  }
}

.report-dialog {
  .report-content {
    .report-header {
      text-align: center;
      margin-bottom: 30px;

      h2 {
        margin-bottom: 20px;
      }

      .report-meta {
        text-align: left;
        p {
          margin: 5px 0;
        }
      }
    }

    .vulnerability-stats {
      margin-bottom: 30px;

      h3 {
        margin-bottom: 20px;
      }

      .stats-cards {
        display: flex;
        justify-content: space-around;
        margin-bottom: 20px;

        .risk-card {
          width: 200px;
          text-align: center;

          h4 {
            margin: 0;
            color: #606266;
          }

          .number {
            font-size: 36px;
            font-weight: bold;
            margin-top: 10px;
          }

          &.danger .number {
            color: #f56c6c;
          }

          &.warning .number {
            color: #e6a23c;
          }

          &.info .number {
            color: #909399;
          }
        }
      }
    }

    .vulnerability-details {
      h3 {
        margin-bottom: 20px;
      }

      .vuln-detail {
        p {
          margin: 10px 0;
        }

        .description, .suggestion {
          color: #606266;
          line-height: 1.6;
          margin-left: 20px;
        }
      }
    }
  }
}
</style>