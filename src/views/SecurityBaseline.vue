<template>
  <div class="security-baseline">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>安全基线检查</span>
          <el-button type="primary" @click="startCheck">开始检查</el-button>
        </div>
      </template>

      <!-- 基线检查项目列表 -->
      <el-table :data="baselineItems" style="width: 100%">
        <el-table-column type="expand">
          <template #default="props">
            <div class="detail-box">
              <h4>检查详情：</h4>
              <p>{{ props.row.description }}</p>
              <h4>修复建议：</h4>
              <p>{{ props.row.suggestion }}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="category" label="检查类别" width="150" />
        <el-table-column prop="item" label="检查项" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)">
              {{ scope.row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="level" label="风险等级" width="100">
          <template #default="scope">
            <el-tag :type="getRiskType(scope.row.level)">
              {{ scope.row.level }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template #default="scope">
            <el-button link type="primary" @click="handleFix(scope.row)">
              修复
            </el-button>
            <el-button link type="primary" @click="showDetail(scope.row)">
              详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 系统配置检查 -->
    <el-card class="mt-20">
      <template #header>
        <div class="card-header">
          <span>系统配置检查</span>
        </div>
      </template>

      <el-collapse v-model="activeNames">
        <el-collapse-item title="操作系统安全配置" name="os">
          <el-progress :percentage="osSecurityScore" :color="getProgressColor" />
          <div class="check-items">
            <div v-for="item in osChecklist" :key="item.id" class="check-item">
              <el-icon :class="item.passed ? 'success' : 'danger'">
                <component :is="item.passed ? 'CircleCheck' : 'CircleClose'" />
              </el-icon>
              <span>{{ item.name }}</span>
            </div>
          </div>
        </el-collapse-item>

        <el-collapse-item title="Web服务器配置" name="web">
          <el-progress :percentage="webSecurityScore" :color="getProgressColor" />
          <div class="check-items">
            <div v-for="item in webChecklist" :key="item.id" class="check-item">
              <el-icon :class="item.passed ? 'success' : 'danger'">
                <component :is="item.passed ? 'CircleCheck' : 'CircleClose'" />
              </el-icon>
              <span>{{ item.name }}</span>
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>
    </el-card>

    <!-- 详情对话框 -->
    <el-dialog v-model="detailDialog.visible" :title="detailDialog.title" width="600px">
      <div v-if="detailDialog.data" class="detail-content">
        <h4>检查项：{{ detailDialog.data.item }}</h4>
        <p class="description">{{ detailDialog.data.description }}</p>
        <h4>当前配置：</h4>
        <el-input
          type="textarea"
          v-model="detailDialog.data.currentConfig"
          rows="4"
          readonly
        />
        <h4>建议配置：</h4>
        <el-input
          type="textarea"
          v-model="detailDialog.data.suggestedConfig"
          rows="4"
          readonly
        />
        <h4>修复建议：</h4>
        <p class="suggestion">{{ detailDialog.data.suggestion }}</p>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { CircleCheck, CircleClose } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

interface BaselineItem {
  id: number
  category: string
  item: string
  status: string
  level: string
  description: string
  suggestion: string
  currentConfig: string
  suggestedConfig: string
}

interface DetailDialogData {
  visible: boolean
  title: string
  data: BaselineItem | null
}

const baselineItems = ref<BaselineItem[]>([
  {
    id: 1,
    category: '操作系统',
    item: '密码策略检查',
    status: '未通过',
    level: '高危',
    description: '系统当前未设置密码最小长度要求和复杂度要求',
    suggestion: '设置密码最小长度为12位，必须包含大小写字母、数字和特殊字符',
    currentConfig: 'PASS_MIN_LEN=8\nPASS_COMPLEX=0',
    suggestedConfig: 'PASS_MIN_LEN=12\nPASS_COMPLEX=1'
  },
  {
    id: 2,
    category: 'Web服务器',
    item: 'SSL/TLS配置',
    status: '通过',
    level: '中危',
    description: 'SSL/TLS配置符合安全要求',
    suggestion: '建议定期更新SSL证书，并保持对新版本TLS的支持',
    currentConfig: 'ssl_protocols TLSv1.2 TLSv1.3;\nssl_ciphers HIGH:!aNULL:!MD5;',
    suggestedConfig: '当前配置已符合要求'
  },
  {
    id: 3,
    category: '数据库',
    item: '默认账户检查',
    status: '未通过',
    level: '高危',
    description: '发现数据库存在默认账户且密码为弱密码',
    suggestion: '删除或禁用默认账户，修改所有默认密码',
    currentConfig: 'root/password123',
    suggestedConfig: '禁用默认账户或设置强密码'
  }
])

const activeNames = ref(['os', 'web'])

const osChecklist = ref([
  { id: 1, name: '密码策略', passed: false },
  { id: 2, name: '文件权限', passed: true },
  { id: 3, name: '系统更新', passed: true },
  { id: 4, name: '防火墙配置', passed: false },
  { id: 5, name: '日志审计', passed: true }
])

const webChecklist = ref([
  { id: 1, name: 'SSL/TLS配置', passed: true },
  { id: 2, name: 'HTTP安全头', passed: false },
  { id: 3, name: '目录权限', passed: true },
  { id: 4, name: '版本隐藏', passed: true }
])

const detailDialog = reactive<DetailDialogData>({
  visible: false,
  title: '检查项详情',
  data: null
})

const osSecurityScore = computed(() => {
  const passed = osChecklist.value.filter(item => item.passed).length
  return Math.round((passed / osChecklist.value.length) * 100)
})

const webSecurityScore = computed(() => {
  const passed = webChecklist.value.filter(item => item.passed).length
  return Math.round((passed / webChecklist.value.length) * 100)
})

const getProgressColor = (percentage: number) => {
  if (percentage < 60) return '#f56c6c'
  if (percentage < 80) return '#e6a23c'
  return '#67c23a'
}

const getStatusType = (status: string) => {
  switch (status) {
    case '通过':
      return 'success'
    case '未通过':
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

const startCheck = () => {
  ElMessage.info('开始执行安全基线检查...')
}

const handleFix = (row: BaselineItem) => {
  ElMessage.info(`正在修复: ${row.item}`)
}

const showDetail = (row: BaselineItem) => {
  detailDialog.data = { ...row }
  detailDialog.visible = true
}
</script>

<style scoped lang="scss">
.security-baseline {
  .mt-20 {
    margin-top: 20px;
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .detail-box {
    padding: 20px;
    background-color: #f8f9fa;
    margin: 10px;
    border-radius: 4px;

    h4 {
      margin: 10px 0;
      color: #303133;
    }

    p {
      color: #606266;
      margin: 5px 0;
    }
  }

  .check-items {
    margin-top: 20px;

    .check-item {
      display: flex;
      align-items: center;
      margin-bottom: 10px;

      .el-icon {
        margin-right: 10px;
        font-size: 18px;

        &.success {
          color: #67c23a;
        }

        &.danger {
          color: #f56c6c;
        }
      }
    }
  }

  .detail-content {
    h4 {
      margin: 15px 0 10px;
      color: #303133;
    }

    .description, .suggestion {
      color: #606266;
      margin: 10px 0;
    }

    .el-input {
      margin: 10px 0;
    }
  }
}
</style>