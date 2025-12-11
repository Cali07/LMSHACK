<template>
  <v-navigation-drawer
    permanent
    app
    width="280"
    class="addhope-side-nav"
  >
    <v-sheet class="pa-4 nav-header" color="transparent">
      <div class="d-flex align-center">
        <v-avatar size="48" color="error">
          <span class="text-h6 font-weight-bold text-white">AH</span>
        </v-avatar>
        <div class="ml-3">
          <div class="text-subtitle-1 font-weight-bold text-white">AddHope</div>
          <div class="text-caption text-white-70">Impact dashboard</div>
        </div>
      </div>
    </v-sheet>

    <v-divider color="rgba(255,255,255,0.25)" />

    <v-list density="comfortable" nav class="py-4">
      <v-list-item
        v-for="link in links"
        :key="link.to"
        :to="link.to"
        :title="link.title"
        :prepend-icon="link.icon"
        rounded="lg"
        class="mb-1"
        :active="isActive(link.to)"
        active-color="rgba(255,255,255,0.16)"
      >
        <template #title>
          <span class="text-body-2 font-weight-medium text-white">{{ link.title }}</span>
        </template>
        <template #prepend>
          <v-icon size="20" color="white">{{ link.icon }}</v-icon>
        </template>
      </v-list-item>
    </v-list>

    <v-spacer />

    <v-sheet class="pa-4" color="transparent">
      <v-btn
        block
        color="white"
        class="text-error"
        variant="elevated"
        @click="openDonation"
      >
        Donate now
      </v-btn>
      <div class="mt-4 text-caption text-white-70">
        Fuel 150+ community partners serving meals with care. Your R2 donation reaches children in need.
      </div>
    </v-sheet>
  </v-navigation-drawer>
</template>

<script>
export default {
  name: 'SideNav',
  data() {
    return {
      links: [
        { title: 'Home overview', to: '/dashboard/home', icon: 'mdi-home-heart' },
        { title: 'Impact insights', to: '/dashboard/impact', icon: 'mdi-chart-areaspline' },
        { title: 'NGO partners', to: '/dashboard/ngo-partners', icon: 'mdi-hand-heart' },
        { title: 'Partner toolkit', to: '/dashboard/partners', icon: 'mdi-handshake' }
      ]
    }
  },
  methods: {
    isActive(path) {
      return this.$route && this.$route.path.startsWith(path)
    },
    openDonation() {
      if (process.client) {
        window.open('https://pos.snapscan.io/qr/PXMP40263', '_blank')
      }
    }
  }
}
</script>

<style scoped>
.addhope-side-nav {
  background: linear-gradient(160deg, #8c1a1a, #e4002b);
  color: white;
}

.nav-header {
  background: rgba(255, 255, 255, 0.05);
}

.text-white-70 {
  color: rgba(255, 255, 255, 0.7);
}
</style>
