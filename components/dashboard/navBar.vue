<script>
import { useAuthStore } from "~/stores/auth.js";

export default {
  name: "TopBarMenu",

  data() {
    return {
      drawer: false,
      profileMenu: false,
      // Navigation links for scalability
      navLinks: [
        { name: "Home", to: "/" },
        { name: "Impact", to: "/dashboard/impact" },
        { name: "Partner Promotions", to: "/dashboard/partners" },
        { name: "NGOs Partner Up", to: "/dashboard/ngo-partners" },
        { name: "Admin Centers", to: "/admin" },
      ],
    };
  },

  methods: {
    logout() {
      const authStore = useAuthStore();
      authStore.logout();
      this.profileMenu = false;
    },

    navigateTo(route) {
      this.$router.push(route);
      this.profileMenu = false;
    },

    toggleDrawer() {
      this.drawer = !this.drawer;
    },

    closeDrawer() {
      this.drawer = false;
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
    <v-toolbar-title class="ml-3 text-h6 font-weight-bold"> </v-toolbar-title>

    <v-spacer></v-spacer>

    <!-- Desktop Navigation -->
    <template v-for="link in navLinks" :key="link.name">
      <v-btn variant="text" class="d-none d-md-flex" :to="link.to">
        {{ link.name }}
      </v-btn>
    </template>

    <!-- Profile Icon with Dropdown -->
    <v-menu
      v-model="profileMenu"
      :close-on-content-click="true"
      location="bottom end"
      offset="10"
    >
      <template v-slot:activator="{ props }">
        <v-btn icon v-bind="props" class="ml-2">
          <v-icon color="black" size="30">mdi-account-circle</v-icon>
        </v-btn>
      </template>

      <v-card min-width="200">
        <v-list density="compact" nav>
          <v-list-item @click="navigateTo('/auth/login')" class="mb-1">
            <template v-slot:prepend>
              <v-icon icon="mdi-login" color="green"></v-icon>
            </template>
            <v-list-item-title>Login</v-list-item-title>
          </v-list-item>

          <v-list-item @click="navigateTo('/auth/register')" class="mb-1">
            <template v-slot:prepend>
              <v-icon icon="mdi-account-plus" color="secondary"></v-icon>
            </template>
            <v-list-item-title>Sign Up</v-list-item-title>
          </v-list-item>

          <v-divider></v-divider>

          <v-list-item @click="navigateTo('/dashboard/home')" class="mt-1">
            <template v-slot:prepend>
              <v-icon icon="mdi-logout" color="error"></v-icon>
            </template>
            <v-list-item-title>Logout</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-card>
    </v-menu>

    <!-- Mobile Hamburger/Close Icon -->
    <v-btn icon class="d-flex d-md-none hamburger-icon" @click="toggleDrawer">
      <v-icon v-if="!drawer">mdi-menu</v-icon>
      <!-- <v-icon v-else>mdi-close</v-icon> -->
    </v-btn>
  </v-app-bar>

  <!-- Mobile Navigation Drawer -->
  <v-navigation-drawer v-model="drawer" temporary class="d-md-none">
    <v-list>
      <!-- Close button in drawer header -->
      <v-list-item class="d-flex d-md-none mb-2">
        <v-list-item-title class="text-h6 font-weight-bold"
          >Menu</v-list-item-title
        >
        <template v-slot:append>
          <v-btn icon @click="closeDrawer" class="hamburger-icon">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </template>
      </v-list-item>

      <v-divider class="mb-2"></v-divider>

      <v-list-item
        v-for="link in navLinks"
        :key="link.name"
        :to="link.to"
        link
        @click="closeDrawer"
      >
        <v-list-item-title>{{ link.name }}</v-list-item-title>
      </v-list-item>

      <v-divider></v-divider>

      <!-- Profile Section in Mobile Drawer -->
      <v-list-subheader>Account</v-list-subheader>

      <v-list-item
        @click="
          () => {
            navigateTo('/auth/login');
            closeDrawer();
          }
        "
      >
        <template v-slot:prepend>
          <v-icon icon="mdi-login" color="green"></v-icon>
        </template>
        <v-list-item-title>Login</v-list-item-title>
      </v-list-item>

      <v-list-item
        @click="
          () => {
            navigateTo('/auth/register');
            closeDrawer();
          }
        "
      >
        <template v-slot:prepend>
          <v-icon icon="mdi-account-plus" color="secondary"></v-icon>
        </template>
        <v-list-item-title>Sign Up</v-list-item-title>
      </v-list-item>

      <v-list-item
        @click="
          () => {
            logout();
            closeDrawer();
          }
        "
      >
        <template v-slot:prepend>
          <v-icon icon="mdi-logout" color="error"></v-icon>
        </template>
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
  color: white;
}

.responsive-img {
  max-width: 20%;
  height: auto;
  display: block;
}

/* Style for the profile icon button */
.v-btn--icon {
  color: white;
}

/* Ensure the profile menu stands out */
.v-menu__content {
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* Make hamburger/close icon black for mobile */
.hamburger-icon {
  color: white !important;
}

/* Target the Vuetify buttons specifically */
:deep(.v-btn--icon) {
  background-color: black;
}

/* Ensure the icon inherits the black color */
:deep(.v-btn--icon .v-icon) {
  color: inherit !important;
}
</style>
