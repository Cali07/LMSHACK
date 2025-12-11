<template>
  <v-container fluid>
    <top-bar-menu-admin />
    <div class="dashboard-hero">
      <div class="hero-overlay">
        <div class="hero-content">
          <div class="hero-copy">
            <h1 class="text-h4 text-sm-h3 font-weight-bold">
              Centre Performance Command Centre
            </h1>
            <p class="text-subtitle-1 mt-2">
              Monitor the pulse of your Add Hope operations with real-time
              delivery, funding and engagement metrics.
            </p>
          </div>
          <div class="hero-actions">
            <v-chip
              class="elevation-2"
              color="deep-purple-accent-2"
              prepend-icon="mdi-update"
              variant="elevated"
            >
              Last sync {{ lastUpdatedLabel }}
            </v-chip>
            <v-btn-toggle
              v-model="insightRange"
              class="mt-3 mt-sm-5"
              color="deep-purple-accent-2"
              density="comfortable"
              rounded="xl"
            >
              <v-btn
                v-for="range in insightRanges"
                :key="range.value"
                :value="range.value"
                variant="tonal"
              >
                <v-icon start size="16">{{ range.icon }}</v-icon>
                {{ range.label }}
              </v-btn>
            </v-btn-toggle>
          </div>
        </div>
        <div class="hero-metrics">
          <v-sheet
            v-for="card in insightCards"
            :key="card.label"
            class="hero-metric"
            :color="card.color"
            elevation="4"
            rounded="lg"
          >
            <div class="text-caption text-uppercase">{{ card.label }}</div>
            <div class="text-h5 font-weight-bold mt-1">{{ card.value }}</div>
            <div class="text-body-2 mt-2">{{ card.caption }}</div>
          </v-sheet>
        </div>
      </div>
    </div>

    <v-container class="mt-n12">
      <!-- KPI Cards -->
      <v-row class="mt-4" dense>
        <v-col
          v-for="card in kpiCards"
          :key="card.title"
          cols="12"
          sm="6"
          md="3"
        >
          <v-card :color="card.color" class="pa-4 kpi-card" dark elevation="6">
            <v-card-title class="align-center justify-space-between pa-0">
              <span>{{ card.title }}</span>
              <v-icon size="30">{{ card.icon }}</v-icon>
            </v-card-title>
            <v-card-text class="text-h4 font-weight-bold pa-0 mt-4">
              {{ card.value }}
            </v-card-text>
            <div class="mt-2 text-body-2">{{ card.caption }}</div>
          </v-card>
        </v-col>
      </v-row>

      <!-- Chart and Resource Levels -->
      <v-row class="mt-6" dense>
        <v-col cols="12" md="8">
          <v-card elevation="6" class="pa-5">
            <div class="d-flex justify-space-between align-center">
              <div>
                <h2 class="text-h5 font-weight-bold">
                  Meals & Donations (7 Day Trend)
                </h2>
                <p class="text-body-2 mb-0">{{ weeklySummary }}</p>
              </div>
              <v-btn
                color="primary"
                variant="tonal"
                size="small"
                @click="refreshData"
              >
                <v-icon start>mdi-refresh</v-icon>
                Refresh
              </v-btn>
            </div>
            <BarChart class="mt-6" :data="dashboardStore.weeklyPerformance" />
          </v-card>
        </v-col>
        <v-col cols="12" md="4">
          <v-card elevation="6" class="pa-5">
            <div class="d-flex align-center justify-space-between">
              <h2 class="text-h6 font-weight-medium">Operational Readiness</h2>
              <v-icon color="primary">mdi-shield-check</v-icon>
            </div>
            <p class="text-body-2">
              Resource levels across core categories to meet tomorrow's meal
              commitments.
            </p>
            <v-list density="compact" class="mt-4">
              <v-list-item
                v-for="resource in dashboardStore.resourceLevels"
                :key="resource.label"
              >
                <template #prepend>
                  <v-progress-circular
                    :model-value="resource.value"
                    :color="resource.color"
                    size="42"
                    width="5"
                  >
                    {{ resource.value }}%
                  </v-progress-circular>
                </template>
                <v-list-item-title class="font-weight-medium">{{
                  resource.label
                }}</v-list-item-title>
                <v-list-item-subtitle>{{
                  readinessLabel(resource.value)
                }}</v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-card>
        </v-col>
      </v-row>

      <!-- Comparison and Hotspots -->
      <v-row class="mt-6" dense>
        <v-col cols="12" lg="7">
          <v-card elevation="6" class="pa-5">
            <div class="d-flex justify-space-between align-center">
              <h2 class="text-h6 font-weight-medium">Centre Comparison</h2>
              <v-chip color="primary" variant="tonal" size="small">
                Satisfaction avg: {{ satisfactionAverage }}%
              </v-chip>
            </div>
            <ComparisonTable
              class="mt-4"
              :centers="dashboardStore.centerComparison"
            />
          </v-card>
        </v-col>
        <v-col cols="12" lg="5">
          <v-card elevation="6" class="pa-5">
            <div class="d-flex justify-space-between align-center">
              <h2 class="text-h6 font-weight-medium">Hunger Hotspots</h2>
              <v-btn color="error" size="small" variant="tonal">
                <v-icon start>mdi-alert</v-icon>
                Respond
              </v-btn>
            </div>
            <MapHotspot class="mt-4" />
            <div class="text-body-2 mt-4">
              Focus logistics on the highlighted wards to stabilise supply over
              the next 48 hours.
            </div>
          </v-card>
        </v-col>
      </v-row>

      <!-- Alerts and Highlights -->
      <v-row class="mt-6" dense>
        <v-col cols="12" md="4">
          <v-card elevation="6" class="pa-5">
            <div class="d-flex justify-space-between align-center">
              <h2 class="text-h6 font-weight-medium">Team Wellness</h2>
              <v-icon color="primary">mdi-heart-pulse</v-icon>
            </div>
            <div class="d-flex align-center mt-6 team-wellness">
              <v-progress-circular
                :model-value="dashboardStore.averageWellnessScore"
                color="deep-purple-accent-2"
                size="120"
                width="12"
              >
                {{ dashboardStore.averageWellnessScore }}%
              </v-progress-circular>
              <div class="text-body-2">
                Staff check-ins indicate energy levels are stable across centres
                with a {{ dashboardStore.averageWellnessScore }}% wellness
                score.
                <div class="mt-3">
                  <v-chip
                    color="deep-purple-accent-2"
                    variant="tonal"
                    size="small"
                  >
                    {{ rangeSummary.onTimeRate }}% on-time routes
                  </v-chip>
                </div>
              </div>
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" md="4">
          <v-card elevation="6" class="pa-5">
            <div class="d-flex justify-space-between align-center">
              <h2 class="text-h6 font-weight-medium">Mission Log</h2>
              <v-icon color="primary">mdi-timeline-text</v-icon>
            </div>
            <v-timeline density="compact" align="start" class="mt-4">
              <v-timeline-item
                v-for="item in dashboardStore.activityFeed"
                :key="item.id"
                :icon="item.icon"
                dot-color="deep-purple-accent-2"
                size="small"
              >
                <div class="d-flex justify-space-between align-center">
                  <div class="font-weight-medium">{{ item.title }}</div>
                  <span class="text-caption text-medium-emphasis">{{
                    item.timestamp
                  }}</span>
                </div>
                <div class="text-body-2">{{ item.description }}</div>
              </v-timeline-item>
            </v-timeline>
          </v-card>
        </v-col>
        <v-col cols="12" md="4">
          <v-card elevation="6" class="pa-5">
            <div class="d-flex justify-space-between align-center">
              <h2 class="text-h6 font-weight-medium">Critical Alerts</h2>
              <v-chip
                :color="
                  dashboardStore.hasCriticalShortages ? 'error' : 'success'
                "
                variant="flat"
                size="small"
              >
                {{
                  dashboardStore.hasCriticalShortages
                    ? "Action Required"
                    : "Stable"
                }}
              </v-chip>
            </div>
            <v-list class="mt-3" density="comfortable">
              <v-list-item
                v-for="alert in dashboardStore.alerts"
                :key="alert.id"
                class="rounded-lg mb-2 alert-tile"
              >
                <template #prepend>
                  <v-avatar :color="alertColor(alert.type)" size="40">
                    <v-icon color="white">{{ alertIcon(alert.type) }}</v-icon>
                  </v-avatar>
                </template>
                <v-list-item-title class="font-weight-medium">{{
                  alert.message
                }}</v-list-item-title>
                <v-list-item-subtitle
                  >Escalate to regional lead</v-list-item-subtitle
                >
              </v-list-item>
            </v-list>
          </v-card>
        </v-col>
      </v-row>

      <v-row class="mt-6" dense>
        <v-col cols="12">
          <v-card elevation="6" class="pa-5">
            <div class="d-flex justify-space-between align-center">
              <h2 class="text-h6 font-weight-medium">Impact Highlights</h2>
              <v-icon color="primary">mdi-star-circle</v-icon>
            </div>
            <v-timeline side="end" class="mt-4" density="compact">
              <v-timeline-item
                v-for="highlight in dashboardStore.impactHighlights"
                :key="highlight.id"
                :dot-color="'primary'"
                :icon="highlight.icon"
                size="small"
              >
                <div class="font-weight-medium">{{ highlight.title }}</div>
                <div class="text-body-2">{{ highlight.description }}</div>
              </v-timeline-item>
            </v-timeline>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-container>
</template>

<script>
import { mapStores } from "pinia";
import ComparisonTable from "~/components/ComparisonTable.vue";
import MapHotspot from "~/components/MapHotspot.vue";
import TopBarMenuAdmin from "~/components/dashboard/navBarAdmin.vue";
import BarChart from "~/components/BarChart.vue";
import { useAdminStore } from "~/stores/admin.js";

export default {
  name: "AdminDashboardPage",
  components: { TopBarMenuAdmin, BarChart, ComparisonTable, MapHotspot },
  data() {
    return {
      insightRange: "week",
      insightRanges: [
        { value: "week", label: "This week", icon: "mdi-calendar-week" },
        { value: "month", label: "This month", icon: "mdi-calendar-range" },
        {
          value: "quarter",
          label: "This quarter",
          icon: "mdi-calendar-multiselect",
        },
      ],
    };
  },
  computed: {
    ...mapStores(useAdminStore),
    dashboardStore() {
      return this.adminStore;
    },
    kpiCards() {
      const stats = this.dashboardStore.stats;
      return [
        {
          title: "Meals Prepared Today",
          value: stats.mealsToday.toLocaleString(),
          color: "primary",
          icon: "mdi-silverware-fork-knife",
          caption: `${this.dashboardStore.totalMealsThisWeek.toLocaleString()} meals this week`,
        },
        {
          title: "Children Nourished",
          value: stats.kidsToday.toLocaleString(),
          color: "success",
          icon: "mdi-emoticon-happy",
          caption: "Includes early childhood centres and shelters",
        },
        {
          title: "Funds Available",
          value: `R${stats.totalFunds.toLocaleString()}`,
          color: "info",
          icon: "mdi-cash-multiple",
          caption: `Raised R${this.dashboardStore.totalDonationsThisWeek.toLocaleString()} this week`,
        },
        {
          title: "Active Shortages",
          value: stats.activeShortages,
          color: stats.activeShortages > 0 ? "error" : "teal-darken-2",
          icon: "mdi-alert-decagram",
          caption:
            stats.activeShortages > 0
              ? "Escalate to logistics team"
              : "All stocks stabilised",
        },
      ];
    },
    satisfactionAverage() {
      if (!this.dashboardStore.centerComparison.length) {
        return 0;
      }
      const total = this.dashboardStore.centerComparison.reduce(
        (sum, centre) => sum + (centre.satisfaction || 0),
        0
      );
      return Math.round(total / this.dashboardStore.centerComparison.length);
    },
    weeklySummary() {
      return `Served ${this.dashboardStore.totalMealsThisWeek.toLocaleString()} meals with R${this.dashboardStore.totalDonationsThisWeek.toLocaleString()} in donations.`;
    },
    lastUpdatedLabel() {
      if (!this.dashboardStore.lastUpdated) {
        return "loading...";
      }
      const date = new Date(this.dashboardStore.lastUpdated);
      return date.toLocaleString();
    },
    rangeSummary() {
      return this.dashboardStore.summaryByRange(this.insightRange);
    },
    insightCards() {
      return [
        {
          label: "Meals served",
          value: this.formatNumber(this.rangeSummary.meals),
          caption: "Kids nourished via centre network",
          color: "rgba(255, 255, 255, 0.16)",
        },
        {
          label: "Donations raised",
          value: `R${this.formatNumber(this.rangeSummary.donations)}`,
          caption: "Funds cleared for outreach",
          color: "rgba(255, 255, 255, 0.1)",
        },
        {
          label: "Active volunteers",
          value: this.formatNumber(this.rangeSummary.volunteers),
          caption: "Hands on the ground this period",
          color: "rgba(255, 255, 255, 0.16)",
        },
      ];
    },
  },
  created() {
    this.dashboardStore.initialiseDashboard();
  },
  methods: {
    refreshData() {
      this.dashboardStore.initialiseDashboard();
    },
    formatNumber(value) {
      if (value === null || value === undefined) {
        return "0";
      }
      return Number(value).toLocaleString();
    },
    readinessLabel(value) {
      if (value >= 75) return "Ready for tomorrow";
      if (value >= 50) return "Monitor closely";
      return "Urgent replenishment";
    },
    alertIcon(type) {
      switch (type) {
        case "shortage":
          return "mdi-alert";
        case "funds":
          return "mdi-finance";
        default:
          return "mdi-account-group";
      }
    },
    alertColor(type) {
      switch (type) {
        case "shortage":
          return "error";
        case "funds":
          return "warning";
        default:
          return "info";
      }
    },
  },
};
</script>

<style scoped>
.dashboard-hero {
  background: linear-gradient(135deg, #fc0909, #3c3635);
  position: relative;
  padding-top: 6%;
  padding-bottom: 100px;
  border-bottom-left-radius: 32px;
  border-bottom-right-radius: 32px;
}

.hero-overlay {
  padding: 32px 48px 80px;
}

.hero-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 16px;
  color: white;
}

.hero-actions {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.hero-metrics {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-top: 32px;
}

.hero-metric {
  padding: 20px 24px;
  color: white;
  backdrop-filter: blur(6px);
}

.team-wellness {
  gap: 16px;
}

.kpi-card {
  min-height: 150px;
}

.alert-tile {
  background-color: rgba(76, 0, 130, 0.05);
}

@media (max-width: 960px) {
  .hero-content {
    flex-direction: column;
    align-items: flex-start;
  }

  .hero-actions {
    align-items: flex-start;
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
}
</style>
