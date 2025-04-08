<template>
  <div class="assets">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>资产管理</span>
          <el-button type="primary" @click="addAsset">
            <el-icon><Plus /></el-icon>添加资产
          </el-button>
        </div>
      </template>

      <!-- 资产搜索表单 -->
      <el-form :inline="true" class="search-form">
        <el-form-item label="资产名称">
          <el-input v-model="searchForm.name" placeholder="输入资产名称" clearable />
        </el-form-item>
        <el-form-item label="资产类型">
          <el-select v-model="searchForm.type" placeholder="选择资产类型" clearable>
            <el-option label="Web应用" value="web" />
            <el-option label="API服务" value="api" />
            <el-option label="移动应用" value="mobile" />
            <el-option label="小程序" value="miniapp" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="选择状态" clearable>
            <el-option label="运行中" value="running" />
            <el-option label="已停止" value="stopped" />
            <el-option label="维护中" value="maintenance" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchAssets">
            <el-icon><Search /></el-icon>搜索
          </el-button>
          <el-button @click="resetSearch">
            <el-icon><Refresh /></el-icon>重置
          </el-button>
        </el-form-item>
      </el-form>

      <!-- 资产列表 -->
      <el-table :data="assets" style="width: 100%" v-loading="loading">
        <el-table-column type="expand">
          <template #default="props">
            <div class="asset-detail">
              <el-descriptions :column="2" border>
                <el-descriptions-item label="域名">
                  {{ props.row.domain }}
                </el-descriptions-item>
                <el-descriptions-item label="IP地址">
                  {{ props.row.ip }}
                </el-descriptions-item>
                <el-descriptions-item label="端口">
                  {{ props.row.ports.join(', ') }}
                </el-descriptions-item>
                <el-descriptions-item label="技术栈">
                  {{ props.row.technology }}
                </el-descriptions-item>
                <el-descriptions-item label="负责人">
                  {{ props.row.owner }}
                </el-descriptions-item>
                <el-descriptions-item label="联系方式">
                  {{ props.row.contact }}
                </el-descriptions-item>
                <el-descriptions-item label="备注" :span="2">
                  {{ props.row.notes }}
                </el-descriptions-item>
              </el-descriptions>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="资产名称" min-width="180" />
        <el-table-column prop="type" label="类型" width="120">
          <template #default="scope">
            <el-tag>{{ scope.row.type }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="domain" label="域名" min-width="180" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)">
              {{ scope.row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="lastScan" label="最近扫描" width="180" />
        <el-table-column label="操作" width="250" fixed="right">
          <template #default="scope">
            <el-button link type="primary" @click="startScan(scope.row)">
              <el-icon><VideoPlay /></el-icon>开始扫描
            </el-button>
            <el-button link type="primary" @click="editAsset(scope.row)">
              <el-icon><Edit /></el-icon>编辑
            </el-button>
            <el-button link type="danger" @click="deleteAsset(scope.row)">
              <el-icon><Delete /></el-icon>删除
            </el-button>
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

    <!-- 添加/编辑资产对话框 -->
    <el-dialog
      v-model="assetDialog.visible"
      :title="assetDialog.type === 'add' ? '添加资产' : '编辑资产'"
      width="700px"
    >
      <el-form
        :model="assetForm"
        :rules="assetRules"
        ref="assetFormRef"
        label-width="100px"
      >
        <el-form-item label="资产名称" prop="name">
          <el-input v-model="assetForm.name" placeholder="请输入资产名称" />
        </el-form-item>
        <el-form-item label="资产类型" prop="type">
          <el-select v-model="assetForm.type" placeholder="请选择资产类型">
            <el-option label="Web应用" value="web" />
            <el-option label="API服务" value="api" />
            <el-option label="移动应用" value="mobile" />
            <el-option label="小程序" value="miniapp" />
          </el-select>
        </el-form-item>
        <el-form-item label="域名" prop="domain">
          <el-input v-model="assetForm.domain" placeholder="请输入域名" />
        </el-form-item>
        <el-form-item label="IP地址" prop="ip">
          <el-input v-model="assetForm.ip" placeholder="请输入IP地址" />
        </el-form-item>
        <el-form-item label="开放端口" prop="ports">
          <el-select
            v-model="assetForm.ports"
            multiple
            filterable
            allow-create
            placeholder="请输入端口号"
          >
            <el-option label="80" value="80" />
            <el-option label="443" value="443" />
            <el-option label="8080" value="8080" />
            <el-option label="8443" value="8443" />
          </el-select>
        </el-form-item>
        <el-form-item label="技术栈" prop="technology">
          <el-input v-model="assetForm.technology" placeholder="请输入使用的技术栈" />
        </el-form-item>
        <el-form-item label="负责人" prop="owner">
          <el-input v-model="assetForm.owner" placeholder="请输入负责人姓名" />
        </el-form-item>
        <el-form-item label="联系方式" prop="contact">
          <el-input v-model="assetForm.contact" placeholder="请输入联系方式" />
        </el-form-item>
        <el-form-item label="备注" prop="notes">
          <el-input
            type="textarea"
            v-model="assetForm.notes"
            placeholder="请输入备注信息"
            rows="3"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="assetDialog.visible = false">取消</el-button>
          <el-button type="primary" @click="submitAsset(assetFormRef)">
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Search, Refresh, VideoPlay, Edit, Delete } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'
import { useRouter } from 'vue-router'
import api from '../api'
import type { Asset } from '../api/types'

const router = useRouter()
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const assets = ref<Asset[]>([])
const assetFormRef = ref<FormInstance>()

// 搜索表单
const searchForm = reactive({
  name: '',
  type: '',
  status: ''
})

// 资产表单
const assetForm = reactive({
  name: '',
  type: '',
  domain: '',
  ip: '',
  ports: [] as string[],
  technology: '',
  owner: '',
  contact: '',
  notes: '',
  status: 'running'
})

// 对话框状态
const assetDialog = reactive({
  visible: false,
  type: 'add'
})

// 表单验证规则
const assetRules: FormRules = {
  name: [
    { required: true, message: '请输入资产名称', trigger: 'blur' }
  ],
  type: [
    { required: true, message: '请选择资产类型', trigger: 'change' }
  ],
  domain: [
    { required: true, message: '请输入域名', trigger: 'blur' }
  ]
}

// 获取资产列表
const getAssets = async () => {
  loading.value = true
  try {
    const params = {
      name: searchForm.name || undefined,
      type: searchForm.type || undefined,
      status: searchForm.status || undefined,
      currentPage: currentPage.value,
      pageSize: pageSize.value
    }

    const response = await api.assets.getList(params)
    assets.value = response.data.items
    total.value = response.data.pagination.total
  } catch (error: any) {
    console.error('获取资产列表失败:', error)
    ElMessage.error('获取资产列表失败: ' + error.message)
  } finally {
    loading.value = false
  }
}

// 搜索资产
const searchAssets = () => {
  currentPage.value = 1
  getAssets()
}

// 重置搜索
const resetSearch = () => {
  searchForm.name = ''
  searchForm.type = ''
  searchForm.status = ''
  searchAssets()
}

// 添加资产
const addAsset = () => {
  assetDialog.type = 'add'
  assetDialog.visible = true
  // 重置表单
  Object.keys(assetForm).forEach(key => {
    if (key === 'ports') {
      assetForm[key] = []
    } else if (key === 'status') {
      assetForm[key] = 'running'
    } else {
      assetForm[key] = ''
    }
  })
}

// 编辑资产
const editAsset = (row: Asset) => {
  assetDialog.type = 'edit'
  assetDialog.visible = true
  // 填充表单数据
  Object.keys(assetForm).forEach(key => {
    if (key in row) {
      assetForm[key] = row[key]
    }
  })
}

// 提交资产表单
const submitAsset = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  
  await formEl.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        if (assetDialog.type === 'add') {
          await api.assets.create(assetForm)
          ElMessage.success('资产添加成功')
        } else {
          const editingAsset = assets.value.find(item => item.name === assetForm.name)
          if (editingAsset) {
            await api.assets.update(editingAsset.id, assetForm)
            ElMessage.success('资产更新成功')
          }
        }
        assetDialog.visible = false
        getAssets()
      } catch (error: any) {
        console.error('提交资产失败:', error)
        ElMessage.error('提交资产失败: ' + error.message)
      } finally {
        loading.value = false
      }
    }
  })
}

// 删除资产
const deleteAsset = (row: Asset) => {
  ElMessageBox.confirm(
    `确定要删除资产"${row.name}"吗?`,
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    loading.value = true
    try {
      await api.assets.delete(row.id)
      ElMessage.success('资产删除成功')
      getAssets()
    } catch (error: any) {
      console.error('删除资产失败:', error)
      ElMessage.error('删除资产失败: ' + error.message)
    } finally {
      loading.value = false
    }
  }).catch(() => {
    // 取消删除
  })
}

// 开始扫描
const startScan = (row: Asset) => {
  ElMessageBox.confirm(
    `确定要对"${row.name}"开始安全扫描吗?`,
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'info'
    }
  ).then(async () => {
    loading.value = true
    try {
      const options = {
        scanTypes: ['sql', 'xss', 'cmd'],
        depth: 2
      }
      await api.scans.startScan(row.id, options)
      ElMessage.success('扫描任务已创建')
      // 跳转到扫描结果页面
      router.push('/scan-results')
    } catch (error: any) {
      console.error('创建扫描任务失败:', error)
      ElMessage.error('创建扫描任务失败: ' + error.message)
    } finally {
      loading.value = false
    }
  }).catch(() => {
    // 取消扫描
  })
}

// 分页相关
const handleSizeChange = (val: number) => {
  pageSize.value = val
  getAssets()
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
  getAssets()
}

// 辅助函数
const getStatusType = (status: string) => {
  switch (status) {
    case 'running':
      return 'success'
    case 'maintenance':
      return 'warning'
    case 'stopped':
      return 'danger'
    default:
      return 'info'
  }
}

// 组件挂载时获取资产列表
onMounted(() => {
  getAssets()
})
</script>

<style scoped lang="scss">
.assets {
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .search-form {
    margin-bottom: 20px;
    .el-form-item {
      margin-bottom: 18px;
    }
  }

  .asset-detail {
    padding: 20px;
    background-color: #f8f9fa;
    margin: 10px;
    border-radius: 4px;
  }

  .pagination {
    margin-top: 20px;
    text-align: right;
  }
}

.dialog-footer {
  padding-top: 20px;
  text-align: right;
}
</style>