import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import Dashboard from '../views/Dashboard.vue'
import Assets from '../views/Assets.vue'
import ScanResults from '../views/ScanResults.vue'
import SecurityBaseline from '../views/SecurityBaseline.vue'
import VulnerabilityDatabase from '../views/VulnerabilityDatabase.vue'
import Reports from '../views/Reports.vue'
import Login from '../views/Login.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: Login,
      meta: { requiresAuth: false }
    },
    {
      path: '/',
      name: 'Dashboard',
      component: Dashboard,
      meta: { requiresAuth: true }
    },
    {
      path: '/assets',
      name: 'Assets',
      component: Assets,
      meta: { requiresAuth: true }
    },
    {
      path: '/scan-results',
      name: 'ScanResults',
      component: ScanResults,
      meta: { requiresAuth: true }
    },
    {
      path: '/security-baseline',
      name: 'SecurityBaseline',
      component: SecurityBaseline,
      meta: { requiresAuth: true }
    },
    {
      path: '/vulnerability-database',
      name: 'VulnerabilityDatabase',
      component: VulnerabilityDatabase,
      meta: { requiresAuth: true }
    },
    {
      path: '/reports',
      name: 'Reports',
      component: Reports,
      meta: { requiresAuth: true }
    }
  ]
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  try {
    const user = await authStore.checkAuth()
    
    // 调试信息
    console.log('Navigation guard - User state:', user ? 'Logged in' : 'Not logged in')
    console.log('Route requires auth:', to.meta.requiresAuth)
    
    if (to.meta.requiresAuth && !user) {
      console.log('Redirecting to login')
      next('/login')
    } else if (to.path === '/login' && user) {
      console.log('Redirecting to dashboard')
      next('/')
    } else {
      console.log('Proceeding to route:', to.path)
      next()
    }
  } catch (error) {
    console.error('Navigation guard error:', error)
    next('/login')
  }
})

export default router