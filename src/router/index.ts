import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import Assets from '../views/Assets.vue'
import ScanResults from '../views/ScanResults.vue'
import SecurityBaseline from '../views/SecurityBaseline.vue'
import VulnerabilityDatabase from '../views/VulnerabilityDatabase.vue'
import Reports from '../views/Reports.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Dashboard',
      component: Dashboard
    },
    {
      path: '/assets',
      name: 'Assets',
      component: Assets
    },
    {
      path: '/scan-results',
      name: 'ScanResults',
      component: ScanResults
    },
    {
      path: '/security-baseline',
      name: 'SecurityBaseline',
      component: SecurityBaseline
    },
    {
      path: '/vulnerability-database',
      name: 'VulnerabilityDatabase',
      component: VulnerabilityDatabase
    },
    {
      path: '/reports',
      name: 'Reports',
      component: Reports
    }
  ]
})

export default router