<template>
  <v-container fluid>
    <top-bar-menu-admin />
    <div class="reports-hero">
      <div class="reports-hero__content">
        <div>
          <h1 class="text-h4 font-weight-bold">Daily Impact Reports</h1>
          <p class="text-body-1 mt-2">
            Capture a daily snapshot of meals served, shortages, and wins from
            each centre.
          </p>
        </div>
        <div class="d-flex flex-column align-end gap-2">
          <v-chip
            color="white"
            text-color="deep-purple-darken-2"
            prepend-icon="mdi-calendar-today"
          >
            {{ reportsStore.draft.date }}
          </v-chip>
          <v-chip
            :color="reportsStore.hasSubmittedToday ? 'success' : 'primary'"
            variant="tonal"
            prepend-icon="mdi-check-circle"
          >
            {{
              reportsStore.hasSubmittedToday
                ? "Report submitted"
                : "Awaiting submission"
            }}
          </v-chip>
        </div>
      </div>
      <div class="reports-hero__metrics">
        <v-sheet
          v-for="tile in summaryTiles"
          :key="tile.label"
          class="reports-metric"
          elevation="4"
          rounded="lg"
          color="rgba(255, 255, 255, 0.15)"
        >
          <div class="text-caption text-uppercase">{{ tile.label }}</div>
          <div class="text-h5 font-weight-bold mt-1">{{ tile.value }}</div>
          <div class="text-body-2 mt-2">{{ tile.caption }}</div>
        </v-sheet>
      </div>
    </div>

    <v-container class="mt-n10">
      <v-row dense>
        <v-col cols="12" lg="5">
          <v-card elevation="6" class="pa-6">
            <div class="d-flex justify-space-between align-center">
              <h2 class="text-h6 font-weight-bold">Submit today's report</h2>
              <v-icon color="primary">mdi-clipboard-text-clock</v-icon>
            </div>
            <p class="text-body-2 mb-4">
              Each centre submits one verified report daily. Data drives
              national distribution decisions.
            </p>

            <v-alert v-if="formError" class="mb-4" type="error" variant="tonal">
              {{ formError }}
            </v-alert>

            <v-form @submit.prevent="submitReport">
              <v-text-field
                v-model.number="reportsStore.draft.mealsServed"
                label="Meals served"
                type="number"
                variant="outlined"
                density="comfortable"
                :disabled="reportsStore.hasSubmittedToday"
              ></v-text-field>

              <v-text-field
                v-model.number="reportsStore.draft.childrenFed"
                label="Children fed"
                type="number"
                variant="outlined"
                class="mt-3"
                density="comfortable"
                :disabled="reportsStore.hasSubmittedToday"
              ></v-text-field>

              <v-select
                v-model="reportsStore.draft.shortages"
                :items="['No', 'Yes']"
                label="Shortages encountered?"
                variant="outlined"
                class="mt-3"
                density="comfortable"
                :disabled="reportsStore.hasSubmittedToday"
              ></v-select>

              <v-textarea
                v-if="reportsStore.draft.shortages === 'Yes'"
                v-model="reportsStore.draft.shortageDetails"
                label="Shortage details"
                variant="outlined"
                rows="2"
                class="mt-3"
                :disabled="reportsStore.hasSubmittedToday"
              ></v-textarea>

              <v-textarea
                v-model="reportsStore.draft.remainingStock"
                label="Remaining stock"
                variant="outlined"
                rows="2"
                class="mt-3"
                placeholder="E.g. Maize (2 days), beans (3 days)"
                :disabled="reportsStore.hasSubmittedToday"
              ></v-textarea>

              <v-textarea
                v-model="reportsStore.draft.notes"
                label="Notes / highlights"
                variant="outlined"
                rows="3"
                class="mt-3"
                :disabled="reportsStore.hasSubmittedToday"
              ></v-textarea>

              <v-file-input
                class="mt-3"
                label="Photo / video evidence"
                prepend-icon="mdi-camera"
                variant="outlined"
                multiple
                :disabled="reportsStore.hasSubmittedToday"
                @update:model-value="reportsStore.addAttachments"
              ></v-file-input>

              <div class="d-flex justify-end mt-6">
                <v-btn
                  type="submit"
                  color="primary"
                  :loading="reportsStore.submitting"
                  :disabled="reportsStore.hasSubmittedToday"
                >
                  Submit report
                </v-btn>
              </div>
            </v-form>
          </v-card>
        </v-col>

        <v-col cols="12" lg="7">
          <v-card elevation="6" class="pa-6">
            <div class="d-flex justify-space-between align-center">
              <div>
                <h2 class="text-h6 font-weight-bold">Reporting insights</h2>
                <p class="text-body-2 mb-0">
                  Use these indicators to spot trends and escalate support needs
                  rapidly.
                </p>
              </div>
              <v-btn
                color="primary"
                variant="tonal"
                size="small"
                @click="cycleFilter"
              >
                <v-icon start>mdi-filter-variant</v-icon>
                {{ reportsStore.statusFilter }}
              </v-btn>
            </div>

            <v-sparkline
              class="mt-6"
              :model-value="reportsStore.analytics.mealsTrend"
              color="deep-purple-accent-2"
              smooth
              padding="12"
              stroke-linecap="round"
            ></v-sparkline>

            <v-row class="mt-4" dense>
              <v-col cols="12" sm="6">
                <v-card class="pa-4" color="primary" dark>
                  <div class="text-caption text-uppercase">
                    Meals this month
                  </div>
                  <div class="text-h4 font-weight-bold mt-2">
                    {{ reportsStore.totalMealsThisMonth.toLocaleString() }}
                  </div>
                </v-card>
              </v-col>
              <v-col cols="12" sm="6">
                <v-card class="pa-4" color="success" dark>
                  <div class="text-caption text-uppercase">
                    Verification rate
                  </div>
                  <div class="text-h4 font-weight-bold mt-2">
                    {{ reportsStore.verificationRate }}%
                  </div>
                </v-card>
              </v-col>
            </v-row>

            <div class="d-flex flex-wrap mt-4 status-breakdown">
              <v-chip
                v-for="status in statusBreakdown"
                :key="status.label"
                :color="status.color"
                variant="tonal"
                size="small"
              >
                {{ status.label }}: {{ status.value }}
              </v-chip>
            </div>

            <v-divider class="my-6"></v-divider>

            <div class="d-flex align-center justify-space-between">
              <div>
                <div class="text-caption text-uppercase text-medium-emphasis">
                  Latest submission
                </div>
                <div class="text-h6 font-weight-bold mt-1">
                  {{ latestReport?.center || "Centre" }} ·
                  {{ latestReport?.date || reportsStore.draft.date }}
                </div>
                <div class="text-body-2">
                  {{ latestReport?.notes || "No notes captured yet." }}
                </div>
              </div>
              <v-avatar color="deep-purple-accent-2" size="48">
                <v-icon color="white">mdi-clipboard-check</v-icon>
              </v-avatar>
            </div>

            <v-divider class="my-6"></v-divider>

            <h3 class="text-subtitle-1 font-weight-bold">Recommendations</h3>
            <v-list density="comfortable" class="mt-2">
              <v-list-item
                v-for="recommendation in reportsStore.analytics.recommendations"
                :key="recommendation.id"
              >
                <template #prepend>
                  <v-avatar color="deep-purple-accent-2" size="40">
                    <v-icon color="white">{{ recommendation.icon }}</v-icon>
                  </v-avatar>
                </template>
                <v-list-item-title class="font-weight-medium">{{
                  recommendation.title
                }}</v-list-item-title>
                <v-list-item-subtitle>{{
                  recommendation.description
                }}</v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-card>
        </v-col>
      </v-row>

      <v-row class="mt-8" dense>
        <v-col cols="12">
          <v-card elevation="6" class="pa-6">
            <div class="d-flex justify-space-between align-center">
              <h2 class="text-h6 font-weight-bold">Report archive</h2>
              <v-chip color="primary" variant="tonal">
                {{ reportsStore.reports.length }} submissions
              </v-chip>
            </div>
            <p class="text-body-2">
              Filter by status to surface exceptions or high impact days
              instantly.
            </p>

            <v-data-table
              class="mt-6"
              :headers="reportHeaders"
              :items="reportsStore.filteredReports"
              item-key="id"
              density="comfortable"
            >
              <template #item.status="{ item }">
                <v-chip
                  :color="statusColor(item.status)"
                  size="small"
                  variant="flat"
                >
                  {{ item.status }}
                </v-chip>
              </template>
              <template #item.attachments="{ item }">
                <div class="d-flex flex-wrap report-chip-group">
                  <v-chip
                    v-for="file in item.attachments"
                    :key="file"
                    size="small"
                    color="primary"
                    variant="tonal"
                    prepend-icon="mdi-paperclip"
                  >
                    {{ file }}
                  </v-chip>
                </div>
              </template>
            </v-data-table>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-container>
</template>

<script>
import { mapStores } from "pinia";
import TopBarMenuAdmin from "~/components/dashboard/navBarAdmin.vue";
import { useReportsStore } from "~/stores/reports.js";
import { useAuthStore } from "~/stores/auth.js";

export default {
  name: "AdminReportsPage",
  components: { TopBarMenuAdmin },
  data() {
    return {
      formError: "",
      reportHeaders: [
        { title: "Date", key: "date" },
        { title: "Centre", key: "center" },
        { title: "Meals", key: "mealsServed" },
        { title: "Children", key: "childrenFed" },
        { title: "Shortages", key: "shortages" },
        { title: "Remaining stock", key: "remainingStock" },
        { title: "Notes", key: "notes" },
        { title: "Attachments", key: "attachments" },
        { title: "Status", key: "status" },
      ],
    };
  },
  computed: {
    ...mapStores(useReportsStore, useAuthStore),
    summaryTiles() {
      return [
        {
          label: "Reports this month",
          value: this.reportsStore.reports.length.toLocaleString(),
          caption: "Total submissions logged to date",
        },
        {
          label: "Meals recorded",
          value: this.reportsStore.totalMealsThisMonth.toLocaleString(),
          caption: "Meals captured across daily reports",
        },
        {
          label: "Verification rate",
          value: `${this.reportsStore.verificationRate}%`,
          caption: "Reports signed off by oversight team",
        },
      ];
    },
    statusBreakdown() {
      return this.reportsStore.analytics.statusBreakdown || [];
    },
    latestReport() {
      return this.reportsStore.latestReport;
    },
  },
  created() {
    const centreName =
      this.authStore.activeCenter?.name ||
      this.authStore.activeCenter?.center ||
      "Cape Town Center";
    this.reportsStore.initialise(centreName);
  },
  methods: {
    async submitReport() {
      this.formError = "";
      try {
        const centreName =
          this.authStore.activeCenter?.name ||
          this.authStore.activeCenter?.center ||
          "Cape Town Center";
        await this.reportsStore.submitReport(centreName);
      } catch (error) {
        this.formError = error.message;
      }
    },
    cycleFilter() {
      const filters = ["All", "Submitted", "Verified", "Flagged"];
      const currentIndex = filters.indexOf(this.reportsStore.statusFilter);
      const nextIndex = (currentIndex + 1) % filters.length;
      this.reportsStore.setFilter(filters[nextIndex]);
    },
    statusColor(status) {
      switch (status) {
        case "Verified":
          return "success";
        case "Flagged":
          return "error";
        case "Submitted":
          return "primary";
        default:
          return "info";
      }
    },
  },
};
</script>

<style scoped>
.reports-hero {
  background: linear-gradient(135deg, #fc0909, #3c3635);
  padding-bottom: 100px;
  padding-top: 6%;
  border-bottom-left-radius: 32px;
  border-bottom-right-radius: 32px;
}

.reports-hero__content {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  padding: 32px 48px 72px;
  color: white;
}

.reports-hero__metrics {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  padding: 0 48px 32px;
}

.reports-metric {
  padding: 20px 24px;
  color: white;
  backdrop-filter: blur(6px);
}

.status-breakdown {
  gap: 12px;
}

.report-chip-group {
  gap: 8px;
}

@media (max-width: 960px) {
  .reports-hero__content {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .reports-hero__metrics {
    padding: 0 24px 24px;
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
