<template>
  <v-container class="pa-0" fluid>
    <div class="login-hero d-flex flex-column">
      <div class="flex-grow-1 d-flex align-center justify-center">
        <v-card class="pa-8 login-card" elevation="10" max-width="520">
          <div class="d-flex justify-space-between align-center">
            <div>
              <h1 class="text-h5 font-weight-bold mb-1">
                Centre Command Login
              </h1>
              <p class="text-body-2 mb-0">
                Authenticate to view logistics, planning and reporting
                dashboards.
              </p>
            </div>
            <!-- neutral avatar -->
            <v-avatar color="grey-darken-3" size="48">
              <v-icon color="white">mdi-shield-account</v-icon>
            </v-avatar>
          </div>

          <v-alert
            v-if="errorMessage"
            class="mt-4"
            color="error"
            variant="tonal"
            icon="mdi-alert-circle"
          >
            {{ errorMessage }}
          </v-alert>

          <v-form class="mt-6" @submit.prevent="handleLogin">
            <v-select
              v-model="selectedCenter"
              :items="centerOptions"
              item-title="name"
              item-value="id"
              label="Select Centre"
              variant="outlined"
              density="comfortable"
              :disabled="loading"
              prepend-inner-icon="mdi-office-building"
            />
            <v-text-field
              v-model="username"
              label="Username"
              variant="outlined"
              density="comfortable"
              class="mt-3"
              :disabled="loading"
              prepend-inner-icon="mdi-account"
            />
            <v-text-field
              v-model="password"
              label="Password"
              type="password"
              variant="outlined"
              density="comfortable"
              class="mt-3"
              :disabled="loading"
              prepend-inner-icon="mdi-lock"
            />

            <div class="d-flex align-center justify-space-between mt-4">
              <!-- neutral checkbox -->
              <v-checkbox
                v-model="rememberMe"
                color="primary"
                hide-details
                label="Remember this device"
              />
              <!-- primary button -->
              <v-btn type="submit" color="primary" :loading="loading">
                Access console
              </v-btn>
            </div>
          </v-form>

          <v-divider class="my-6" />

          <div class="d-flex justify-space-between align-center text-body-2">
            <span class="text-medium-emphasis"
              >Need help? Reach regional support</span
            >
            <v-btn variant="text" color="primary" size="small">
              <v-icon start>mdi-headset</v-icon>
              Support
            </v-btn>
          </div>

          <v-divider class="my-6" />

          <div>
            <h2 class="text-subtitle-1 font-weight-bold">Security checklist</h2>
            <v-list density="comfortable" class="mt-2">
              <v-list-item v-for="tip in securityTips" :key="tip.icon">
                <template #prepend>
                  <v-avatar color="primary" size="36">
                    <v-icon color="white">{{ tip.icon }}</v-icon>
                  </v-avatar>
                </template>
                <v-list-item-title class="font-weight-medium">
                  {{ tip.title }}
                </v-list-item-title>
                <v-list-item-subtitle>{{ tip.subtitle }}</v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </div>
        </v-card>
      </div>
    </div>
  </v-container>
</template>

<style scoped>
/* Full-height hero, no purple gradient */
.login-hero {
  min-height: 100vh; /* full viewport */
  background: url("/images/admin-login-bg.jpg") center / cover no-repeat;
}

/* Optional: subtle glass look without color cast */
.login-card {
  backdrop-filter: blur(8px);
  border-radius: 24px;
  background-color: rgba(255, 255, 255, 0.85);
}
</style>

<script>
import { mapStores } from "pinia";
import { useAuthStore } from "~/stores/auth.js";
import TopBarMenuAdmin from "~/components/dashboard/navBarAdmin.vue";

export default {
  name: "AdminLoginPage",
  components: { TopBarMenuAdmin },
  data() {
    return {
      username: "",
      password: "",
      selectedCenter: null,
      loading: false,
      errorMessage: "",
      rememberMe: true,
      securityTips: [
        {
          icon: "mdi-shield-lock",
          title: "Protect your credentials",
          subtitle: "Use two-factor codes from the Authy app for every login.",
        },
        {
          icon: "mdi-history",
          title: "Review last access",
          subtitle: "Check the admin dashboard for unusual login times.",
        },
        {
          icon: "mdi-bell-ring",
          title: "Enable alerts",
          subtitle: "Switch on SMS alerts for failed logins in your profile.",
        },
      ],
    };
  },
  computed: {
    ...mapStores(useAuthStore),
    centerOptions() {
      return this.authStore.centers;
    },
  },
  methods: {
    async handleLogin() {
      this.errorMessage = "";
      if (!this.selectedCenter || !this.username || !this.password) {
        this.errorMessage =
          "Please choose a centre and provide both username and password.";
        return;
      }

      this.loading = true;
      const success = await this.authStore.loginCenter(
        this.selectedCenter,
        this.username,
        this.password
      );
      this.loading = false;

      if (!success) {
        this.errorMessage =
          "We could not verify those credentials. Try again or contact support.";
        return;
      }

      this.$router.push("/admin/dashboard");
    },
  },
};
</script>
