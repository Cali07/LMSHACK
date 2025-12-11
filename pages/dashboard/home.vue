<template>
  <v-container class="pa-0 home-page" fluid>
    <TopBarMenu />

    <v-sheet class="hero" rounded="0" dark>
      <v-container>
        <v-row align="center" justify="space-between">
          <v-col cols="12" md="7">
            <h1 class="text-h3 font-weight-bold mb-4">
              Welcome back, {{ displayName }}
            </h1>
            <p class="text-body-1 mb-6">
              Together we are serving warm meals, inspiring futures and shining
              hope into every province. Track today&apos;s wins, support a
              partner or explore where the need is greatest.
            </p>
            <v-btn
              color="white"
              class="red--text text--darken-2 mr-3"
              @click="showDonationDialog = true"
            >
              Donate a meal
            </v-btn>
            <v-btn
              color="white"
              variant="outlined"
              class="text-white"
              @click="scrollTo('#impact-map')"
            >
              View hotspots
            </v-btn>
          </v-col>
          <v-col cols="12" md="5">
            <v-card elevation="6" class="pa-6" color="white" opacity="70%">
              <div class="text-subtitle-2 text-uppercase mb-2">
                Weekly highlight
              </div>
              <div class="text-h5 font-weight-bold mb-3">
                {{ weeklyHighlights[0]?.title }}
              </div>
              <p class="text-body-2 mb-4">
                {{ weeklyHighlights[0]?.description }}
              </p>
              <v-divider class="my-4"></v-divider>
              <div class="d-flex align-center">
                <v-icon color="white" class="mr-3">mdi-food-outline</v-icon>
                <div>
                  <div class="text-caption">Meals served this week</div>
                  <div class="text-h5 font-weight-bold">
                    {{ formatNumber(totalMeals) }}
                  </div>
                </div>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-sheet>

    <v-container class="py-10">
      <v-row class="mb-8" dense>
        <v-col v-for="stat in stats" :key="stat.title" cols="12" sm="6" md="3">
          <v-card elevation="4" class="pa-5 text-center stat-card">
            <v-icon size="36" color="error" class="mb-3">{{
              stat.icon
            }}</v-icon>
            <div class="text-h5 font-weight-bold">{{ stat.value }}</div>
            <div class="text-body-2">{{ stat.title }}</div>
          </v-card>
        </v-col>
      </v-row>

      <v-row class="mb-10" align="stretch">
        <v-col cols="12" md="7">
          <v-card elevation="6" class="pa-4 h-60">
            <v-card-title class="text-h6 font-weight-bold px-6 pt-6"
              >Children that need assistance</v-card-title
            >
            <v-card-text class="pa-2" id="impact-map">
              <MapHotspot />
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="5">
          <v-card elevation="6" class="pa-6 h-100" color="#fff5f5">
            <v-card-title class="text-h6 font-weight-bold"
              >Map of centres</v-card-title
            >
            <v-card-text>
              <p class="text-body-2 mb-4">
                Explore accredited AddHope centres delivering balanced meals
                daily. Discover where your support keeps the pots simmering.
              </p>
              <AllCentersMap />
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <v-row class="mb-10">
        <v-col cols="12">
          <h2 class="text-h4 font-weight-bold text-center mb-6">
            Partner promotions unlocking hope
          </h2>
        </v-col>
        <v-col
          v-for="partner in partners"
          :key="partner.id"
          cols="12"
          sm="6"
          md="4"
        >
          <PromoCards :partner="partner" />
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12">
          <v-card elevation="6" class="pa-6 text-center" color="#fef4f5">
            <h3 class="text-h5 font-weight-bold mb-3">Keep shining hope</h3>
            <p class="text-body-2 mb-6">
              Share your AddHope journey on social media and invite friends to
              donate R2 when they order their favourite meal.
            </p>
            <DonationModal />
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <v-dialog v-model="showDonationDialog" max-width="420">
      <v-card>
        <v-card-title class="text-h6 font-weight-bold"
          >Donate a meal</v-card-title
        >
        <v-card-text>
          <p class="text-body-2">
            Two Rand nourishes a child today. Tap donate to open our secure
            SnapScan link and keep the love going.
          </p>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn variant="text" @click="showDonationDialog = false"
            >Later</v-btn
          >
          <v-btn color="error" @click="donateNow">Donate</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import TopBarMenu from "~/components/dashboard/navBar.vue";
import PromoCards from "~/components/PromoCards.vue";
import DonationModal from "~/components/DonationModal.vue";
import MapHotspot from "~/components/MapHotspot.vue";
import AllCentersMap from "~/components/AllCentersMap.vue";
import { useAuthStore } from "@/stores/auth";
import { usePartnerStore } from "~/stores/partners.js";
import { useHotspotsStore } from "~/stores/hotspots.js";
import { useImpactStore } from "~/stores/impact.js";

export default {
  name: "DashboardHome",
  components: {
    TopBarMenu,
    PromoCards,
    DonationModal,
    MapHotspot,
    AllCentersMap,
  },
  data() {
    return {
      auth: useAuthStore(),
      partnerStore: usePartnerStore(),
      hotspotStore: useHotspotsStore(),
      impactStore: useImpactStore(),
      showDonationDialog: false,
    };
  },
  computed: {
    displayName() {
      return this.auth.user?.email || "AddHope friend";
    },
    partners() {
      return this.partnerStore.partners;
    },
    stats() {
      return this.impactStore.headlineStats;
    },
    totalMeals() {
      return this.impactStore.totalMealsServed;
    },
    weeklyHighlights() {
      return this.impactStore.weeklyHighlights;
    },
  },
  created() {
    this.partnerStore.fetchPartners();
  },
  async mounted() {
    await this.auth.fetchUser();
    if (!this.auth.isLoggedIn()) {
      await this.auth.loginAnonymously();
      await this.hotspotStore.loadHotspotsDefault();
    }
  },
  methods: {
    formatNumber(value) {
      if (!value && value !== 0) {
        return value;
      }
      return new Intl.NumberFormat("en-ZA").format(value);
    },
    donateNow() {
      window.open("https://pos.snapscan.io/qr/PXMP40263", "_blank");
      this.showDonationDialog = false;
    },
    scrollTo(selector) {
      if (process.client) {
        const target = document.querySelector(selector);
        if (target) {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    },
  },
};
</script>

<style scoped>
.home-page {
  background: #faf8f7;
}

.hero {
  background: linear-gradient(120deg, #e4002b, #8c1a1a);
  color: white;
  padding-top: 8%;
  padding-bottom: 64px;
  background-image: url("https://purpose.kfc.co.za/wp-content/uploads/2023/01/03_AddHope_image.webp");
  background-size: cover;
}

.stat-card {
  background: white;
}

/* Tablet styles */
@media (max-width: 1024px) {
  .responsive-logout-item {
    padding: 6px 12px;
  }
  .hero {
    background: linear-gradient(120deg, #e4002b, #8c1a1a);
    color: white;
    padding-top: 10%;
    padding-bottom: 64px;
  }

  .logout-icon {
    font-size: 22px;
  }

  .logout-title {
    font-size: 0.9rem;
  }
}

/* Mobile styles */
@media (max-width: 768px) {
  .responsive-logout-item {
    padding: 4px 8px;
    min-height: 44px; /* Better touch targets */
  }

  .hero {
    background: linear-gradient(120deg, #e4002b, #8c1a1a);
    color: white;
    padding-top: 20%;
    padding-bottom: 64px;
  }

  .logout-icon {
    font-size: 20px;
    margin-right: 12px;
  }

  .logout-title {
    font-size: 0.85rem;
    font-weight: 400;
  }
}

/* Small mobile styles */
@media (max-width: 480px) {
  .responsive-logout-item {
    padding: 6px 12px;
  }

  .hero {
    background: linear-gradient(120deg, #e4002b, #8c1a1a);
    color: white;
    padding-top: 20%;
    padding-bottom: 64px;
  }

  .logout-icon {
    font-size: 18px;
    margin-right: 8px;
  }

  .logout-title {
    font-size: 0.8rem;
  }
}

/* Large desktop styles */
@media (min-width: 1740px) {
  .responsive-logout-item {
    padding: 12px 20px;
  }

  .hero {
    background: linear-gradient(120deg, #e4002b, #8c1a1a);
    color: white;
    padding-top: 40%;
    /* padding-bottom: 64px; */
  }

  .logout-icon {
    font-size: 28px;
  }

  .logout-title {
    font-size: 1.1rem;
  }
}
</style>
