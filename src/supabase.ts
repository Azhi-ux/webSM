import { createClient } from '@supabase/supabase-js'

// 确保即使环境变量未设置也有默认值
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project-url.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

// 为开发环境提供测试服务
const isDevelopment = import.meta.env.DEV

console.log('Supabase URL:', supabaseUrl)
console.log('Environment:', isDevelopment ? 'Development' : 'Production')

// 创建Supabase客户端，但在开发环境中，我们将依赖模拟服务
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 为开发环境添加警告
if (isDevelopment) {
  console.log('注意: 开发环境中使用模拟的认证服务，Supabase API调用将被拦截')
}