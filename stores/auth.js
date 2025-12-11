import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null,
        activeCenter: null,
        centers: [
            { id: 1, name: 'Cape Town Center', username: 'admin', password: '12345' },
            { id: 2, name: 'Johannesburg Center', username: 'admin', password: '12345' },
            { id: 3, name: 'Durban Center', username: 'admin', password: '12345' }
        ]
    }),
    actions: {
        async login(email, password) {
            const { $supabase } = useNuxtApp()
            const { data, error } = await $supabase.auth.signInWithPassword({ email, password })
            if (error) throw error
            this.user = data.user
        },
        async loginCenter(selCus, username, password) {
            const center = this.centers.find(c => c.id === selCus)
            if (!center) {
                return false
            }

            if (center.username !== username || center.password !== password) {
                return false
            }

            this.user = { id: center.id, email: center.username, center: center.name }
            this.activeCenter = center
            return true
        },


        async register(email, password) {
            const { $supabase } = useNuxtApp()
            const { data, error } = await $supabase.auth.signUp({ email, password })
            if (error) throw error
        },

        async logout() {
            const { $supabase } = useNuxtApp()

            await $supabase.auth.signOut()
            this.user = null
            this.activeCenter = null
        },

        async fetchUser() {
            const { $supabase } = useNuxtApp()

            const { data } = await $supabase.auth.getUser()
            this.user = data.user
        },

        async loginAnonymously() {
            const { $supabase } = useNuxtApp()
            if (this.isLoggedIn()) return;
            const { data, error } = await $supabase.auth.signInAnonymously()
            if (error) throw error
            this.user = data.user
        },

        isLoggedIn() {
            return !!this.user
        }
    }
})
