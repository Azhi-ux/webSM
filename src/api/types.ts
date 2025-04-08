// 通用类型
export interface Pagination {
  total: number;
  currentPage: number;
  pageSize: number;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

// 用户相关类型
export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string | null;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// 资产相关类型
export type AssetType = 'web' | 'api' | 'mobile' | 'miniapp';
export type AssetStatus = 'running' | 'stopped' | 'maintenance';

export interface Asset {
  id: number;
  name: string;
  type: AssetType;
  domain: string;
  ip: string;
  ports: string[];
  technology: string;
  owner: string;
  contact: string;
  status: AssetStatus;
  lastScan: string | null;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

// 漏洞相关类型
export type VulnerabilityType = 'sql' | 'xss' | 'cmd' | 'file' | 'upload';
export type RiskLevel = 'high' | 'medium' | 'low' | 'info';

export interface Vulnerability {
  id: string;
  name: string;
  type: VulnerabilityType;
  risk: RiskLevel;
  description: string;
  affects: string;
  solution: string;
  references: string[];
  updateTime: string;
}

// 扫描任务相关类型
export type ScanStatus = 'pending' | 'running' | 'completed' | 'failed';

export interface ScanTask {
  id: number;
  target: string;
  scanTypes: VulnerabilityType[];
  depth: number;
  status: ScanStatus;
  startTime: string | null;
  endTime: string | null;
  assetId: number;
  high: number;
  medium: number;
  low: number;
  createdBy: string;
}

export interface ScanResult {
  id: number;
  scanTaskId: number;
  vulnerabilityId: string;
  url: string;
  parameter: string;
  risk: RiskLevel;
  description: string;
  proof: string;
  fixSuggestion: string;
}

// 安全基线相关类型
export interface BaselineCheckItem {
  id: string;
  name: string;
  description: string;
}

export interface SecurityBaseline {
  id: number;
  name: string;
  category: string;
  description: string;
  checkItems: BaselineCheckItem[];
  createdAt: string;
  updatedAt: string;
}

export interface BaselineCheckResult {
  itemId: string;
  passed: boolean;
  details: string;
}

export interface BaselineCheck {
  id: number;
  assetId: number;
  baselineId: number;
  status: ScanStatus;
  result: BaselineCheckResult[];
  score: number;
  startTime: string;
  endTime: string | null;
  createdBy: string;
  baselineName?: string;
  assetName?: string;
}

// 报告相关类型
export type ReportType = 'scan' | 'baseline' | 'custom';

export interface Report {
  id: number;
  title: string;
  type: ReportType;
  scanTaskId: number | null;
  baselineCheckId: number | null;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  content?: any;
}

// 仪表盘相关类型
export interface DashboardSummary {
  assets: {
    total: number;
    running: number;
    maintenance: number;
    stopped: number;
  };
  vulnerabilities: {
    total: number;
    high: number;
    medium: number;
    low: number;
  };
  scans: {
    total: number;
    pending: number;
    running: number;
    completed: number;
    failed: number;
  };
  reports: number;
}

export interface ChartData {
  name: string;
  value: number;
}

export interface TrendData {
  date: string;
  high: number;
  medium: number;
  low: number;
}

export interface VulnerabilityStats {
  byRisk: ChartData[];
  byType: ChartData[];
  trend: TrendData[];
}

export interface AssetRiskInfo {
  id: number;
  name: string;
  type: AssetType;
  highRisk: number;
  mediumRisk: number;
  lowRisk: number;
  totalRisk: number;
}

export interface AssetStats {
  byType: ChartData[];
  byStatus: ChartData[];
  mostVulnerable: AssetRiskInfo[];
} 