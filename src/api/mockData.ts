// 定义通用类型接口
interface Pagination {
  total: number;
  currentPage: number;
  pageSize: number;
}

// 身份验证相关的mock数据
const authMockData = {
  login: (email: string, password: string) => {
    // 简单验证：邮箱不为空且密码长度大于6
    if (email && password.length >= 6) {
      return {
        data: {
          token: 'mock-token-xyz',
          user: {
            id: 'mock-user-id',
            email,
            name: '测试用户',
            avatar: null
          }
        }
      };
    } else {
      throw new Error('邮箱或密码不正确');
    }
  },
  register: (email: string, password: string) => {
    return {
      data: {
        message: '注册成功',
        user: {
          id: 'new-user-id',
          email,
          createdAt: new Date().toISOString()
        }
      }
    };
  },
  logout: () => {
    return {
      data: {
        message: '退出成功'
      }
    };
  },
  getProfile: () => {
    return {
      data: {
        id: 'mock-user-id',
        email: 'test@example.com',
        name: '测试用户',
        avatar: null,
        createdAt: '2024-01-15T08:30:00Z'
      }
    };
  }
};

// 资产相关的mock数据
const assetsMockData = {
  // 模拟资产列表数据
  list: [
    {
      id: 1,
      name: '公司官网',
      type: 'web',
      domain: 'www.example.com',
      ip: '192.168.1.100',
      ports: ['80', '443'],
      technology: 'Vue, Node.js',
      owner: '张三',
      contact: 'zhangsan@example.com',
      status: 'running',
      lastScan: '2024-03-15 10:30:00',
      notes: '公司主要官方网站',
      createdAt: '2024-01-10T08:00:00Z',
      updatedAt: '2024-03-15T10:30:00Z'
    },
    {
      id: 2,
      name: '用户管理系统',
      type: 'web',
      domain: 'user.example.com',
      ip: '192.168.1.101',
      ports: ['80', '443', '8080'],
      technology: 'React, Spring Boot',
      owner: '李四',
      contact: 'lisi@example.com',
      status: 'running',
      lastScan: '2024-03-10 14:20:00',
      notes: '内部用户管理系统',
      createdAt: '2024-01-15T09:00:00Z',
      updatedAt: '2024-03-10T14:20:00Z'
    },
    {
      id: 3,
      name: '移动端APP',
      type: 'mobile',
      domain: 'api.example.com',
      ip: '192.168.1.102',
      ports: ['443'],
      technology: 'Flutter, Node.js',
      owner: '王五',
      contact: 'wangwu@example.com',
      status: 'maintenance',
      lastScan: '2024-02-28 09:15:00',
      notes: '公司移动应用',
      createdAt: '2024-02-01T10:00:00Z',
      updatedAt: '2024-02-28T09:15:00Z'
    },
    {
      id: 4,
      name: '支付API',
      type: 'api',
      domain: 'pay.example.com',
      ip: '192.168.1.103',
      ports: ['443', '8443'],
      technology: 'Spring Boot, MySQL',
      owner: '赵六',
      contact: 'zhaoliu@example.com',
      status: 'running',
      lastScan: '2024-03-01 16:45:00',
      notes: '支付相关API服务',
      createdAt: '2024-01-20T11:00:00Z',
      updatedAt: '2024-03-01T16:45:00Z'
    },
    {
      id: 5,
      name: '小程序商城',
      type: 'miniapp',
      domain: 'miniapp.example.com',
      ip: '192.168.1.104',
      ports: ['80', '443'],
      technology: 'UniApp, Express',
      owner: '钱七',
      contact: 'qianqi@example.com',
      status: 'stopped',
      lastScan: '2024-02-25 11:30:00',
      notes: '微信小程序商城',
      createdAt: '2024-02-10T13:00:00Z',
      updatedAt: '2024-02-25T11:30:00Z'
    }
  ],

  // 获取资产列表
  getList: (params: any) => {
    let result = [...assetsMockData.list];
    
    // 根据参数筛选
    if (params) {
      if (params.name) {
        result = result.filter(item => 
          item.name.toLowerCase().includes(params.name.toLowerCase())
        );
      }
      if (params.type) {
        result = result.filter(item => item.type === params.type);
      }
      if (params.status) {
        result = result.filter(item => item.status === params.status);
      }
    }
    
    // 分页
    const currentPage = params?.currentPage || 1;
    const pageSize = params?.pageSize || 10;
    const total = result.length;
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedItems = result.slice(startIndex, endIndex);
    
    return {
      data: {
        items: paginatedItems,
        pagination: {
          total,
          currentPage,
          pageSize
        }
      }
    };
  },

  // 获取单个资产
  getById: (id: number) => {
    const asset = assetsMockData.list.find(item => item.id === id);
    if (asset) {
      return {
        data: asset
      };
    }
    throw new Error('资产不存在');
  },

  // 创建资产
  create: (data: any) => {
    const newId = Math.max(...assetsMockData.list.map(a => a.id)) + 1;
    const now = new Date().toISOString();
    const newAsset = {
      id: newId,
      ...data,
      createdAt: now,
      updatedAt: now
    };
    assetsMockData.list.push(newAsset);
    return {
      data: newAsset
    };
  },

  // 更新资产
  update: (id: number, data: any) => {
    const index = assetsMockData.list.findIndex(item => item.id === id);
    if (index !== -1) {
      const now = new Date().toISOString();
      const updatedAsset = {
        ...assetsMockData.list[index],
        ...data,
        updatedAt: now
      };
      assetsMockData.list[index] = updatedAsset;
      return {
        data: updatedAsset
      };
    }
    throw new Error('资产不存在');
  },

  // 删除资产
  delete: (id: number) => {
    const index = assetsMockData.list.findIndex(item => item.id === id);
    if (index !== -1) {
      assetsMockData.list.splice(index, 1);
      return {
        data: {
          message: '删除成功'
        }
      };
    }
    throw new Error('资产不存在');
  }
};

// 漏洞库相关的mock数据
const vulnerabilitiesMockData = {
  // 模拟漏洞列表数据
  list: [
    {
      id: 'CVE-2024-1001',
      name: 'SQL注入漏洞',
      type: 'sql',
      risk: 'high',
      description: '由于未对用户输入进行适当的过滤和验证，攻击者可能通过构造特殊的SQL语句来操作数据库。',
      affects: '影响使用原生SQL查询的Web应用程序，尤其是未使用参数化查询的应用。',
      solution: '使用参数化查询或预处理语句；对用户输入进行严格验证和过滤；使用最小权限原则配置数据库账户。',
      references: [
        'https://owasp.org/www-community/attacks/SQL_Injection',
        'https://portswigger.net/web-security/sql-injection'
      ],
      updateTime: '2024-03-01 09:30:00'
    },
    {
      id: 'CVE-2024-1002',
      name: 'XSS跨站脚本攻击',
      type: 'xss',
      risk: 'medium',
      description: '允许攻击者将恶意脚本注入到网页中，当其他用户浏览该页面时，脚本会在用户的浏览器中执行。',
      affects: '影响未正确过滤用户输入的Web应用程序，特别是允许HTML内容提交的应用。',
      solution: '对所有用户输入进行适当的HTML编码；使用内容安全策略(CSP)；实施输入验证和输出编码。',
      references: [
        'https://owasp.org/www-community/attacks/xss/',
        'https://portswigger.net/web-security/cross-site-scripting'
      ],
      updateTime: '2024-03-05 14:20:00'
    },
    {
      id: 'CVE-2024-1003',
      name: '命令注入漏洞',
      type: 'cmd',
      risk: 'high',
      description: '允许攻击者通过Web应用程序执行操作系统命令，可能导致服务器被完全控制。',
      affects: '影响将用户输入直接传递给系统命令的应用程序，常见于执行shell命令的Web功能。',
      solution: '避免使用系统命令；如必须使用，则严格验证和过滤用户输入；使用安全API而非直接执行命令。',
      references: [
        'https://owasp.org/www-community/attacks/Command_Injection',
        'https://cheatsheetseries.owasp.org/cheatsheets/OS_Command_Injection_Defense_Cheat_Sheet.html'
      ],
      updateTime: '2024-02-28 11:45:00'
    },
    {
      id: 'CVE-2024-1004',
      name: '文件包含漏洞',
      type: 'file',
      risk: 'medium',
      description: '允许攻击者包含本地或远程文件，可能导致敏感信息泄露、代码执行等。',
      affects: '影响动态包含文件的Web应用程序，特别是PHP应用中使用include或require的场景。',
      solution: '避免将用户输入用于文件路径；使用白名单验证文件路径；禁用远程文件包含功能。',
      references: [
        'https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/07-Input_Validation_Testing/11.1-Testing_for_Local_File_Inclusion',
        'https://portswigger.net/web-security/file-path-traversal'
      ],
      updateTime: '2024-03-10 16:30:00'
    },
    {
      id: 'CVE-2024-1005',
      name: '不安全的文件上传',
      type: 'upload',
      risk: 'high',
      description: '允许攻击者上传恶意文件（如包含WebShell的PHP文件），从而在服务器上执行任意代码。',
      affects: '影响具有文件上传功能且验证不充分的Web应用程序。',
      solution: '验证文件类型、大小和内容；重命名上传文件；将上传文件存储在Web根目录之外；使用不同域名提供上传文件。',
      references: [
        'https://owasp.org/www-community/vulnerabilities/Unrestricted_File_Upload',
        'https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html'
      ],
      updateTime: '2024-02-15 10:15:00'
    }
  ],

  // 获取漏洞列表
  getList: (params: any) => {
    let result = [...vulnerabilitiesMockData.list];
    
    // 根据参数筛选
    if (params) {
      if (params.name) {
        result = result.filter(item => 
          item.name.toLowerCase().includes(params.name.toLowerCase())
        );
      }
      if (params.type) {
        result = result.filter(item => item.type === params.type);
      }
      if (params.risk) {
        result = result.filter(item => item.risk === params.risk);
      }
    }
    
    // 分页
    const currentPage = params?.currentPage || 1;
    const pageSize = params?.pageSize || 10;
    const total = result.length;
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedItems = result.slice(startIndex, endIndex);
    
    return {
      data: {
        items: paginatedItems,
        pagination: {
          total,
          currentPage,
          pageSize
        }
      }
    };
  },

  // 获取单个漏洞
  getById: (id: string) => {
    const vulnerability = vulnerabilitiesMockData.list.find(item => item.id === id);
    if (vulnerability) {
      return {
        data: vulnerability
      };
    }
    throw new Error('漏洞不存在');
  },

  // 创建漏洞
  create: (data: any) => {
    const id = `CVE-2024-${1000 + vulnerabilitiesMockData.list.length + 1}`;
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const newVulnerability = {
      id,
      ...data,
      updateTime: now
    };
    vulnerabilitiesMockData.list.push(newVulnerability);
    return {
      data: newVulnerability
    };
  },

  // 更新漏洞
  update: (id: string, data: any) => {
    const index = vulnerabilitiesMockData.list.findIndex(item => item.id === id);
    if (index !== -1) {
      const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
      const updatedVulnerability = {
        ...vulnerabilitiesMockData.list[index],
        ...data,
        updateTime: now
      };
      vulnerabilitiesMockData.list[index] = updatedVulnerability;
      return {
        data: updatedVulnerability
      };
    }
    throw new Error('漏洞不存在');
  },

  // 删除漏洞
  delete: (id: string) => {
    const index = vulnerabilitiesMockData.list.findIndex(item => item.id === id);
    if (index !== -1) {
      vulnerabilitiesMockData.list.splice(index, 1);
      return {
        data: {
          message: '删除成功'
        }
      };
    }
    throw new Error('漏洞不存在');
  },

  // 更新漏洞库
  updateDatabase: () => {
    return {
      data: {
        message: '漏洞库已更新',
        updatedCount: 15,
        newCount: 5,
        timestamp: new Date().toISOString()
      }
    };
  }
};

// 扫描任务相关的mock数据
const scansMockData = {
  // 模拟扫描任务列表数据
  list: [
    {
      id: 1,
      target: 'https://www.example.com',
      scanTypes: ['sql', 'xss', 'cmd'],
      depth: 2,
      status: 'completed',
      startTime: '2024-03-15 10:00:00',
      endTime: '2024-03-15 10:30:00',
      assetId: 1,
      high: 2,
      medium: 3,
      low: 5,
      createdBy: 'mock-user-id'
    },
    {
      id: 2,
      target: 'https://user.example.com',
      scanTypes: ['sql', 'xss'],
      depth: 1,
      status: 'running',
      startTime: '2024-03-16 14:00:00',
      endTime: null,
      assetId: 2,
      high: 1,
      medium: 1,
      low: 2,
      createdBy: 'mock-user-id'
    },
    {
      id: 3,
      target: 'https://api.example.com',
      scanTypes: ['sql', 'cmd'],
      depth: 3,
      status: 'pending',
      startTime: null,
      endTime: null,
      assetId: 3,
      high: 0,
      medium: 0,
      low: 0,
      createdBy: 'mock-user-id'
    },
    {
      id: 4,
      target: 'https://pay.example.com',
      scanTypes: ['sql', 'xss', 'cmd', 'file', 'upload'],
      depth: 3,
      status: 'failed',
      startTime: '2024-03-10 09:00:00',
      endTime: '2024-03-10 09:05:00',
      assetId: 4,
      high: 0,
      medium: 0,
      low: 0,
      createdBy: 'mock-user-id'
    }
  ],

  // 模拟扫描结果数据
  results: {
    1: [
      {
        id: 1,
        scanTaskId: 1,
        vulnerabilityId: 'CVE-2024-1001',
        url: 'https://www.example.com/search?q=test',
        parameter: 'q',
        risk: 'high',
        description: '发现SQL注入漏洞，可能允许攻击者执行任意SQL命令。',
        proof: "输入 ' OR 1=1-- 后返回了所有记录，表明存在SQL注入漏洞。",
        fixSuggestion: '使用参数化查询代替直接拼接SQL语句，并对用户输入进行严格验证。'
      },
      {
        id: 2,
        scanTaskId: 1,
        vulnerabilityId: 'CVE-2024-1002',
        url: 'https://www.example.com/feedback',
        parameter: 'comment',
        risk: 'medium',
        description: '发现XSS漏洞，可能允许攻击者注入恶意脚本。',
        proof: "输入 <script>alert('XSS')</script> 后，脚本被执行，弹出了警告框。",
        fixSuggestion: '对用户输入进行HTML编码，使用内容安全策略(CSP)限制脚本执行。'
      }
    ]
  },

  // 获取扫描任务列表
  getList: (params: any) => {
    let result = [...scansMockData.list];
    
    // 根据参数筛选
    if (params) {
      if (params.target) {
        result = result.filter(item => 
          item.target.toLowerCase().includes(params.target.toLowerCase())
        );
      }
      if (params.status) {
        result = result.filter(item => item.status === params.status);
      }
      if (params.assetId) {
        result = result.filter(item => item.assetId === params.assetId);
      }
    }
    
    // 分页
    const currentPage = params?.currentPage || 1;
    const pageSize = params?.pageSize || 10;
    const total = result.length;
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedItems = result.slice(startIndex, endIndex);
    
    return {
      data: {
        items: paginatedItems,
        pagination: {
          total,
          currentPage,
          pageSize
        }
      }
    };
  },

  // 获取单个扫描任务
  getById: (id: number) => {
    const scan = scansMockData.list.find(item => item.id === id);
    if (scan) {
      return {
        data: scan
      };
    }
    throw new Error('扫描任务不存在');
  },

  // 创建扫描任务
  create: (data: any) => {
    const newId = Math.max(...scansMockData.list.map(s => s.id)) + 1;
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const newScan = {
      id: newId,
      status: 'pending',
      startTime: null,
      endTime: null,
      high: 0,
      medium: 0,
      low: 0,
      createdBy: 'mock-user-id',
      ...data
    };
    scansMockData.list.push(newScan);
    return {
      data: newScan
    };
  },

  // 开始扫描
  startScan: (assetId: number, options: any) => {
    // 找到对应资产
    const asset = assetsMockData.list.find(item => item.id === assetId);
    if (!asset) {
      throw new Error('资产不存在');
    }
    
    // 创建新的扫描任务
    const newId = Math.max(...scansMockData.list.map(s => s.id)) + 1;
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const newScan = {
      id: newId,
      target: asset.domain,
      scanTypes: options.scanTypes || ['sql', 'xss'],
      depth: options.depth || 1,
      status: 'running',
      startTime: now,
      endTime: null,
      assetId,
      high: 0,
      medium: 0,
      low: 0,
      createdBy: 'mock-user-id'
    };
    scansMockData.list.push(newScan);
    
    // 更新资产的最后扫描时间
    const assetIndex = assetsMockData.list.findIndex(item => item.id === assetId);
    if (assetIndex !== -1) {
      assetsMockData.list[assetIndex].lastScan = now;
    }
    
    return {
      data: newScan
    };
  },

  // 取消扫描
  cancelScan: (id: number) => {
    const index = scansMockData.list.findIndex(item => item.id === id);
    if (index !== -1 && scansMockData.list[index].status === 'running') {
      const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
      scansMockData.list[index].status = 'failed';
      scansMockData.list[index].endTime = now;
      return {
        data: {
          message: '扫描已取消',
          scan: scansMockData.list[index]
        }
      };
    }
    throw new Error('无法取消该扫描任务');
  },

  // 获取扫描结果
  getResults: (id: number) => {
    // 检查扫描任务是否存在
    const scan = scansMockData.list.find(item => item.id === id);
    if (!scan) {
      throw new Error('扫描任务不存在');
    }
    
    // 如果有预设结果，返回预设结果
    if (scansMockData.results[id]) {
      return {
        data: {
          items: scansMockData.results[id],
          scanInfo: scan
        }
      };
    }
    
    // 否则根据扫描状态返回不同结果
    if (scan.status === 'completed') {
      // 生成随机结果
      const randomResults = [];
      const vulnerabilityTypes = ['sql', 'xss', 'cmd', 'file', 'upload'];
      const riskLevels = ['high', 'medium', 'low'];
      
      for (let i = 0; i < 3; i++) {
        const vulType = vulnerabilityTypes[Math.floor(Math.random() * vulnerabilityTypes.length)];
        const risk = riskLevels[Math.floor(Math.random() * riskLevels.length)];
        const vulId = vulnerabilitiesMockData.list.find(v => v.type === vulType)?.id || 'CVE-2024-1001';
        
        randomResults.push({
          id: i + 1,
          scanTaskId: id,
          vulnerabilityId: vulId,
          url: `${scan.target}/path-${i}`,
          parameter: `param-${i}`,
          risk,
          description: `发现${vulType}类型漏洞，可能存在安全风险。`,
          proof: `测试输入 ${vulType}-payload-${i} 触发了漏洞。`,
          fixSuggestion: '请参考漏洞库中的修复建议。'
        });
      }
      
      return {
        data: {
          items: randomResults,
          scanInfo: scan
        }
      };
    } else if (scan.status === 'running') {
      return {
        data: {
          items: [],
          scanInfo: scan,
          message: '扫描任务正在进行中'
        }
      };
    } else {
      return {
        data: {
          items: [],
          scanInfo: scan,
          message: scan.status === 'pending' ? '扫描任务尚未开始' : '扫描任务失败或已取消'
        }
      };
    }
  }
};

// 安全基线相关的mock数据
const securityBaselinesMockData = {
  // 模拟安全基线列表数据
  list: [
    {
      id: 1,
      name: 'Web应用安全基线',
      category: 'web',
      description: '适用于Web应用程序的基本安全检查项目',
      checkItems: [
        { id: 'web-001', name: 'HTTPS配置', description: '检查是否正确配置HTTPS' },
        { id: 'web-002', name: 'Cookie安全', description: '检查Cookie是否设置了安全和HttpOnly属性' },
        { id: 'web-003', name: 'CSP策略', description: '检查是否配置了内容安全策略' },
        { id: 'web-004', name: 'X-XSS-Protection', description: '检查是否启用XSS保护' },
        { id: 'web-005', name: 'X-Frame-Options', description: '检查是否防止网站被嵌入到iframe中' }
      ],
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-03-01T14:30:00Z'
    },
    {
      id: 2,
      name: 'API安全基线',
      category: 'api',
      description: '适用于API服务的安全检查项目',
      checkItems: [
        { id: 'api-001', name: 'API认证', description: '检查API是否有适当的认证机制' },
        { id: 'api-002', name: 'API速率限制', description: '检查是否实施了API请求速率限制' },
        { id: 'api-003', name: 'HTTPS传输', description: '检查API是否使用HTTPS传输' },
        { id: 'api-004', name: 'JWT配置', description: '检查JWT令牌的正确配置' },
        { id: 'api-005', name: 'CORS配置', description: '检查CORS配置是否安全' }
      ],
      createdAt: '2024-01-20T11:30:00Z',
      updatedAt: '2024-02-25T09:45:00Z'
    },
    {
      id: 3,
      name: '服务器系统安全基线',
      category: 'server',
      description: '适用于服务器系统的安全检查项目',
      checkItems: [
        { id: 'srv-001', name: '系统更新', description: '检查系统是否应用了最新安全更新' },
        { id: 'srv-002', name: '防火墙配置', description: '检查防火墙规则是否正确配置' },
        { id: 'srv-003', name: '日志审计', description: '检查是否启用了日志审计功能' },
        { id: 'srv-004', name: '账户安全', description: '检查用户账户和密码策略是否安全' },
        { id: 'srv-005', name: '服务配置', description: '检查是否只运行必要的服务' }
      ],
      createdAt: '2024-02-10T08:45:00Z',
      updatedAt: '2024-03-15T16:20:00Z'
    }
  ],

  // 模拟基线检查任务
  checks: [
    {
      id: 1,
      assetId: 1,
      baselineId: 1,
      status: 'completed',
      result: [
        { itemId: 'web-001', passed: true, details: 'HTTPS已正确配置，使用TLS 1.3' },
        { itemId: 'web-002', passed: false, details: '未设置Cookie的HttpOnly属性' },
        { itemId: 'web-003', passed: false, details: '未配置内容安全策略' },
        { itemId: 'web-004', passed: true, details: 'X-XSS-Protection已启用' },
        { itemId: 'web-005', passed: true, details: 'X-Frame-Options已设置为DENY' }
      ],
      score: 60,
      startTime: '2024-03-15 10:00:00',
      endTime: '2024-03-15 10:10:00',
      createdBy: 'mock-user-id'
    },
    {
      id: 2,
      assetId: 4,
      baselineId: 2,
      status: 'completed',
      result: [
        { itemId: 'api-001', passed: true, details: 'API使用OAuth2.0认证' },
        { itemId: 'api-002', passed: true, details: '已实施API速率限制' },
        { itemId: 'api-003', passed: true, details: 'API使用HTTPS传输' },
        { itemId: 'api-004', passed: false, details: 'JWT配置不安全，使用了弱密钥' },
        { itemId: 'api-005', passed: true, details: 'CORS配置正确' }
      ],
      score: 80,
      startTime: '2024-03-10 14:30:00',
      endTime: '2024-03-10 14:35:00',
      createdBy: 'mock-user-id'
    }
  ],

  // 获取安全基线列表
  getList: (params: any) => {
    let result = [...securityBaselinesMockData.list];
    
    // 根据参数筛选
    if (params) {
      if (params.name) {
        result = result.filter(item => 
          item.name.toLowerCase().includes(params.name.toLowerCase())
        );
      }
      if (params.category) {
        result = result.filter(item => item.category === params.category);
      }
    }
    
    // 分页
    const currentPage = params?.currentPage || 1;
    const pageSize = params?.pageSize || 10;
    const total = result.length;
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedItems = result.slice(startIndex, endIndex);
    
    return {
      data: {
        items: paginatedItems,
        pagination: {
          total,
          currentPage,
          pageSize
        }
      }
    };
  },

  // 获取单个安全基线
  getById: (id: number) => {
    const baseline = securityBaselinesMockData.list.find(item => item.id === id);
    if (baseline) {
      return {
        data: baseline
      };
    }
    throw new Error('安全基线不存在');
  },

  // 创建安全基线
  create: (data: any) => {
    const newId = Math.max(...securityBaselinesMockData.list.map(b => b.id)) + 1;
    const now = new Date().toISOString();
    const newBaseline = {
      id: newId,
      checkItems: [],
      createdAt: now,
      updatedAt: now,
      ...data
    };
    securityBaselinesMockData.list.push(newBaseline);
    return {
      data: newBaseline
    };
  },

  // 更新安全基线
  update: (id: number, data: any) => {
    const index = securityBaselinesMockData.list.findIndex(item => item.id === id);
    if (index !== -1) {
      const now = new Date().toISOString();
      const updatedBaseline = {
        ...securityBaselinesMockData.list[index],
        ...data,
        updatedAt: now
      };
      securityBaselinesMockData.list[index] = updatedBaseline;
      return {
        data: updatedBaseline
      };
    }
    throw new Error('安全基线不存在');
  },

  // 删除安全基线
  delete: (id: number) => {
    const index = securityBaselinesMockData.list.findIndex(item => item.id === id);
    if (index !== -1) {
      securityBaselinesMockData.list.splice(index, 1);
      return {
        data: {
          message: '删除成功'
        }
      };
    }
    throw new Error('安全基线不存在');
  },

  // 执行基线检查
  runCheck: (assetId: number, baselineId: number) => {
    // 检查资产和基线是否存在
    const asset = assetsMockData.list.find(item => item.id === assetId);
    const baseline = securityBaselinesMockData.list.find(item => item.id === baselineId);
    
    if (!asset || !baseline) {
      throw new Error('资产或安全基线不存在');
    }
    
    // 创建新的检查任务
    const newId = Math.max(...securityBaselinesMockData.checks.map(c => c.id)) + 1;
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
    
    // 随机生成结果
    const checkItems = baseline.checkItems || [];
    const result = checkItems.map(item => {
      const passed = Math.random() > 0.3; // 70%概率通过
      return {
        itemId: item.id,
        passed,
        details: passed 
          ? `${item.name}检查通过` 
          : `${item.name}检查未通过，需要改进`
      };
    });
    
    // 计算得分
    const passedCount = result.filter(r => r.passed).length;
    const score = Math.round((passedCount / checkItems.length) * 100);
    
    const newCheck = {
      id: newId,
      assetId,
      baselineId,
      status: 'completed',
      result,
      score,
      startTime: now,
      endTime: now, // 假设检查瞬间完成
      createdBy: 'mock-user-id'
    };
    
    securityBaselinesMockData.checks.push(newCheck);
    
    return {
      data: newCheck
    };
  },

  // 获取基线检查结果
  getCheckResults: (checkId: number) => {
    const check = securityBaselinesMockData.checks.find(item => item.id === checkId);
    if (check) {
      // 查找关联的基线和资产信息
      const baseline = securityBaselinesMockData.list.find(item => item.id === check.baselineId);
      const asset = assetsMockData.list.find(item => item.id === check.assetId);
      
      return {
        data: {
          ...check,
          baselineName: baseline?.name || '未知基线',
          assetName: asset?.name || '未知资产'
        }
      };
    }
    throw new Error('基线检查结果不存在');
  }
};

// 报告相关的mock数据
const reportsMockData = {
  // 模拟报告列表数据
  list: [
    {
      id: 1,
      title: 'www.example.com安全扫描报告',
      type: 'scan',
      scanTaskId: 1,
      baselineCheckId: null,
      createdBy: 'mock-user-id',
      createdAt: '2024-03-15 11:00:00',
      updatedAt: '2024-03-15 11:00:00'
    },
    {
      id: 2,
      title: 'API服务安全基线检查报告',
      type: 'baseline',
      scanTaskId: null,
      baselineCheckId: 2,
      createdBy: 'mock-user-id',
      createdAt: '2024-03-10 15:00:00',
      updatedAt: '2024-03-10 15:00:00'
    }
  ],

  // 获取报告列表
  getList: (params: any) => {
    let result = [...reportsMockData.list];
    
    // 根据参数筛选
    if (params) {
      if (params.title) {
        result = result.filter(item => 
          item.title.toLowerCase().includes(params.title.toLowerCase())
        );
      }
      if (params.type) {
        result = result.filter(item => item.type === params.type);
      }
    }
    
    // 分页
    const currentPage = params?.currentPage || 1;
    const pageSize = params?.pageSize || 10;
    const total = result.length;
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedItems = result.slice(startIndex, endIndex);
    
    return {
      data: {
        items: paginatedItems,
        pagination: {
          total,
          currentPage,
          pageSize
        }
      }
    };
  },

  // 获取单个报告
  getById: (id: number) => {
    const report = reportsMockData.list.find(item => item.id === id);
    if (report) {
      // 根据报告类型获取不同的关联数据
      let content = null;
      if (report.type === 'scan' && report.scanTaskId) {
        const scan = scansMockData.list.find(s => s.id === report.scanTaskId);
        const results = scansMockData.getResults(report.scanTaskId).data.items || [];
        content = {
          scan,
          results,
          summary: {
            vulnerabilitiesCount: results.length,
            highRiskCount: results.filter(r => r.risk === 'high').length,
            mediumRiskCount: results.filter(r => r.risk === 'medium').length,
            lowRiskCount: results.filter(r => r.risk === 'low').length
          }
        };
      } else if (report.type === 'baseline' && report.baselineCheckId) {
        const check = securityBaselinesMockData.checks.find(c => c.id === report.baselineCheckId);
        const baseline = securityBaselinesMockData.list.find(b => b.id === check?.baselineId);
        const asset = assetsMockData.list.find(a => a.id === check?.assetId);
        content = {
          check,
          baseline,
          asset,
          summary: {
            totalItems: check?.result.length || 0,
            passedItems: check?.result.filter(r => r.passed).length || 0,
            failedItems: check?.result.filter(r => !r.passed).length || 0,
            score: check?.score || 0
          }
        };
      }
      
      return {
        data: {
          ...report,
          content
        }
      };
    }
    throw new Error('报告不存在');
  },

  // 创建扫描报告
  createScanReport: (scanId: number) => {
    // 检查扫描任务是否存在
    const scan = scansMockData.list.find(item => item.id === scanId);
    if (!scan) {
      throw new Error('扫描任务不存在');
    }
    
    // 检查是否已经存在该扫描任务的报告
    const existingReport = reportsMockData.list.find(
      item => item.type === 'scan' && item.scanTaskId === scanId
    );
    
    if (existingReport) {
      return {
        data: existingReport,
        message: '报告已存在'
      };
    }
    
    // 创建新报告
    const newId = Math.max(...reportsMockData.list.map(r => r.id)) + 1;
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const asset = assetsMockData.list.find(a => a.id === scan.assetId);
    
    const newReport = {
      id: newId,
      title: `${asset?.name || scan.target}安全扫描报告`,
      type: 'scan',
      scanTaskId: scanId,
      baselineCheckId: null,
      createdBy: 'mock-user-id',
      createdAt: now,
      updatedAt: now
    };
    
    reportsMockData.list.push(newReport);
    
    return {
      data: newReport
    };
  },

  // 创建基线检查报告
  createBaselineReport: (checkId: number) => {
    // 检查基线检查任务是否存在
    const check = securityBaselinesMockData.checks.find(item => item.id === checkId);
    if (!check) {
      throw new Error('基线检查任务不存在');
    }
    
    // 检查是否已经存在该基线检查的报告
    const existingReport = reportsMockData.list.find(
      item => item.type === 'baseline' && item.baselineCheckId === checkId
    );
    
    if (existingReport) {
      return {
        data: existingReport,
        message: '报告已存在'
      };
    }
    
    // 创建新报告
    const newId = Math.max(...reportsMockData.list.map(r => r.id)) + 1;
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const baseline = securityBaselinesMockData.list.find(b => b.id === check.baselineId);
    const asset = assetsMockData.list.find(a => a.id === check.assetId);
    
    const newReport = {
      id: newId,
      title: `${asset?.name || '未知资产'} ${baseline?.name || '安全基线'}检查报告`,
      type: 'baseline',
      scanTaskId: null,
      baselineCheckId: checkId,
      createdBy: 'mock-user-id',
      createdAt: now,
      updatedAt: now
    };
    
    reportsMockData.list.push(newReport);
    
    return {
      data: newReport
    };
  },

  // 导出报告
  exportReport: (id: number, format: string = 'pdf') => {
    // 检查报告是否存在
    const report = reportsMockData.list.find(item => item.id === id);
    if (!report) {
      throw new Error('报告不存在');
    }
    
    // 模拟导出操作
    return {
      data: {
        url: `https://mock-server.example.com/reports/${id}/download?format=${format}`,
        filename: `Report-${id}.${format}`,
        message: '报告导出成功'
      }
    };
  }
};

// 仪表盘相关的mock数据
const dashboardMockData = {
  // 获取仪表盘摘要数据
  getSummary: () => {
    return {
      data: {
        assets: {
          total: assetsMockData.list.length,
          running: assetsMockData.list.filter(a => a.status === 'running').length,
          maintenance: assetsMockData.list.filter(a => a.status === 'maintenance').length,
          stopped: assetsMockData.list.filter(a => a.status === 'stopped').length
        },
        vulnerabilities: {
          total: vulnerabilitiesMockData.list.length,
          high: vulnerabilitiesMockData.list.filter(v => v.risk === 'high').length,
          medium: vulnerabilitiesMockData.list.filter(v => v.risk === 'medium').length,
          low: vulnerabilitiesMockData.list.filter(v => v.risk === 'low').length
        },
        scans: {
          total: scansMockData.list.length,
          pending: scansMockData.list.filter(s => s.status === 'pending').length,
          running: scansMockData.list.filter(s => s.status === 'running').length,
          completed: scansMockData.list.filter(s => s.status === 'completed').length,
          failed: scansMockData.list.filter(s => s.status === 'failed').length
        },
        reports: reportsMockData.list.length
      }
    };
  },

  // 获取漏洞统计数据
  getVulnerabilityStats: () => {
    return {
      data: {
        byRisk: [
          { name: '高危', value: vulnerabilitiesMockData.list.filter(v => v.risk === 'high').length },
          { name: '中危', value: vulnerabilitiesMockData.list.filter(v => v.risk === 'medium').length },
          { name: '低危', value: vulnerabilitiesMockData.list.filter(v => v.risk === 'low').length }
        ],
        byType: [
          { name: 'SQL注入', value: vulnerabilitiesMockData.list.filter(v => v.type === 'sql').length },
          { name: 'XSS', value: vulnerabilitiesMockData.list.filter(v => v.type === 'xss').length },
          { name: '命令注入', value: vulnerabilitiesMockData.list.filter(v => v.type === 'cmd').length },
          { name: '文件包含', value: vulnerabilitiesMockData.list.filter(v => v.type === 'file').length },
          { name: '文件上传', value: vulnerabilitiesMockData.list.filter(v => v.type === 'upload').length }
        ],
        trend: [
          { date: '2024-01', high: 5, medium: 8, low: 12 },
          { date: '2024-02', high: 7, medium: 10, low: 15 },
          { date: '2024-03', high: 6, medium: 9, low: 13 },
          { date: '2024-04', high: 8, medium: 12, low: 17 }
        ]
      }
    };
  },

  // 获取最近扫描任务
  getRecentScans: () => {
    // 按开始时间降序排序，取最近5个
    const recentScans = [...scansMockData.list]
      .filter(s => s.startTime)
      .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())
      .slice(0, 5)
      .map(scan => {
        // 查找关联的资产
        const asset = assetsMockData.list.find(a => a.id === scan.assetId);
        return {
          ...scan,
          assetName: asset?.name || '未知资产'
        };
      });
    
    return {
      data: recentScans
    };
  },

  // 获取资产统计数据
  getAssetStats: () => {
    return {
      data: {
        byType: [
          { name: 'Web应用', value: assetsMockData.list.filter(a => a.type === 'web').length },
          { name: 'API服务', value: assetsMockData.list.filter(a => a.type === 'api').length },
          { name: '移动应用', value: assetsMockData.list.filter(a => a.type === 'mobile').length },
          { name: '小程序', value: assetsMockData.list.filter(a => a.type === 'miniapp').length }
        ],
        byStatus: [
          { name: '运行中', value: assetsMockData.list.filter(a => a.status === 'running').length },
          { name: '已停止', value: assetsMockData.list.filter(a => a.status === 'stopped').length },
          { name: '维护中', value: assetsMockData.list.filter(a => a.status === 'maintenance').length }
        ],
        mostVulnerable: assetsMockData.list
          .filter(a => a.lastScan) // 只统计已扫描的资产
          .map(asset => {
            // 查找关联的扫描任务
            const scan = scansMockData.list.find(s => s.assetId === asset.id && s.status === 'completed');
            return {
              id: asset.id,
              name: asset.name,
              type: asset.type,
              highRisk: scan?.high || 0,
              mediumRisk: scan?.medium || 0,
              lowRisk: scan?.low || 0,
              totalRisk: (scan?.high || 0) + (scan?.medium || 0) + (scan?.low || 0)
            };
          })
          .sort((a, b) => b.totalRisk - a.totalRisk)
          .slice(0, 5)
      }
    };
  }
};

// 导出所有mock数据
export const mockData = {
  auth: authMockData,
  assets: assetsMockData,
  vulnerabilities: vulnerabilitiesMockData,
  scans: scansMockData,
  securityBaselines: securityBaselinesMockData,
  reports: reportsMockData,
  dashboard: dashboardMockData
}; 