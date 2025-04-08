<template>
  <div class="scan-results">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>扫描结果列表</span>
          <el-button type="primary" @click="startScan">开始新扫描</el-button>
        </div>
      </template>

      <el-form :inline="true" class="search-form">
        <el-form-item label="目标地址">
          <el-input v-model="searchForm.target" placeholder="请输入目标地址" />
        </el-form-item>
        <el-form-item label="扫描状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态">
            <el-option label="全部" value="" />
            <el-option label="进行中" value="running" />
            <el-option label="已完成" value="completed" />
            <el-option label="失败" value="failed" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">搜索</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="scanResults" style="width: 100%">
        <el-table-column prop="target" label="扫描目标" />
        <el-table-column prop="startTime" label="开始时间" width="180" />
        <el-table-column prop="endTime" label="结束时间" width="180" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)">
              {{ scope.row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="high" label="高危" width="80" />
        <el-table-column prop="medium" label="中危" width="80" />
        <el-table-column prop="low" label="低危" width="80" />
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-button link type="primary" @click="viewReport(scope.row)">
              查看报告
            </el-button>
            <el-button link type="primary" @click="exportReport(scope.row)">
              导出报告
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
      <el-form :model="scanForm" label-width="100px">
        <el-form-item label="目标地址">
          <el-input v-model="scanForm.target" placeholder="请输入要扫描的URL" />
        </el-form-item>
        <el-form-item label="扫描类型">
          <el-checkbox-group v-model="scanForm.scanTypes">
            <el-checkbox label="sql">SQL注入</el-checkbox>
            <el-checkbox label="xss">XSS</el-checkbox>
            <el-checkbox label="cmd">命令注入</el-checkbox>
            <el-checkbox label="file">文件包含</el-checkbox>
            <el-checkbox label="upload">文件上传</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="扫描深度">
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
          <el-button type="primary" @click="submitScan">开始扫描</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

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
  // TODO: 实现搜索功能
}

const resetSearch = () => {
  searchForm.target = ''
  searchForm.status = ''
  search()
}

const startScan = () => {
  scanDialog.visible = true
}

const submitScan = () => {
  // TODO: 实现提交扫描功能
  scanDialog.visible = false
}

const viewReport = (row: any) => {
  // TODO: 实现查看报告功能
}

const exportReport = (row: any) => {
  // TODO: 实现导出报告功能
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

<style scoped>
.scan-results {
  .search-form {
    margin-bottom: 20px;
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
}
</style>