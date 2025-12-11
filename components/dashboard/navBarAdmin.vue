<script>
import { useAuthStore } from "~/stores/auth.js";

export default {
  name: "TopBarMenuAdmin",

  data() {
    return {
      drawer: false,
      // Navigation links for scalability
      navLinks: [
        { name: "Dashboard", to: "/admin/dashboard" },
        { name: "Reports", to: "/admin/reports" },
        // { name: "Request", to: "/admin/request" },
        { name: "Plan", to: "/admin/plan" },
      ],
    };
  },

  methods: {
    logout() {
      const authStore = useAuthStore();
      authStore.logout();
    },
  },
};
</script>

<template>
  <v-app-bar flat color="black" elevation="0" class="px-md-7 px-sm-5">
    <!-- Logo -->
    <router-link to="/" class="pa-0 ma-0">
      <img
        src="https://addhope.kfc.co.za/wp-content/uploads/2025/09/Asset-1.webp"
        class="responsive-img"
      />
    </router-link>

    <!-- Title -->
    <v-toolbar-title class="ml-3 text-h6 font-weight-bold">
      Centers
    </v-toolbar-title>

    <v-spacer></v-spacer>

    <!-- Desktop Navigation -->
    <template v-for="link in navLinks" :key="link.name">
      <v-btn variant="text" class="d-none d-md-flex" :to="link.to">
        {{ link.name }}
      </v-btn>
    </template>

    <v-list-item @click="navigateTo('/dashboard/home')" class="mt-1">
      <template v-slot:prepend>
        <v-icon icon="mdi-logout" color="error"></v-icon>
      </template>
      <v-list-item-title></v-list-item-title>
    </v-list-item>

    <!-- Mobile Hamburger Icon -->
    <v-app-bar-nav-icon
      class="d-flex d-md-none"
      @click="drawer = !drawer"
    ></v-app-bar-nav-icon>
  </v-app-bar>

  <!-- Mobile Navigation Drawer -->
  <v-navigation-drawer v-model="drawer" temporary class="d-md-none">
    <v-list>
      <v-list-item v-for="link in navLinks" :key="link.name" :to="link.to" link>
        <v-list-item-title>{{ link.name }}</v-list-item-title>
      </v-list-item>

      <v-divider></v-divider>

      <v-list-item to="/auth/users/register">
        <v-list-item-title>Sign Up</v-list-item-title>
      </v-list-item>
      <v-list-item to="/auth/users/login">
        <v-list-item-title>Login</v-list-item-title>
      </v-list-item>
      <v-list-item @click="logout">
        <v-list-item-title>Logout</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<style scoped>
.v-toolbar-title {
  font-size: 1.2rem;
  color: white;
}

.v-app-bar {
  background: linear-gradient(90deg, #050505, #030303); /* KFC red gradient */
  color: white;
}
.responsive-img {
  max-width: 20%;
  height: auto;
  display: block;
}
</style>
