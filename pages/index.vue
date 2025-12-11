<template>
  <div class="page-shell">
    <login-panel />
  </div>
</template>

<script setup>
import { onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import LoginPanel from '~/components/auth/LoginPanel.vue'
import { useAuthStore } from '~/stores/auth'

definePageMeta({
  alias: ['/login'],
})

const router = useRouter()
const authStore = useAuthStore()

onMounted(() => {
  authStore.hydrate()
  if (authStore.isAuthenticated) {
    router.replace('/dashboard')
  }
})

watch(
  () => authStore.isAuthenticated,
  (authed) => {
    if (authed && process.client) {
      router.replace('/dashboard')
    }
  },
)
</script>

<style scoped>
.page-shell {
  min-height: 100vh;
  background: radial-gradient(circle at 10% 20%, rgba(59, 130, 246, 0.1), transparent 24%),
    radial-gradient(circle at 80% 10%, rgba(16, 185, 129, 0.1), transparent 24%),
    linear-gradient(180deg, #f5f7fb 0%, #e9eef7 100%);
}
</style>
