<template>
  <v-container class="pa-0 impact-page" fluid>
    <TopBarMenu />
    <v-sheet class="hero" dark rounded="0">
      <v-container>
        <v-row align="center" justify="space-between">
          <v-col cols="12" md="7">
            <h1 class="text-h3 font-weight-bold mb-4">
              See where every AddHope Rand goes
            </h1>
            <p class="text-body-1 mb-6">
              This dashboard brings together hunger hotspots, field reports and
              funding transparency so you can witness the difference your
              donations create.
            </p>
            <v-btn
              color="white"
              class="red--text text--darken-2"
              @click="scrollTo('#map-section')"
            >
              Explore the map
            </v-btn>
          </v-col>
          <v-col cols="12" md="5">
            <v-card elevation="6" class="pa-6" color="white" opacity="70%">
              <div class="text-subtitle-2 mb-2 text-uppercase">
                This week in numbers
              </div>
              <div class="text-h4 font-weight-bold mb-2">
                {{ formatNumber(totalMeals) }} meals
              </div>
              <div class="text-body-2">served across our priority centres.</div>
              <v-divider class="my-4"></v-divider>
              <div
                v-for="highlight in weeklyHighlights"
                :key="highlight.title"
                class="d-flex align-center mb-3"
              >
                <v-icon color="white" class="mr-3">{{ highlight.icon }}</v-icon>
                <div>
                  <div class="font-weight-medium">{{ highlight.title }}</div>
                  <div class="text-caption">{{ highlight.description }}</div>
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

      <v-row id="map-section" class="mb-10" align="stretch">
        <v-col cols="12" md="7">
          <v-card elevation="6" class="pa-0 overflow-hidden h-100">
            <v-card-title class="text-h6 font-weight-bold px-6 pt-6"
              >Hunger hotspots</v-card-title
            >
            <v-card-subtitle class="px-6 pb-2"
              >Priority areas monitored daily with partner
              reports</v-card-subtitle
            >
            <v-card-text class="pa-0">
              <MapHotspot />
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="5">
          <v-card elevation="6" class="pa-6 h-100" color="#fff5f5">
            <v-card-title class="text-h6 font-weight-bold"
              >Field intelligence</v-card-title
            >
            <v-card-text>
              <p class="text-body-2 mb-4">
                We combine satellite data, partner check-ins and school
                attendance insights to rank communities needing urgent support.
              </p>
              <v-list density="compact">
                <v-list-item
                  v-for="report in fieldReports"
                  :key="report.location"
                >
                  <template #prepend>
                    <v-icon color="error">mdi-map-marker-radius</v-icon>
                  </template>
                  <v-list-item-title>{{ report.location }}</v-list-item-title>
                  <v-list-item-subtitle>
                    {{ formatNumber(report.mealsServed) }} meals ·
                    {{ formatNumber(report.childrenImpacted) }} children reached
                  </v-list-item-subtitle>
                  <div class="text-caption mt-1">
                    {{ report.shortagesAddressed }}
                  </div>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <v-row class="mb-10" align="stretch">
        <v-col cols="12" md="6">
          <v-card elevation="6" class="pa-6 h-100">
            <v-card-title class="text-h6 font-weight-bold"
              >How donations are allocated</v-card-title
            >
            <v-card-text>
              <div
                v-for="allocation in fundAllocation"
                :key="allocation.category"
                class="mb-4"
              >
                <div class="d-flex justify-space-between align-center mb-1">
                  <span class="font-weight-medium">{{
                    allocation.category
                  }}</span>
                  <span class="text-caption">{{ allocation.percentage }}%</span>
                </div>
                <v-progress-linear
                  color="error"
                  rounded
                  height="10"
                  :model-value="allocation.percentage"
                ></v-progress-linear>
                <div class="text-caption mt-1">
                  {{ allocation.description }}
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="6">
          <v-card elevation="6" class="pa-6 h-100" color="#fef4f5">
            <v-card-title class="text-h6 font-weight-bold"
              >Transparency snapshot</v-card-title
            >
            <v-card-text>
              <v-list density="comfortable">
                <v-list-item>
                  <template #prepend>
                    <v-icon color="error">mdi-calendar-check</v-icon>
                  </template>
                  <v-list-item-title>Last audit</v-list-item-title>
                  <v-list-item-subtitle>{{
                    transparency.lastAudit
                  }}</v-list-item-subtitle>
                </v-list-item>
                <v-list-item>
                  <template #prepend>
                    <v-icon color="error">mdi-account-tie</v-icon>
                  </template>
                  <v-list-item-title>Auditor</v-list-item-title>
                  <v-list-item-subtitle>{{
                    transparency.auditor
                  }}</v-list-item-subtitle>
                </v-list-item>
              </v-list>
              <p class="text-body-2 mt-4">{{ transparency.summary }}</p>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12">
          <v-card elevation="6" class="pa-6">
            <v-card-title class="text-h6 font-weight-bold"
              >Detailed accountability log</v-card-title
            >
            <v-data-table
              :headers="tableHeaders"
              :items="fieldReports"
              class="mt-4"
              density="comfortable"
              hide-default-footer
            >
              <template #item.mealsServed="{ value }">
                {{ formatNumber(value) }}
              </template>
              <template #item.childrenImpacted="{ value }">
                {{ formatNumber(value) }}
              </template>
            </v-data-table>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-container>
</template>

<script>
import MapHotspot from "~/components/MapHotspot.vue";
import TopBarMenu from "~/components/dashboard/navBar.vue";
import { useHotspotsStore } from "~/stores/hotspots.js";
import { useImpactStore } from "~/stores/impact.js";

export default {
  name: "ImpactDashboard",
  components: { TopBarMenu, MapHotspot },
  data() {
    return {
      impactStore: useImpactStore(),
      hotspotStore: useHotspotsStore(),
      tableHeaders: [
        { title: "Location", key: "location" },
        { title: "Meals served", key: "mealsServed", align: "end" },
        { title: "Children impacted", key: "childrenImpacted", align: "end" },
        { title: "Shortages addressed", key: "shortagesAddressed" },
      ],
    };
  },
  computed: {
    stats() {
      return this.impactStore.headlineStats;
    },
    fundAllocation() {
      return this.impactStore.fundAllocation;
    },
    weeklyHighlights() {
      return this.impactStore.weeklyHighlights;
    },
    fieldReports() {
      return this.impactStore.fieldReports;
    },
    totalMeals() {
      return this.impactStore.totalMealsServed;
    },
    transparency() {
      return this.impactStore.transparencyNotes;
    },
  },
  methods: {
    formatNumber(value) {
      if (!value && value !== 0) {
        return value;
      }
      return new Intl.NumberFormat("en-ZA").format(value);
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
.impact-page {
  background: #faf8f7;
}

.hero {
  background: linear-gradient(120deg, #e4002b, #8c1a1a);
  color: white;
  padding-top: 8%;
  padding-bottom: 64px;
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
