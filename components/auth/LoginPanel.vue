<template>
  <v-container class="fill-height login-wrapper" fluid>
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="6" lg="5">
        <v-card elevation="10" class="pa-6 glass-card">
          <div class="d-flex align-center justify-space-between mb-4">
            <div>
              <p class="text-caption text-medium-emphasis mb-1">W&RSETA Secure Access</p>
              <h2 class="text-h5 font-weight-bold">Sign in to continue</h2>
            </div>
            <v-avatar color="primary" size="52">
              <v-icon color="white">mdi-lock-check</v-icon>
            </v-avatar>
          </div>

          <v-alert
            v-if="message"
            :type="success ? 'success' : 'error'"
            density="compact"
            variant="tonal"
            class="mb-4"
          >
            {{ message }}
          </v-alert>

          <v-form @submit.prevent="handleLogin">
            <v-text-field
              v-model="username"
              label="Username"
              variant="outlined"
              prepend-inner-icon="mdi-account"
              density="comfortable"
              required
            />
            <v-text-field
              v-model="password"
              label="Password"
              variant="outlined"
              prepend-inner-icon="mdi-lock"
              density="comfortable"
              type="password"
              required
            />
            <v-btn block color="primary" size="large" :loading="loading" type="submit" class="mt-2" prepend-icon="mdi-login">
              Login as admin
            </v-btn>
          </v-form>
          <div class="mt-4 text-body-2 text-medium-emphasis">
            Demo credentials: <strong>admin</strong> / <strong>12345678</strong>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()

const username = ref('')
const password = ref('')
const loading = ref(false)
const message = ref('')
const success = ref(false)

onMounted(() => {
  authStore.hydrate()
})

const handleLogin = async () => {
  message.value = ''
  success.value = false
  loading.value = true

  const response = await authStore.login(username.value, password.value)
  loading.value = false

  if (!response.success) {
    message.value = response.message || 'Unable to sign in'
    return
  }

  message.value = 'Authenticated — redirecting to dashboard'
  success.value = true
}
</script>

<style scoped>
.login-wrapper {
  min-height: 100vh;
  background: radial-gradient(circle at 10% 20%, rgba(67, 97, 238, 0.18), transparent 25%),
    radial-gradient(circle at 90% 10%, rgba(16, 185, 129, 0.18), transparent 22%),
    radial-gradient(circle at 50% 80%, rgba(236, 72, 153, 0.14), transparent 25%),
    linear-gradient(135deg, #0b1021 0%, #0f172a 45%, #111827 100%);
}

.glass-card {
  border-radius: 18px;
  backdrop-filter: blur(8px);
  background: rgba(255, 255, 255, 0.92);
}
</style>
