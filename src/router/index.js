/**
 * router/index.js
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import { createRouter, createWebHistory } from 'vue-router'
import { setupLayouts } from 'virtual:generated-layouts'
import { routes } from 'vue-router/auto-routes' 
import { useAuthStore } from '@/stores/auth' 

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: setupLayouts(routes), 
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  
  if (!authStore.user) {
    await authStore.fetchUser()
  }

  const isAuthenticated = !!authStore.user
  const isStudent = authStore.role === 'student'
  const isPersonal = authStore.role === 'personal'
  
  const publicPages = ['/LoginPage']
  const authRequired = !publicPages.includes(to.path)

  if (authRequired && !isAuthenticated) {
    return next('/LoginPage')
  }
  if (to.path === '/LoginPage' && isAuthenticated) {
    return next(isStudent ? '/StudentView' : '/')
  }
  if (isStudent && to.path === '/') {
    return next('/StudentView')
  }
  if (isPersonal && to.path === '/StudentView') {
    return next('/')
  }
  next()
})

router.onError((err, to) => {
  if (err?.message?.includes?.('Failed to fetch dynamically imported module')) {
    if (!localStorage.getItem('vuetify:dynamic-reload')) {
      console.log('Reloading page to fix dynamic import error')
      localStorage.setItem('vuetify:dynamic-reload', 'true')
      location.assign(to.fullPath)
    } else {
      console.error('Dynamic import error, reloading page did not fix it', err)
    }
  } else {
    console.error(err)
  }
})

router.isReady().then(() => {
  localStorage.removeItem('vuetify:dynamic-reload')
})

export default router