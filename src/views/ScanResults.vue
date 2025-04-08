<template>
  <div class="scan-results">
    <el-card shadow="hover">
      <template #header>
        <div class="card-header">
          <span>扫描结果列表</span>
          <el-button type="primary" @click="startScan">
            <el-icon><Plus /></el-icon>开始新扫描
          </el-button>
        </div>
      </template>

      <el-form :inline="true" class="search-form">
        <el-form-item label="目标地址">
          <el-input v-model="searchForm.target" placeholder="请输入目标地址" clearable />
        </el-form-item>
        <el-form-item label="扫描状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态" clearable>
            <el-option label="全部" value="" />
            <el-option label="进行中" value="running" />
            <el-option label="已完成" value="completed" />
            <el-option label="失败" value="failed" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">
            <el-icon><Search /></el-icon>搜索
          </el-button>
          <el-button @click="resetSearch">
            <el-icon><Refresh /></el-icon>重置
          </el-button>
        </el-form-item>
      </el-form>

      <el-table 
        :data="scanResults" 
        style="width: 100%" 
        v-loading="loading"
        border
      >
        <el-table-column prop="target" label="扫描目标" min-width="200" show-overflow-tooltip />
        <el-table-column prop="startTime" label="开始时间" width="180" />
        <el-table-column prop="endTime" label="结束时间" width="180" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)">
              {{ scope.row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="漏洞等级" width="280">
          <template #default="scope">
            <el-tag type="danger" v-if="scope.row.high > 0">高危 {{ scope.row.high }}</el-tag>
            <el-tag type="warning" class="ml-2" v-if="scope.row.medium > 0">中危 {{ scope.row.medium }}</el-tag>
            <el-tag type="info" class="ml-2" v-if="scope.row.low > 0">低危 {{ scope.row.low }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="scope">
            <el-button link type="primary" @click="viewReport(scope.row)">
              <el-icon><Document /></el-icon>查看报告
            </el-button>
            <el-button link type="primary" @click="exportReport(scope.row)">
              <el-icon><Download /></el-icon>导出报告
            </el-button>
          </template>
        </el-table-column>
      </el-table>

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
import { ref, reactive } from 'vue'
import { Plus, Search, Refresh, Document, Download } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'

const loading = ref(false)
const scanFormRef = ref<FormInstance>()

const searchForm = reactive({
  target: '',
  status: ''
})

const scanResults = ref([
  {
    target: 'https://example.com',
    startTime: '2024-02-10 14:30:00',
    endTime: '2024-02-10 15:30:00',
    status: '已完成',
    high: 2,
    medium: 3,
    low: 5
  },
  {
    target: 'https://test.com',
    startTime: '2024-02-10 13:15:00',
    endTime: '',
    status: '进行中',
    high: 1,
    medium: 1,
    low: 2
  }
])

const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(100)

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
    case '已完成':
      return 'success'
    case '进行中':
      return 'warning'
    case '失败':
      return 'danger'
    default:
      return 'info'
  }
}

const search = () => {
  loading.value = true
  // 模拟API调用
  setTimeout(() => {
    loading.value = false
    ElMessage.success('搜索完成')
  }, 1000)
}

const resetSearch = () => {
  searchForm.target = ''
  searchForm.status = ''
  search()
}

const startScan = () => {
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
        scanResults.value.unshift({
          target: scanForm.target,
          startTime: new Date().toLocaleString(),
          endTime: '',
          status: '进行中',
          high: 0,
          medium: 0,
          low: 0
        })
      }, 1500)
    }
  })
}

const viewReport = (row: any) => {
  ElMessage.info('查看报告功能开发中...')
}

const exportReport = (row: any) => {
  ElMessage.success('报告导出中...')
}

const handleSizeChange = (val: number) => {
  pageSize.value = val
  search()
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
  search()
}
</script>

<style scoped lang="scss">
.scan-results {
  .search-form {
    margin-bottom: 20px;
    .el-form-item {
      margin-bottom: 18px;
    }
  }

  .pagination {
    margin-top: 20px;
    text-align: right;
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .ml-2 {
    margin-left: 8px;
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