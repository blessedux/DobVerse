import { createRouter, createWebHistory } from 'vue-router'
import LandingPage from '../components/LandingPage.vue'
import TeamAdminHome from '../components/TeamAdminHome.vue'
import { useWhitelist } from '../composables/useWhitelist'

const GrantsPage = () => import('../components/GrantsPage.vue')
const BbddReunionesPage = () => import('../components/BbddReunionesPage.vue')
const PropuestasB2BPage = () => import('../components/PropuestasB2BPage.vue')
const PlanComunicacionesPage = () => import('../components/PlanComunicacionesPage.vue')
const DirectoriosPage = () => import('../components/DirectoriosPage.vue')
const UxUiPage = () => import('../components/UxUiPage.vue')
const TareasMayoPage = () => import('../components/TareasMayoPage.vue')

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: LandingPage
    },
    {
      path: '/main',
      name: 'main',
      component: TeamAdminHome,
      meta: { requiresAuth: true }
    },
    { path: '/grants', component: GrantsPage },
    { path: '/bbdd-reuniones', component: BbddReunionesPage },
    { path: '/propuestas-b2b', component: PropuestasB2BPage },
    { path: '/plan-comunicaciones', component: PlanComunicacionesPage },
    { path: '/directorios', component: DirectoriosPage },
    { path: '/ux-ui', component: UxUiPage },
    { path: '/tareas-mayo', component: TareasMayoPage },
    {
      path: '/meeting-notes',
      name: 'meeting-notes',
      component: () => import('@/views/MeetingNotes.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/resources',
      name: 'resources',
      component: () => import('@/views/Resources.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/people',
      name: 'people',
      component: () => import('@/views/People.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/tasks',
      name: 'tasks',
      component: () => import('@/views/Tasks.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/archive',
      name: 'archive',
      component: () => import('@/views/Archive.vue'),
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
        return
      }

      // Check if the connected address is whitelisted
      const { isAddressWhitelisted } = useWhitelist()
      const address = accounts[0].toLowerCase()
      
      if (!isAddressWhitelisted(address)) {
        // Redirect to home if address is not whitelisted
        next({ name: 'home' })
        return
      }

      next()
    } catch (error) {
      // If there's an error, assume not connected
      next({ name: 'home' })
    }
  } else {
    next()
  }
})

export default router 