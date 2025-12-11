import { useAuthStore } from '~/stores/auth'

export default defineNuxtRouteMiddleware(() => {
  const authStore = useAuthStore()

  if (process.client) {
    if (!authStore.user) {
      authStore.hydrate()
    }

    if (!authStore.isAuthenticated) {
      return navigateTo('/')
    }
  }
})
