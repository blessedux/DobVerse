import { createRouter, createWebHistory } from 'vue-router'
import LandingPage from '../components/LandingPage.vue'
import MainPage from '../components/MainPage.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: LandingPage
    },
    {
      path: '/main',
      name: 'main',
      component: MainPage,
      meta: { requiresAuth: true }
    }
  ]
})

// Navigation guard
router.beforeEach(async (to, from, next) => {
  // Check if the route requires authentication
  if (to.meta.requiresAuth) {
    try {
      // Check if wallet is connected by requesting accounts
      const accounts = await window.ethereum?.request({ method: 'eth_accounts' })
      const isWalletConnected = accounts && accounts.length > 0
      
      if (!isWalletConnected) {
        // Redirect to home if trying to access protected route without being connected
        next({ name: 'home' })
      } else {
        next()
      }
    } catch (error) {
      // If there's an error, assume not connected
      next({ name: 'home' })
    }
  } else {
    next()
  }
})

export default router 