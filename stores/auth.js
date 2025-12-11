import { defineStore } from 'pinia'

const ADMIN_USERNAME = 'admin'
const ADMIN_PASSWORD = '12345678'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.user,
  },
  actions: {
    hydrate() {
      if (process.client) {
        const saved = localStorage.getItem('lms-auth-user')
        if (saved) {
          this.user = JSON.parse(saved)
        }
      }
    },
    login(username, password) {
      if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        this.user = { username }
        if (process.client) {
          localStorage.setItem('lms-auth-user', JSON.stringify(this.user))
        }
        return { success: true }
      }
      return { success: false, message: 'Invalid credentials. Try admin / 12345678.' }
    },
    logout() {
      this.user = null
      if (process.client) {
        localStorage.removeItem('lms-auth-user')
      }
    },
  },
})
