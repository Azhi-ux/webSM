import axios, { AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { mockData } from './mockData'
import type {
  ApiResponse,
  User,
  AuthResponse,
  Asset,
  Vulnerability,
  ScanTask,
  ScanResult,
  SecurityBaseline,
  BaselineCheck,
  Report,
  DashboardSummary,
  VulnerabilityStats,
  AssetStats
} from './types'

// 创建axios实例
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器 - 添加认证token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('auth-token')
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error: any) => {
    return Promise.reject(error)
  }
)

// 响应拦截器 - 处理常见错误
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: any) => {
    const { response } = error
    if (response && response.status === 401) {
      // 处理未授权错误
      localStorage.removeItem('auth-token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// 判断是否为开发环境
const isDev = import.meta.env.DEV

// API请求函数
const api = {
  // 用户认证相关
  auth: {
    login: (email: string, password: string) => {
      if (isDev) {
        return Promise.resolve(mockData.auth.login(email, password))
      }
      return apiClient.post<ApiResponse<AuthResponse>>('/auth/login', { email, password })
    },
    register: (email: string, password: string) => {
      if (isDev) {
        return Promise.resolve(mockData.auth.register(email, password))
      }
      return apiClient.post<ApiResponse<{ message: string; user: User }>>('/auth/register', { email, password })
    },
    logout: () => {
      if (isDev) {
        return Promise.resolve(mockData.auth.logout())
      }
      return apiClient.post<ApiResponse<{ message: string }>>('/auth/logout')
    },
    getProfile: () => {
      if (isDev) {
        return Promise.resolve(mockData.auth.getProfile())
      }
      return apiClient.get<ApiResponse<User>>('/auth/profile')
    }
  },

  // 资产管理相关
  assets: {
    getList: (params: any) => {
      if (isDev) {
        return Promise.resolve(mockData.assets.getList(params))
      }
      return apiClient.get<ApiResponse<{ items: Asset[]; pagination: any }>>('/assets', { params })
    },
    getById: (id: number) => {
      if (isDev) {
        return Promise.resolve(mockData.assets.getById(id))
      }
      return apiClient.get<ApiResponse<Asset>>(`/assets/${id}`)
    },
    create: (data: Partial<Asset>) => {
      if (isDev) {
        return Promise.resolve(mockData.assets.create(data))
      }
      return apiClient.post<ApiResponse<Asset>>('/assets', data)
    },
    update: (id: number, data: Partial<Asset>) => {
      if (isDev) {
        return Promise.resolve(mockData.assets.update(id, data))
      }
      return apiClient.put<ApiResponse<Asset>>(`/assets/${id}`, data)
    },
    delete: (id: number) => {
      if (isDev) {
        return Promise.resolve(mockData.assets.delete(id))
      }
      return apiClient.delete<ApiResponse<{ message: string }>>(`/assets/${id}`)
    }
  },

  // 漏洞库相关
  vulnerabilities: {
    getList: (params: any) => {
      if (isDev) {
        return Promise.resolve(mockData.vulnerabilities.getList(params))
      }
      return apiClient.get<ApiResponse<{ items: Vulnerability[]; pagination: any }>>('/vulnerabilities', { params })
    },
    getById: (id: string) => {
      if (isDev) {
        return Promise.resolve(mockData.vulnerabilities.getById(id))
      }
      return apiClient.get<ApiResponse<Vulnerability>>(`/vulnerabilities/${id}`)
    },
    create: (data: Partial<Vulnerability>) => {
      if (isDev) {
        return Promise.resolve(mockData.vulnerabilities.create(data))
      }
      return apiClient.post<ApiResponse<Vulnerability>>('/vulnerabilities', data)
    },
    update: (id: string, data: Partial<Vulnerability>) => {
      if (isDev) {
        return Promise.resolve(mockData.vulnerabilities.update(id, data))
      }
      return apiClient.put<ApiResponse<Vulnerability>>(`/vulnerabilities/${id}`, data)
    },
    delete: (id: string) => {
      if (isDev) {
        return Promise.resolve(mockData.vulnerabilities.delete(id))
      }
      return apiClient.delete<ApiResponse<{ message: string }>>(`/vulnerabilities/${id}`)
    },
    updateDatabase: () => {
      if (isDev) {
        return Promise.resolve(mockData.vulnerabilities.updateDatabase())
      }
      return apiClient.post<ApiResponse<{ message: string; updatedCount: number; newCount: number; timestamp: string }>>('/vulnerabilities/update-database')
    }
  },

  // 扫描任务相关
  scans: {
    getList: (params: any) => {
      if (isDev) {
        return Promise.resolve(mockData.scans.getList(params))
      }
      return apiClient.get<ApiResponse<{ items: ScanTask[]; pagination: any }>>('/scans', { params })
    },
    getById: (id: number) => {
      if (isDev) {
        return Promise.resolve(mockData.scans.getById(id))
      }
      return apiClient.get<ApiResponse<ScanTask>>(`/scans/${id}`)
    },
    create: (data: Partial<ScanTask>) => {
      if (isDev) {
        return Promise.resolve(mockData.scans.create(data))
      }
      return apiClient.post<ApiResponse<ScanTask>>('/scans', data)
    },
    startScan: (assetId: number, options: any) => {
      if (isDev) {
        return Promise.resolve(mockData.scans.startScan(assetId, options))
      }
      return apiClient.post<ApiResponse<ScanTask>>(`/scans/asset/${assetId}`, options)
    },
    cancelScan: (id: number) => {
      if (isDev) {
        return Promise.resolve(mockData.scans.cancelScan(id))
      }
      return apiClient.post<ApiResponse<{ message: string; scan: ScanTask }>>(`/scans/${id}/cancel`)
    },
    getResults: (id: number) => {
      if (isDev) {
        return Promise.resolve(mockData.scans.getResults(id))
      }
      return apiClient.get<ApiResponse<{ items: ScanResult[]; scanInfo: ScanTask; message?: string }>>(`/scans/${id}/results`)
    }
  },

  // 安全基线相关
  securityBaselines: {
    getList: (params: any) => {
      if (isDev) {
        return Promise.resolve(mockData.securityBaselines.getList(params))
      }
      return apiClient.get<ApiResponse<{ items: SecurityBaseline[]; pagination: any }>>('/security-baselines', { params })
    },
    getById: (id: number) => {
      if (isDev) {
        return Promise.resolve(mockData.securityBaselines.getById(id))
      }
      return apiClient.get<ApiResponse<SecurityBaseline>>(`/security-baselines/${id}`)
    },
    create: (data: Partial<SecurityBaseline>) => {
      if (isDev) {
        return Promise.resolve(mockData.securityBaselines.create(data))
      }
      return apiClient.post<ApiResponse<SecurityBaseline>>('/security-baselines', data)
    },
    update: (id: number, data: Partial<SecurityBaseline>) => {
      if (isDev) {
        return Promise.resolve(mockData.securityBaselines.update(id, data))
      }
      return apiClient.put<ApiResponse<SecurityBaseline>>(`/security-baselines/${id}`, data)
    },
    delete: (id: number) => {
      if (isDev) {
        return Promise.resolve(mockData.securityBaselines.delete(id))
      }
      return apiClient.delete<ApiResponse<{ message: string }>>(`/security-baselines/${id}`)
    },
    runCheck: (assetId: number, baselineId: number) => {
      if (isDev) {
        return Promise.resolve(mockData.securityBaselines.runCheck(assetId, baselineId))
      }
      return apiClient.post<ApiResponse<BaselineCheck>>(`/security-baselines/check`, { assetId, baselineId })
    },
    getCheckResults: (checkId: number) => {
      if (isDev) {
        return Promise.resolve(mockData.securityBaselines.getCheckResults(checkId))
      }
      return apiClient.get<ApiResponse<BaselineCheck>>(`/security-baselines/check/${checkId}`)
    }
  },

  // 报告相关
  reports: {
    getList: (params: any) => {
      if (isDev) {
        return Promise.resolve(mockData.reports.getList(params))
      }
      return apiClient.get<ApiResponse<{ items: Report[]; pagination: any }>>('/reports', { params })
    },
    getById: (id: number) => {
      if (isDev) {
        return Promise.resolve(mockData.reports.getById(id))
      }
      return apiClient.get<ApiResponse<Report>>(`/reports/${id}`)
    },
    createScanReport: (scanId: number) => {
      if (isDev) {
        return Promise.resolve(mockData.reports.createScanReport(scanId))
      }
      return apiClient.post<ApiResponse<Report>>(`/reports/scan/${scanId}`)
    },
    createBaselineReport: (checkId: number) => {
      if (isDev) {
        return Promise.resolve(mockData.reports.createBaselineReport(checkId))
      }
      return apiClient.post<ApiResponse<Report>>(`/reports/baseline/${checkId}`)
    },
    exportReport: (id: number, format: string = 'pdf') => {
      if (isDev) {
        return Promise.resolve(mockData.reports.exportReport(id, format))
      }
      return apiClient.get<ApiResponse<{ url: string; filename: string; message: string }>>(`/reports/${id}/export?format=${format}`, {
        responseType: 'blob'
      } as any)
    }
  },

  // 仪表盘数据
  dashboard: {
    getSummary: () => {
      if (isDev) {
        return Promise.resolve(mockData.dashboard.getSummary())
      }
      return apiClient.get<ApiResponse<DashboardSummary>>('/dashboard/summary')
    },
    getVulnerabilityStats: () => {
      if (isDev) {
        return Promise.resolve(mockData.dashboard.getVulnerabilityStats())
      }
      return apiClient.get<ApiResponse<VulnerabilityStats>>('/dashboard/vulnerability-stats')
    },
    getRecentScans: () => {
      if (isDev) {
        return Promise.resolve(mockData.dashboard.getRecentScans())
      }
      return apiClient.get<ApiResponse<(ScanTask & { assetName: string })[]>>('/dashboard/recent-scans')
    },
    getAssetStats: () => {
      if (isDev) {
        return Promise.resolve(mockData.dashboard.getAssetStats())
      }
      return apiClient.get<ApiResponse<AssetStats>>('/dashboard/asset-stats')
    }
  }
}

export default api 