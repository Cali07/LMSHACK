<template>
  <v-container fluid>
    <top-bar-menu-admin />
    <div class="plan-hero">
      <div class="plan-hero__content">
        <div>
          <h1 class="text-h4 font-weight-bold">Route & Meal Planning Studio</h1>
          <p class="text-body-1 mt-2">
            Design optimised trips, balance nutrition, and co-ordinate suppliers
            for every centre.
          </p>
        </div>
        <v-chip
          color="primary"
          variant="elevated"
          prepend-icon="mdi-map-marker-path"
        >
          {{ destinationBadge }}
        </v-chip>
      </div>
      <div class="plan-hero__metrics">
        <v-sheet
          v-for="tile in summaryTiles"
          :key="tile.label"
          class="plan-metric"
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
        <v-col cols="12" lg="7">
          <v-card elevation="6" class="pa-6">
            <div class="d-flex justify-space-between align-center">
              <div>
                <h2 class="text-h6 font-weight-bold">New Trip Blueprint</h2>
                <p class="text-body-2 mb-0">
                  Capture trip details and up to ten delivery destinations per
                  centre.
                </p>
              </div>
              <v-btn
                color="primary"
                variant="tonal"
                size="small"
                :disabled="!planStore.canAddDestination"
                @click="planStore.addDestination"
              >
                <v-icon start>mdi-map-marker-plus</v-icon>
                Add destination
              </v-btn>
            </div>

            <v-alert v-if="formError" type="error" class="mt-4" variant="tonal">
              {{ formError }}
            </v-alert>

            <v-form class="mt-5" @submit.prevent="submitTrip">
              <v-row dense>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="planStore.draftTrip.name"
                    label="Trip name"
                    placeholder="Winter outreach run"
                    variant="outlined"
                    density="comfortable"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="3">
                  <v-text-field
                    v-model="planStore.draftTrip.startDate"
                    label="Start date"
                    type="date"
                    variant="outlined"
                    density="comfortable"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="3">
                  <v-text-field
                    v-model="planStore.draftTrip.endDate"
                    label="End date"
                    type="date"
                    variant="outlined"
                    density="comfortable"
                  ></v-text-field>
                </v-col>
              </v-row>

              <v-textarea
                v-model="planStore.draftTrip.notes"
                label="Trip notes"
                variant="outlined"
                rows="3"
                class="mt-2"
                placeholder="Include volunteers, expected challenges, community partners..."
              ></v-textarea>

              <div class="mt-6">
                <h3 class="text-subtitle-1 font-weight-bold">Destinations</h3>
                <p class="text-body-2">
                  Provide address, meal volume and duration. AI will optimise
                  sequencing automatically.
                </p>
              </div>

              <v-row
                v-for="(destination, index) in planStore.draftTrip.destinations"
                :key="destination.id"
                dense
                class="mt-1"
              >
                <v-col cols="12" md="9">
                  <v-autocomplete
                    v-model="destination.address"
                    :items="addressOptions"
                    :loading="loadingAddresses"
                    v-model:search="addressSearch"
                    label="Address / community name"
                    placeholder="Search address"
                    variant="outlined"
                    density="comfortable"
                    hide-no-data
                    hide-details
                    item-title="name"
                    item-value="name"
                  />
                </v-col>
                <v-col cols="6" md="3">
                  <v-text-field
                    v-model.number="destination.duration"
                    type="number"
                    label="Duration (days)"
                    min="1"
                    variant="outlined"
                    density="comfortable"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" class="d-flex justify-end">
                  <v-btn
                    variant="text"
                    color="error"
                    size="small"
                    :disabled="planStore.draftTrip.destinations.length === 1"
                    @click="planStore.removeDestination(index)"
                  >
                    <v-icon start>mdi-delete</v-icon>
                    Remove
                  </v-btn>
                </v-col>
              </v-row>

              <div class="d-flex justify-end mt-6">
                <v-btn
                  type="submit"
                  color="primary"
                  :loading="planStore.loading"
                >
                  Generate plan
                </v-btn>
              </div>
            </v-form>
          </v-card>
        </v-col>

        <v-col cols="12" lg="5">
          <v-card elevation="6" class="pa-6">
            <div class="d-flex align-center flex-wrap ai-assistant__header">
              <div class="d-flex align-center ai-assistant__title">
                <h2 class="text-h6 font-weight-bold mb-0">
                  AI Logistics Assistant
                </h2>
                <v-icon color="primary">mdi-robot-excited-outline</v-icon>
              </div>
              <v-spacer></v-spacer>
              <v-btn
                color="deep-purple-accent-2"
                variant="tonal"
                size="small"
                prepend-icon="mdi-file-pdf-box"
                :loading="reportDownloading"
                :disabled="reportDownloading || !planStore.latestPlanReport"
                @click="downloadPlanReport"
              >
                Download AI report
              </v-btn>
            </div>
            <p class="text-body-2 mt-1">
              Instant insights on routes, suppliers and smart meal combinations
              tailored for South African communities.
            </p>

            <v-alert
              v-if="planStore.optimisationSummary"
              class="mt-4"
              type="success"
              variant="tonal"
              icon="mdi-check-decagram"
            >
              {{ planStore.optimisationSummary }}
            </v-alert>

            <div
              v-if="planStore.latestPlanReport"
              class="text-caption text-medium-emphasis mt-2"
            >
              Latest report generated {{ latestPlanGeneratedAt || "just now" }}
            </div>

            <v-alert
              v-if="reportError"
              class="mt-4"
              type="error"
              variant="tonal"
              icon="mdi-alert-circle-outline"
            >
              {{ reportError }}
            </v-alert>

            <h3 class="text-subtitle-1 font-weight-bold mt-6">
              Suggested suppliers
            </h3>
            <v-list density="comfortable">
              <v-list-item
                v-for="supplier in planStore.suppliers"
                :key="supplier.name"
              >
                <v-list-item-title class="font-weight-medium">{{
                  supplier.name
                }}</v-list-item-title>
                <v-list-item-subtitle>{{
                  supplier.specialty
                }}</v-list-item-subtitle>
                <template #append>
                  <div class="text-right">
                    <div class="text-body-2">{{ supplier.distance }}</div>
                    <v-chip size="small" color="success" variant="tonal"
                      >{{ supplier.priceIndex }} cost</v-chip
                    >
                  </div>
                </template>
              </v-list-item>
            </v-list>

            <h3 class="text-subtitle-1 font-weight-bold mt-6">Meal ideas</h3>
            <v-row dense>
              <v-col
                v-for="meal in planStore.mealSuggestions"
                :key="meal.name"
                cols="12"
              >
                <v-card
                  variant="tonal"
                  color="deep-purple-accent-1"
                  class="pa-4"
                >
                  <div class="d-flex justify-space-between align-center">
                    <div>
                      <div class="font-weight-medium">{{ meal.name }}</div>
                      <div class="text-body-2">{{ meal.nutritionalFocus }}</div>
                    </div>
                    <v-chip
                      color="white"
                      text-color="deep-purple-darken-3"
                      variant="flat"
                      size="small"
                    >
                      {{ meal.costPerChild }} / child
                    </v-chip>
                  </div>
                </v-card>
              </v-col>
            </v-row>
            <h3 class="text-subtitle-1 font-weight-bold mt-6">
              Centre insights
            </h3>
            <v-list density="comfortable">
              <v-list-item
                v-for="insight in planStore.centreInsights"
                :key="insight.id"
              >
                <template #prepend>
                  <v-avatar color="deep-purple-accent-2" size="40">
                    <v-icon color="white">{{ insight.icon }}</v-icon>
                  </v-avatar>
                </template>
                <v-list-item-title class="font-weight-medium">{{
                  insight.title
                }}</v-list-item-title>
                <v-list-item-subtitle>{{
                  insight.description
                }}</v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-card>
        </v-col>
      </v-row>

      <v-row class="mt-6" dense>
        <v-col cols="12">
          <v-card elevation="6" class="pa-6">
            <div class="hotspot-card__header">
              <div>
                <h2 class="text-h6 font-weight-bold">
                  Hunger Hotspots overview
                </h2>
                <p class="text-body-2 mb-0">
                  Assess severity and prioritise outreach by filtering hotspots
                  per province.
                </p>
              </div>
              <div class="hotspot-controls">
                <v-select
                  v-model="selectedProvince"
                  :items="provinceOptions"
                  item-title="title"
                  item-value="value"
                  label="Filter by province"
                  variant="outlined"
                  density="comfortable"
                  class="hotspot-select"
                  hide-details
                  clearable
                  @update:model-value="onProvinceChange"
                ></v-select>
                <v-btn
                  color="primary"
                  class="hotspot-controls__action"
                  :loading="hotspotsStore.loading"
                  :disabled="hotspotsStore.loading"
                  @click="searchHotspots"
                >
                  Search
                </v-btn>
                <v-btn
                  color="success"
                  class="hotspot-controls__export"
                  variant="tonal"
                  :loading="exporting"
                  :disabled="
                    hotspotsStore.loading || exporting || !hotspotRows.length
                  "
                  prepend-icon="mdi-file-excel"
                  @click="exportHotspots"
                >
                  Export Excel
                </v-btn>
                <v-btn
                  variant="text"
                  class="hotspot-controls__reset"
                  :disabled="hotspotsStore.loading"
                  @click="resetProvince"
                >
                  Reset
                </v-btn>
              </div>
            </div>
            <div
              v-if="hotspotsLastUpdated"
              class="text-caption text-medium-emphasis mt-3"
            >
              Updated: {{ formatDateTime(hotspotsLastUpdated) }}
            </div>
            <v-alert
              v-if="hotspotsStore.error"
              type="error"
              variant="tonal"
              class="mt-4"
            >
              {{ hotspotsStore.error }}
            </v-alert>
            <v-alert
              v-if="exportError"
              type="error"
              variant="tonal"
              class="mt-4"
            >
              {{ exportError }}
            </v-alert>
            <v-data-table
              class="mt-4"
              :headers="hotspotHeaders"
              :items="hotspotRows"
              item-key="id"
              density="comfortable"
              :items-per-page="10"
              :loading="hotspotsStore.loading"
              loading-text="Loading hotspots..."
            >
              <template #item.band="{ item }">
                <v-chip
                  :style="{
                    background: severityColor(item.band),
                    color: '#fff',
                  }"
                  size="small"
                >
                  {{ item.band }}
                </v-chip>
              </template>
              <template #item.reasons="{ item }">
                <ul class="hotspot-reasons">
                  <li
                    v-for="(reason, index) in item.reasons.slice(0, 3)"
                    :key="index"
                  >
                    {{ reason }}
                  </li>
                </ul>
              </template>
              <template #bottom></template>
            </v-data-table>
            <v-alert
              v-if="!hotspotsStore.loading && !hotspotRows.length"
              type="info"
              variant="tonal"
              class="mt-4"
            >
              No hotspots found for the selected province.
            </v-alert>
          </v-card>
        </v-col>
      </v-row>

      <v-row class="mt-6" dense>
        <v-col cols="12">
          <v-card elevation="6" class="pa-6">
            <div class="impact-card__header">
              <div>
                <h2 class="text-h6 font-weight-bold">
                  {{ impactTable.meta.title }}
                </h2>
                <p class="text-body-2 mb-0">
                  {{ impactTable.meta.notes }}
                </p>
              </div>
              <div class="impact-card__meta text-right">
                <div class="text-caption text-medium-emphasis">
                  Updated: {{ formatDateTime(impactTable.meta.updatedAt) }}
                </div>
                <div class="text-caption text-medium-emphasis">
                  Currency: {{ impactTable.meta.currency }}
                </div>
              </div>
            </div>

            <v-alert
              class="mt-4"
              type="info"
              variant="tonal"
              border="start"
              density="comfortable"
            >
              The AI impact feed summarises recent centre activity, readiness,
              and partner actions for the highest priority hotspots.
            </v-alert>

            <v-data-table
              class="mt-4 impact-table"
              :headers="impactHeaders"
              :items="impactRows"
              item-key="id"
              density="comfortable"
              :items-per-page="10"
            >
              <template #item.rank="{ item }">
                <span class="font-weight-medium">#{{ item.rank }}</span>
              </template>
              <template #item.severityBand="{ item }">
                <v-chip
                  :style="{
                    background: impactBandColor(item.severityBand),
                    color: '#fff',
                  }"
                  size="small"
                >
                  {{ item.severityBand }}
                </v-chip>
              </template>
              <template #item.severityScore="{ item }">
                <span class="font-weight-medium">{{ item.severityScore }}</span>
              </template>
              <template #item.footprint="{ item }">
                <div class="impact-footprint">
                  <div class="text-body-2 font-weight-medium">
                    {{ item.footprint.nearest_center }}
                  </div>
                  <div class="text-caption text-medium-emphasis">
                    {{ formatDistance(item.footprint.distance_km) }} km ·
                    {{ formatNumber(item.footprint.trips_30d) }} trips/30d ·
                    {{ formatNumber(item.footprint.avg_meals_per_trip) }} meals/
                    trip
                  </div>
                  <div class="text-caption impact-footprint__readiness">
                    <span>Readiness:</span>
                    <v-chip
                      size="x-small"
                      :style="{
                        background: impactBandColor(
                          item.footprint.readiness_band
                        ),
                        color: '#fff',
                      }"
                      variant="flat"
                    >
                      {{ item.footprint.readiness_band }}
                    </v-chip>
                    <span>({{ item.footprint.readiness_index }})</span>
                    <span class="d-block mt-1">
                      Volunteers: {{ formatNumber(item.footprint.volunteers_on_rota) }}
                    </span>
                  </div>
                </div>
              </template>
              <template #item.action="{ item }">
                <div class="impact-action">
                  <v-chip
                    size="small"
                    :color="impactStatusColor(item.action.status)"
                    variant="tonal"
                  >
                    {{ item.action.status }}
                  </v-chip>
                  <div class="text-caption text-medium-emphasis mt-1">
                    ETA: {{ formatDateTime(item.action.eta) }}
                  </div>
                  <div
                    v-if="Array.isArray(item.action.route_stops) && item.action.route_stops.length"
                    class="text-caption mt-1"
                  >
                    {{ formatRouteStops(item.action.route_stops) }}
                  </div>
                  <v-btn
                    v-if="item.action.open_route_url"
                    :href="item.action.open_route_url"
                    target="_blank"
                    variant="text"
                    size="small"
                    color="primary"
                    class="mt-1 px-0"
                  >
                    Open route
                  </v-btn>
                </div>
              </template>
              <template #item.impact="{ item }">
                <div class="impact-metrics">
                  <div class="text-body-2 font-weight-medium">
                    {{ formatNumber(item.impact.meals) }} meals
                  </div>
                  <div class="text-caption text-medium-emphasis">
                    {{ formatNumber(item.impact.deliveries) }} deliveries · Last
                    report {{ formatDateTime(item.impact.last_report_at) }}
                  </div>
                  <div class="text-caption mt-1">
                    Evidence: {{ item.impact.evidence.photos }} photos ·
                    {{ item.impact.evidence.receipts }} receipts
                  </div>
                </div>
              </template>
              <template #item.ngos="{ item }">
                <div class="impact-chip-group">
                  <v-chip
                    v-for="ngo in item.ngos"
                    :key="ngo.name"
                    size="small"
                    color="deep-purple-accent-1"
                    variant="tonal"
                    class="ma-1"
                  >
                    {{ ngo.name }} — {{ ngo.focus }}
                  </v-chip>
                </div>
              </template>
              <template #item.kfcCanDo="{ item }">
                <ul class="impact-list">
                  <li v-for="(action, index) in item.kfcCanDo" :key="index">
                    {{ action }}
                  </li>
                </ul>
              </template>
              <template #item.kfcHasDone="{ item }">
                <ul class="impact-list">
                  <li v-for="(action, index) in item.kfcHasDone" :key="index">
                    {{ action }}
                  </li>
                </ul>
              </template>
              <template #bottom></template>
            </v-data-table>
          </v-card>
        </v-col>
      </v-row>

      <v-row class="mt-6" dense>
        <v-col cols="12" md="6">
          <v-card elevation="6" class="pa-6">
            <div class="d-flex justify-space-between align-center">
              <h2 class="text-h6 font-weight-bold">Milestone tracker</h2>
              <v-chip color="primary" variant="tonal"
                >{{ planStore.milestones.length }} touchpoints</v-chip
              >
            </div>
            <v-timeline align="start" density="compact" class="mt-4">
              <v-timeline-item
                v-for="milestone in planStore.milestones"
                :key="milestone.id"
                :dot-color="milestoneColor(milestone.status)"
                size="small"
              >
                <div class="d-flex justify-space-between align-center">
                  <div class="font-weight-medium">{{ milestone.name }}</div>
                  <span class="text-caption text-medium-emphasis">{{
                    milestone.date
                  }}</span>
                </div>
                <div class="text-body-2">{{ milestone.description }}</div>
                <v-chip
                  class="mt-2"
                  :color="milestoneColor(milestone.status)"
                  size="x-small"
                  variant="flat"
                >
                  {{ milestone.status }}
                </v-chip>
              </v-timeline-item>
            </v-timeline>
          </v-card>
        </v-col>
        <v-col cols="12" md="6">
          <v-card elevation="6" class="pa-6">
            <div class="d-flex justify-space-between align-center">
              <h2 class="text-h6 font-weight-bold">Logistics checklist</h2>
              <v-icon color="primary">mdi-clipboard-check-outline</v-icon>
            </div>
            <p class="text-body-2 mt-1">
              Use this quick scan before dispatch to ensure vehicles, supplies,
              and crew are aligned.
            </p>
            <v-list density="comfortable" class="mt-4">
              <v-list-item>
                <template #prepend>
                  <v-icon color="success">mdi-battery-high</v-icon>
                </template>
                <v-list-item-title class="font-weight-medium"
                  >Cold storage charged</v-list-item-title
                >
                <v-list-item-subtitle
                  >Freezers pre-cooled and temp logs synced to
                  cloud.</v-list-item-subtitle
                >
              </v-list-item>
              <v-list-item>
                <template #prepend>
                  <v-icon color="primary">mdi-account-check-outline</v-icon>
                </template>
                <v-list-item-title class="font-weight-medium"
                  >Volunteer roster confirmed</v-list-item-title
                >
                <v-list-item-subtitle
                  >Shift leaders acknowledged SMS reminders this
                  morning.</v-list-item-subtitle
                >
              </v-list-item>
              <v-list-item>
                <template #prepend>
                  <v-icon color="warning">mdi-gas-station</v-icon>
                </template>
                <v-list-item-title class="font-weight-medium"
                  >Fuel plan</v-list-item-title
                >
                <v-list-item-subtitle
                  >Top-up scheduled for 05:30 to avoid depot
                  queues.</v-list-item-subtitle
                >
              </v-list-item>
            </v-list>
          </v-card>
        </v-col>
      </v-row>

      <v-row class="mt-8" dense>
        <v-col cols="12">
          <v-card elevation="6" class="pa-6">
            <div class="d-flex justify-space-between align-center">
              <div>
                <h2 class="text-h6 font-weight-bold">Trip history</h2>
                <p class="text-body-2 mb-0">
                  Review active plans, monitor logistics readiness, and reopen
                  notes in one place.
                </p>
              </div>
              <v-chip color="primary" variant="tonal">
                {{ planStore.trips.length }} total plans
              </v-chip>
            </div>

            <v-row class="mt-6" dense>
              <v-col cols="12" md="6">
                <h3
                  class="text-subtitle-1 font-weight-bold d-flex align-center gap-small"
                >
                  <v-icon color="primary">mdi-timeline-clock</v-icon>
                  Upcoming
                </h3>
                <v-expansion-panels>
                  <v-expansion-panel
                    v-for="trip in planStore.upcomingTrips"
                    :key="trip.id"
                    elevation="0"
                  >
                    <v-expansion-panel-title>
                      <div>
                        <div class="font-weight-medium">{{ trip.name }}</div>
                        <div class="text-caption">
                          {{ formatDate(trip.startDate) }} →
                          {{ formatDate(trip.endDate) }}
                        </div>
                      </div>
                      <v-chip color="info" size="small" variant="flat">{{
                        trip.status
                      }}</v-chip>
                    </v-expansion-panel-title>
                    <v-expansion-panel-text>
                      <div class="text-body-2">{{ trip.notes }}</div>
                      <div class="d-flex flex-wrap mt-3 panel-chip-group">
                        <v-chip
                          v-for="destination in trip.destinations"
                          :key="destination.address"
                          color="deep-purple-accent-2"
                          text-color="white"
                          size="small"
                        >
                          {{ destination.address }} ({{ destination.meals }}
                          meals)
                        </v-chip>
                      </div>
                    </v-expansion-panel-text>
                  </v-expansion-panel>
                  <v-alert
                    v-if="!planStore.upcomingTrips.length"
                    type="info"
                    variant="tonal"
                    class="mt-2"
                  >
                    No upcoming trips yet. Create a plan to get started.
                  </v-alert>
                </v-expansion-panels>
              </v-col>
              <v-col cols="12" md="6">
                <h3
                  class="text-subtitle-1 font-weight-bold d-flex align-center gap-small"
                >
                  <v-icon color="primary">mdi-history</v-icon>
                  Completed
                </h3>
                <v-expansion-panels>
                  <v-expansion-panel
                    v-for="trip in planStore.pastTrips"
                    :key="trip.id"
                    elevation="0"
                  >
                    <v-expansion-panel-title>
                      <div>
                        <div class="font-weight-medium">{{ trip.name }}</div>
                        <div class="text-caption">
                          {{ formatDate(trip.startDate) }} →
                          {{ formatDate(trip.endDate) }}
                        </div>
                      </div>
                      <v-chip color="success" size="small" variant="flat">{{
                        trip.status
                      }}</v-chip>
                    </v-expansion-panel-title>
                    <v-expansion-panel-text>
                      <div class="text-body-2">{{ trip.notes }}</div>
                      <div class="d-flex flex-wrap mt-3 panel-chip-group">
                        <v-chip
                          v-for="destination in trip.destinations"
                          :key="destination.address"
                          color="success"
                          text-color="white"
                          size="small"
                        >
                          {{ destination.address }} ({{ destination.meals }}
                          meals)
                        </v-chip>
                      </div>
                    </v-expansion-panel-text>
                  </v-expansion-panel>
                  <v-alert
                    v-if="!planStore.pastTrips.length"
                    type="info"
                    variant="tonal"
                    class="mt-2"
                  >
                    Completed plans will appear here once finalised.
                  </v-alert>
                </v-expansion-panels>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-container>
</template>

<script>
import { mapStores } from "pinia";
import { useNuxtApp } from "#app";
import TopBarMenuAdmin from "~/components/dashboard/navBarAdmin.vue";
import { usePlanStore } from "~/stores/plan.js";
import { useAuthStore } from "~/stores/auth.js";
import { useHotspotsStore } from "~/stores/hotspots.js";

export default {
  name: "AdminPlanPage",
  components: { TopBarMenuAdmin },
  data() {
    return {
      addressSearch: "",
      addressOptions: [],
      loadingAddresses: false,
      cache: {}, // simple memory cache
      lastQuery: "",
      _aborter: null,

      formError: "",
      selectedProvince: null,
      exporting: false,
      exportError: "",
      reportDownloading: false,
      reportError: "",
      hotspotHeaders: [
        { title: "Rank", key: "rank" },
        { title: "City / Town", key: "name" },
        { title: "Province", key: "province" },
        { title: "Severity", key: "band" },
        { title: "Score", key: "score" },
        { title: "Key drivers", key: "reasons" },
      ],
      impactTable: {
        meta: {
          title: "Hunger Hotspots — Operational View",
          updatedAt: "2025-10-01T02:00:00+02:00",
          currency: "ZAR",
          notes:
            "Demo data to illustrate structure. Replace *_30d values with live center metrics.",
          bandColorMap: {
            Critical: "#e53935",
            High: "#fb8c00",
            Medium: "#fdd835",
            Low: "#43a047",
          },
          statusColorMap: {
            Planned: "info",
            "In Progress": "warning",
            Completed: "success",
            Blocked: "error",
          },
        },
        headers: [
          { title: "Rank", key: "rank", width: 64 },
          { title: "City", key: "city", sortable: true },
          { title: "Province", key: "province", width: 140 },
          { title: "Severity", key: "severityBand", width: 120 },
          { title: "Score", key: "severityScore", width: 90 },
          {
            title: "Footprint (nearest · km · trips · readiness)",
            key: "footprint",
            sortable: false,
          },
          {
            title: "Action (status · ETA)",
            key: "action",
            width: 180,
            sortable: false,
          },
          {
            title: "Impact (30d)",
            key: "impact",
            width: 220,
            sortable: false,
          },
          { title: "Local NGOs", key: "ngos", sortable: false },
          { title: "What KFC can do", key: "kfcCanDo", sortable: false },
          { title: "What KFC has done", key: "kfcHasDone", sortable: false },
        ],
        rows: [
          {
            id: "ec-mthatha",
            rank: 1,
            city: "Mthatha",
            province: "Eastern Cape",
            severity: { band: "Critical", score: 78 },
            keyDrivers: [
              "White‑maize and maize‑meal prices elevated after 2024 drought",
              "30‑day fuel price rise lifting transport and food distribution costs",
              "Below‑average 30‑day rainfall and vegetation stress (SPI/NDVI)",
            ],
            footprint: {
              nearest_center: "Mthatha Centre",
              distance_km: 6.2,
              trips_30d: 3,
              avg_meals_per_trip: 950,
              volunteers_on_rota: 12,
              readiness_index: 82,
              readiness_band: "High",
            },
            action: {
              status: "Planned",
              eta: "2025-10-01T08:40:00+02:00",
              route_stops: [
                "Local cash & carry",
                "Mthatha Centre",
                "School kitchens",
              ],
              open_route_url: "https://www.google.com/maps/dir/?api=1",
            },
            impact30d: {
              meals: 2850,
              deliveries: 3,
              last_report_at: "2025-09-28T15:10:00+02:00",
              evidence: { photos: 6, receipts: 3 },
            },
            ngos: [
              {
                name: "Isibindi Youth Mthatha",
                focus: "school feeding",
                mou_status: "Suggested",
              },
              {
                name: "St. Mary’s Outreach",
                focus: "community kitchens",
                mou_status: "Suggested",
              },
            ],
            kfcCanDo: [
              "Procure bulk staples within 10 km via cash & carry; veg via fresh‑produce market",
              "Stage & dispatch from Mthatha Centre; provide volunteers and two vans",
              "Run daylight routes with AI-optimised sequencing; confirm school hall access",
              "Publish donor impact card within 24h (meals, photos, cost/child)",
            ],
            kfcHasDone: [
              "3 deliveries completed in last 30 days with photo evidence",
              "Average 950 meals per trip using Pap & Beans menu pack",
            ],
          },
          {
            id: "ec-gqeberha",
            rank: 2,
            city: "Gqeberha",
            province: "Eastern Cape",
            severity: { band: "High", score: 72 },
            keyDrivers: [
              "Persistent short‑term rainfall deficits and vegetation stress",
              "Staple price pressure with elevated white‑maize costs",
              "Fuel price adjustment passing through to logistics",
            ],
            footprint: {
              nearest_center: "Motherwell Centre",
              distance_km: 9.8,
              trips_30d: 2,
              avg_meals_per_trip: 1000,
              volunteers_on_rota: 10,
              readiness_index: 68,
              readiness_band: "Medium",
            },
            action: {
              status: "In Progress",
              eta: "2025-10-01T08:45:00+02:00",
              route_stops: [
                "Cash & carry",
                "Motherwell Centre",
                "Primary school kitchens",
              ],
              open_route_url: "https://www.google.com/maps/dir/?api=1",
            },
            impact30d: {
              meals: 2000,
              deliveries: 2,
              last_report_at: "2025-09-30T14:05:00+02:00",
              evidence: { photos: 4, receipts: 2 },
            },
            ngos: [
              {
                name: "Ubuntu Pathways",
                focus: "school support",
                mou_status: "Suggested",
              },
              {
                name: "Love Story",
                focus: "community meals",
                mou_status: "Suggested",
              },
            ],
            kfcCanDo: [
              "Bulk-buy dry staples at cash & carry; greens from municipal market",
              "Coordinate 1 van + 10 volunteers for morning runs",
              "Serve 1,000–1,500 meals/day using two large pots (gas)",
            ],
            kfcHasDone: [
              "2 deliveries completed in last month with photo receipts",
              "Local partnerships engaged for kitchen space and serving lines",
            ],
          },
          {
            id: "kzn-pietermaritzburg",
            rank: 3,
            city: "Pietermaritzburg",
            province: "KwaZulu-Natal",
            severity: { band: "High", score: 69 },
            keyDrivers: [
              "Staple price pressure amid tighter regional maize balance",
              "Sub‑seasonal dryness inland KZN (SPI/NDVI)",
              "School nutrition dependence in surrounding districts",
            ],
            footprint: {
              nearest_center: "PMB Centre",
              distance_km: 8.0,
              trips_30d: 2,
              avg_meals_per_trip: 950,
              volunteers_on_rota: 8,
              readiness_index: 64,
              readiness_band: "Medium",
            },
            action: {
              status: "Planned",
              eta: "2025-10-01T09:10:00+02:00",
              route_stops: [
                "Wholesale depot",
                "PMB Centre",
                "Cluster schools",
              ],
              open_route_url: "https://www.google.com/maps/dir/?api=1",
            },
            impact30d: {
              meals: 1900,
              deliveries: 2,
              last_report_at: "2025-09-26T12:20:00+02:00",
              evidence: { photos: 3, receipts: 2 },
            },
            ngos: [
              {
                name: "Gift of the Givers (local)",
                focus: "relief logistics",
                mou_status: "Suggested",
              },
            ],
            kfcCanDo: [
              "Activate PMB Centre as staging; buy bulk within 10–15 km",
              "Leverage school kitchens and verified serving staff",
            ],
            kfcHasDone: [
              "2 planned drops executed last month",
              "Compliance checks logged in daily reports",
            ],
          },
          {
            id: "kzn-durban",
            rank: 4,
            city: "Durban",
            province: "KwaZulu-Natal",
            severity: { band: "High", score: 66 },
            keyDrivers: [
              "Transport and port‑linked logistics costs raised by fuel price",
              "Mild rainfall deficits impacting fresh‑produce inflows",
              "Food inflation remains positive though easing",
            ],
            footprint: {
              nearest_center: "Springfield Hub",
              distance_km: 12.0,
              trips_30d: 3,
              avg_meals_per_trip: 900,
              volunteers_on_rota: 14,
              readiness_index: 76,
              readiness_band: "High",
            },
            action: {
              status: "Planned",
              eta: "2025-10-01T09:30:00+02:00",
              route_stops: [
                "Cash & carry",
                "Springfield Hub",
                "Inner‑city sites",
              ],
              open_route_url: "https://www.google.com/maps/dir/?api=1",
            },
            impact30d: {
              meals: 2700,
              deliveries: 3,
              last_report_at: "2025-09-29T11:00:00+02:00",
              evidence: { photos: 5, receipts: 3 },
            },
            ngos: [
              {
                name: "Denis Hurley Centre",
                focus: "urban meals",
                mou_status: "Suggested",
              },
            ],
            kfcCanDo: [
              "Use port‑adjacent suppliers to reduce inbound costs",
              "Serve inner‑city shelters before noon to avoid congestion",
            ],
            kfcHasDone: [
              "3 drops completed; photo gallery published in dashboard",
              "Fuel plan executed with early refuel to avoid queues",
            ],
          },
          {
            id: "lp-polokwane",
            rank: 5,
            city: "Polokwane",
            province: "Limpopo",
            severity: { band: "High", score: 64 },
            keyDrivers: [
              "Dryness and vegetation stress affecting smallholder zones",
              "Maize price transmission into Limpopo from national markets",
              "Fuel price increase lifting long‑haul transport costs",
            ],
            footprint: {
              nearest_center: "Polokwane Hub",
              distance_km: 7.0,
              trips_30d: 1,
              avg_meals_per_trip: 1000,
              volunteers_on_rota: 8,
              readiness_index: 58,
              readiness_band: "Medium",
            },
            action: {
              status: "Planned",
              eta: "2025-10-01T08:50:00+02:00",
              route_stops: [
                "Cash & carry",
                "Polokwane Hub",
                "Village schools",
              ],
              open_route_url: "https://www.google.com/maps/dir/?api=1",
            },
            impact30d: {
              meals: 1000,
              deliveries: 1,
              last_report_at: "2025-09-25T16:15:00+02:00",
              evidence: { photos: 2, receipts: 1 },
            },
            ngos: [
              {
                name: "Rise Limpopo",
                focus: "community kitchens",
                mou_status: "Suggested",
              },
            ],
            kfcCanDo: [
              "Focus on dry staples (pap/beans) with veg crates for micronutrients",
              "Leverage rural school kitchens for serving at scale",
            ],
            kfcHasDone: [
              "1 routed drop last month; compliance docs uploaded",
            ],
          },
          {
            id: "gp-johannesburg",
            rank: 6,
            city: "Johannesburg",
            province: "Gauteng",
            severity: { band: "High", score: 62 },
            keyDrivers: [
              "Large low‑income population exposed to price shocks",
              "Fuel price increase raising commuting and distribution costs",
              "Mild rainfall deficit; limited household production buffers",
            ],
            footprint: {
              nearest_center: "Braamfontein Hub",
              distance_km: 5.0,
              trips_30d: 2,
              avg_meals_per_trip: 1100,
              volunteers_on_rota: 18,
              readiness_index: 80,
              readiness_band: "High",
            },
            action: {
              status: "Planned",
              eta: "2025-10-01T08:20:00+02:00",
              route_stops: [
                "Wholesale",
                "Braamfontein Hub",
                "Inner‑city feeding points",
              ],
              open_route_url: "https://www.google.com/maps/dir/?api=1",
            },
            impact30d: {
              meals: 2200,
              deliveries: 2,
              last_report_at: "2025-09-27T10:40:00+02:00",
              evidence: { photos: 4, receipts: 2 },
            },
            ngos: [
              {
                name: "MES Johannesburg",
                focus: "urban feeding",
                mou_status: "Suggested",
              },
            ],
            kfcCanDo: [
              "High volunteer pool for rapid deployments; multiple vans available",
              "AddHope comms team can publish impact stories same day",
            ],
            kfcHasDone: [
              "2 routes run with 2,200 meals served; photos verified",
            ],
          },
          {
            id: "mp-mbombela",
            rank: 7,
            city: "Mbombela (Nelspruit)",
            province: "Mpumalanga",
            severity: { band: "High", score: 61 },
            keyDrivers: [
              "Cross‑border market demand keeps maize prices firm",
              "Lowveld dryness and vegetation stress",
              "Fuel prices affect cross‑border and internal transport",
            ],
            footprint: {
              nearest_center: "Riverside Hub",
              distance_km: 11.0,
              trips_30d: 1,
              avg_meals_per_trip: 1050,
              volunteers_on_rota: 9,
              readiness_index: 57,
              readiness_band: "Medium",
            },
            action: {
              status: "Planned",
              eta: "2025-10-01T09:00:00+02:00",
              route_stops: [
                "Cash & carry",
                "Riverside Hub",
                "Township schools",
              ],
              open_route_url: "https://www.google.com/maps/dir/?api=1",
            },
            impact30d: {
              meals: 1050,
              deliveries: 1,
              last_report_at: "2025-09-24T13:30:00+02:00",
              evidence: { photos: 2, receipts: 1 },
            },
            ngos: [
              {
                name: "Hands at Work (regional)",
                focus: "child care",
                mou_status: "Suggested",
              },
            ],
            kfcCanDo: [
              "Cluster deliveries to reduce cross‑town fuel use",
              "Engage schools for prep/serving areas",
            ],
            kfcHasDone: [
              "1 pilot run logged; menu costs validated",
            ],
          },
          {
            id: "nc-kimberley",
            rank: 8,
            city: "Kimberley",
            province: "Northern Cape",
            severity: { band: "High", score: 60 },
            keyDrivers: [
              "Chronic aridity with pronounced vegetation stress",
              "Long road supply chains amplify fuel price increases",
              "Staple prices remain elevated year‑on‑year",
            ],
            footprint: {
              nearest_center: "Kimberley Hub",
              distance_km: 9.0,
              trips_30d: 1,
              avg_meals_per_trip: 1000,
              volunteers_on_rota: 7,
              readiness_index: 55,
              readiness_band: "Medium",
            },
            action: {
              status: "Planned",
              eta: "2025-10-01T09:25:00+02:00",
              route_stops: [
                "Cash & carry",
                "Kimberley Hub",
                "Community kitchens",
              ],
              open_route_url: "https://www.google.com/maps/dir/?api=1",
            },
            impact30d: {
              meals: 1000,
              deliveries: 1,
              last_report_at: "2025-09-23T15:45:00+02:00",
              evidence: { photos: 2, receipts: 1 },
            },
            ngos: [
              {
                name: "Kimberley Soup Kitchen",
                focus: "meals",
                mou_status: "Suggested",
              },
            ],
            kfcCanDo: [
              "Schedule early morning buys to avoid midday heat",
              "Use simplified menu packs to reduce prep time",
            ],
            kfcHasDone: [
              "1 completed run; evidence uploaded",
            ],
          },
          {
            id: "nw-rustenburg",
            rank: 9,
            city: "Rustenburg",
            province: "North West",
            severity: { band: "Medium", score: 58 },
            keyDrivers: [
              "Price pressure on staples amid tighter national balance",
              "Moderate rainfall deficits limiting local production buffers",
              "Fuel costs affecting commuting and retail logistics",
            ],
            footprint: {
              nearest_center: "Rustenburg Hub",
              distance_km: 6.0,
              trips_30d: 1,
              avg_meals_per_trip: 1050,
              volunteers_on_rota: 6,
              readiness_index: 52,
              readiness_band: "Medium",
            },
            action: {
              status: "Planned",
              eta: "2025-10-01T09:15:00+02:00",
              route_stops: [
                "Cash & carry",
                "Rustenburg Hub",
                "Township schools",
              ],
              open_route_url: "https://www.google.com/maps/dir/?api=1",
            },
            impact30d: {
              meals: 1050,
              deliveries: 1,
              last_report_at: "2025-09-22T12:00:00+02:00",
              evidence: { photos: 1, receipts: 1 },
            },
            ngos: [
              {
                name: "Bojanala Care",
                focus: "community meals",
                mou_status: "Suggested",
              },
            ],
            kfcCanDo: [
              "Leverage township school kitchens; keep routes <20 km",
              "Standardize serving kit for speed and hygiene",
            ],
            kfcHasDone: [
              "Initial delivery completed; follow‑up planned",
            ],
          },
          {
            id: "fs-bloemfontein",
            rank: 10,
            city: "Bloemfontein",
            province: "Free State",
            severity: { band: "Medium", score: 57 },
            keyDrivers: [
              "Free State dryness weighing on supplies",
              "Maize pass‑through post‑2024 shortfall",
              "Elevated transport costs on long inter‑city routes",
            ],
            footprint: {
              nearest_center: "Bayswater Hub",
              distance_km: 8.0,
              trips_30d: 1,
              avg_meals_per_trip: 1000,
              volunteers_on_rota: 7,
              readiness_index: 56,
              readiness_band: "Medium",
            },
            action: {
              status: "Planned",
              eta: "2025-10-01T08:55:00+02:00",
              route_stops: [
                "Wholesale",
                "Bayswater Hub",
                "Schools cluster",
              ],
              open_route_url: "https://www.google.com/maps/dir/?api=1",
            },
            impact30d: {
              meals: 1000,
              deliveries: 1,
              last_report_at: "2025-09-21T14:10:00+02:00",
              evidence: { photos: 2, receipts: 1 },
            },
            ngos: [
              {
                name: "Towers of Hope",
                focus: "feeding & support",
                mou_status: "Suggested",
              },
            ],
            kfcCanDo: [
              "Stage from Bayswater; source bulk within 10 km radius",
              "Deliver before noon; publish impact card within 24h",
            ],
            kfcHasDone: [
              "1 completed run; receipts uploaded",
            ],
          },
        ],
      },
    };
  },
  watch: {
    // Fire immediately on each change (no debounce). Only run when >= 3 chars.
    async addressSearch(val) {
      if (!val || val.length < 3) return;
      await this.fetchAddresses(val);
    },
  },
  computed: {
    ...mapStores(usePlanStore, useAuthStore, useHotspotsStore),
    destinationBadge() {
      return `${this.planStore.destinationCount} / 10 destinations configured`;
    },
    summaryTiles() {
      const stats = this.planStore.summaryStats;
      return [
        {
          label: "Trips coordinated",
          value: this.formatNumber(stats.trips),
          caption: "Plans handled by this centre",
        },
        {
          label: "Meals allocated",
          value: this.formatNumber(stats.meals),
          caption: "Projected meals across all routes",
        },
        {
          label: "Destinations covered",
          value: this.formatNumber(stats.destinations),
          caption: "Communities on current rosters",
        },
      ];
    },
    hotspotRows() {
      return this.hotspotsStore.sorted;
    },
    impactHeaders() {
      return this.impactTable.headers;
    },
    impactRows() {
      return this.impactTable.rows.map((row) => ({
        ...row,
        severityBand: row.severity?.band ?? "",
        severityScore: row.severity?.score ?? "",
        impact: row.impact30d || {
          meals: 0,
          deliveries: 0,
          last_report_at: null,
          evidence: { photos: 0, receipts: 0 },
        },
      }));
    },
    provinceOptions() {
      const provinces = this.hotspotsStore.provinces || [];
      return [
        { title: "All provinces", value: null },
        ...provinces.map((province) => ({ title: province, value: province })),
      ];
    },
    hotspotsLastUpdated() {
      return this.hotspotsStore.lastUpdated;
    },
    latestPlanGeneratedAt() {
      const generatedAt = this.planStore.latestPlanReport?.generated_at;
      return generatedAt ? this.formatDateTime(generatedAt) : "";
    },
  },
  created() {
    const centreName =
      this.authStore.activeCenter?.name ||
      this.authStore.activeCenter?.center ||
      "Cape Town Center";
    this.planStore.initialise(centreName);
  },
  methods: {
    async downloadPlanReport() {
      if (typeof window === "undefined") {
        return;
      }

      if (!this.planStore.latestPlanReport) {
        this.reportError = "Generate a plan to download the AI report.";
        return;
      }

      this.reportDownloading = true;
      this.reportError = "";

      try {
        const { $jsPDF } = useNuxtApp();
        if (typeof $jsPDF !== "function") {
          throw new Error("PDF generator unavailable");
        }

        const autoTableModule = await import("jspdf-autotable");
        const autoTable = autoTableModule.default || autoTableModule;
        if (typeof autoTable !== "function") {
          throw new Error("Table renderer unavailable");
        }

        const doc = $jsPDF();
        const plan = this.planStore.latestPlanReport;
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const marginLeft = 16;
        const contentWidth = pageWidth - marginLeft * 2;
        let y = 20;

        const ensureSpace = (space = 26) => {
          if (y + space > pageHeight - 20) {
            doc.addPage();
            y = 20;
          }
        };

        const addSpacer = (space = 8) => {
          ensureSpace(space);
          y += space;
        };

        const addSectionTitle = (title) => {
          if (!title) return;
          ensureSpace(12);
          doc.setFont("helvetica", "bold");
          doc.setFontSize(13);
          doc.text(String(title), marginLeft, y);
          y += 8;
          doc.setFont("helvetica", "normal");
          doc.setFontSize(11);
          addSpacer(2);
        };

        const addLine = (text) => {
          if (!text) return;
          ensureSpace(10);
          doc.text(String(text), marginLeft, y);
          y += 7;
        };

        const addParagraph = (text) => {
          if (!text) return;
          const lines = doc.splitTextToSize(String(text), contentWidth);
          ensureSpace(lines.length * 7 + 6);
          doc.text(lines, marginLeft, y);
          y += lines.length * 7;
          addSpacer(4);
        };

        doc.setFont("helvetica", "bold");
        doc.setFontSize(18);
        doc.text("AI Logistics Plan Report", marginLeft, y);
        y += 12;

        doc.setFont("helvetica", "normal");
        doc.setFontSize(11);
        const generatedStamp =
          this.latestPlanGeneratedAt ||
          this.formatDateTime(new Date().toISOString());
        addLine(`Generated: ${generatedStamp}`);
        addLine(`Trip: ${plan.trip_name || "N/A"}`);
        addLine(`Center: ${plan.center || "N/A"}`);

        if (plan.summary) {
          addSectionTitle("Plan summary");
          const totalDestinations = plan.summary.total_destinations ?? "N/A";
          const totalMeals =
            typeof plan.summary.total_meals_planned === "number"
              ? plan.summary.total_meals_planned.toLocaleString()
              : plan.summary.total_meals_planned || "N/A";
          const estimatedCost =
            typeof plan.summary.estimated_food_cost_R === "number"
              ? `R${plan.summary.estimated_food_cost_R.toLocaleString()}`
              : plan.summary.estimated_food_cost_R || "N/A";
          addLine(`Destinations: ${totalDestinations}`);
          addLine(`Meals planned: ${totalMeals}`);
          addLine(`Estimated food cost: ${estimatedCost}`);
          if (plan.summary.recommendation) {
            addParagraph(`Recommendation: ${plan.summary.recommendation}`);
          }
        }

        if (plan.assumptions) {
          addSectionTitle("Assumptions");
          if (plan.assumptions.default_meals_when_missing !== undefined) {
            addLine(
              `Default meals when missing: ${plan.assumptions.default_meals_when_missing}`
            );
          }
          if (plan.assumptions.cost_basis_meal_plan) {
            addParagraph(
              `Cost basis: ${plan.assumptions.cost_basis_meal_plan}`
            );
          }
        }

        if (Array.isArray(plan.input_geocoded) && plan.input_geocoded.length) {
          addSectionTitle("Destination plan");
          ensureSpace(16);
          const destinationRows = plan.input_geocoded.map(
            (destination, index) => [
              index + 1,
              destination.address || "",
              typeof destination.meals_planned === "number"
                ? destination.meals_planned.toLocaleString()
                : destination.meals_planned ?? "",
              typeof destination.duration_days === "number"
                ? destination.duration_days.toLocaleString()
                : destination.duration_days ?? "",
            ]
          );

          autoTable(doc, {
            startY: y,
            head: [["#", "Destination", "Meals planned", "Duration (days)"]],
            body: destinationRows,
            theme: "grid",
            styles: { fontSize: 10, cellPadding: 4, valign: "middle" },
            headStyles: { fillColor: [103, 58, 183], textColor: 255 },
            alternateRowStyles: { fillColor: [245, 240, 255] },
            margin: { left: marginLeft, right: marginLeft },
            columnStyles: { 2: { halign: "right" }, 3: { halign: "right" } },
          });
          if (doc.lastAutoTable?.finalY) {
            y = doc.lastAutoTable.finalY + 10;
          }
        }

        if (Array.isArray(plan.route_plan) && plan.route_plan.length) {
          addSectionTitle("Route plan");
          ensureSpace(16);
          const routeRows = [];
          plan.route_plan.forEach((route) => {
            const stops = Array.isArray(route.optimized_path)
              ? route.optimized_path
              : [];
            stops.forEach((stop, index) => {
              routeRows.push([
                index === 0 ? route.vehicle || "" : "",
                index === 0 ? route.region || "" : "",
                stop.stop || "",
                stop.eta || "",
                typeof stop.meals_delivered === "number"
                  ? stop.meals_delivered.toLocaleString()
                  : stop.meals_delivered ?? "",
              ]);
            });
          });

          if (routeRows.length) {
            autoTable(doc, {
              startY: y,
              head: [["Vehicle", "Region", "Stop", "ETA", "Meals delivered"]],
              body: routeRows,
              theme: "grid",
              styles: { fontSize: 10, cellPadding: 4, valign: "middle" },
              headStyles: { fillColor: [67, 160, 71], textColor: 255 },
              alternateRowStyles: { fillColor: [232, 245, 233] },
              margin: { left: marginLeft, right: marginLeft },
              columnStyles: { 4: { halign: "right" } },
            });
            if (doc.lastAutoTable?.finalY) {
              y = doc.lastAutoTable.finalY + 10;
            }
          } else {
            addParagraph("No route stops configured in the AI response.");
          }

          plan.route_plan.forEach((route) => {
            const totals = [];
            if (typeof route.total_distance_km === "number") {
              totals.push(
                `Distance: ${route.total_distance_km.toLocaleString()} km`
              );
            } else if (route.total_distance_km) {
              totals.push(`Distance: ${route.total_distance_km}`);
            }
            if (typeof route.total_drive_time_h === "number") {
              totals.push(
                `Drive time: ${route.total_drive_time_h.toLocaleString(
                  undefined,
                  { maximumFractionDigits: 2 }
                )} h`
              );
            } else if (route.total_drive_time_h) {
              totals.push(`Drive time: ${route.total_drive_time_h}`);
            }
            if (totals.length) {
              addLine(totals.join(" | "));
            }
            if (route.notes) {
              doc.setFont("helvetica", "italic");
              addParagraph(
                `${route.vehicle || route.region || "Route"} notes: ${
                  route.notes
                }`
              );
              doc.setFont("helvetica", "normal");
            }

            const stops = Array.isArray(route.optimized_path)
              ? route.optimized_path.map((stop) => stop.stop).filter(Boolean)
              : [];
            if (stops.length) {
              const origin = plan.center || "Johannesburg";
              const encodedOrigin = encodeURIComponent(origin);
              const encodedDestination = encodeURIComponent(
                stops[stops.length - 1]
              );
              const waypointList = stops
                .slice(0, -1)
                .map((stop) => encodeURIComponent(stop))
                .join("|");
              const mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${encodedOrigin}&destination=${encodedDestination}${
                waypointList ? `&waypoints=${waypointList}` : ""
              }`;

              addLine(`Stops: ${stops.join(" → ")}`);
              ensureSpace(10);
              doc.setTextColor(33, 150, 243);
              doc.textWithLink(
                "Open this route in Google Maps",
                marginLeft,
                y,
                { url: mapsUrl }
              );
              y += 8;
              doc.setTextColor(0, 0, 0);
              addSpacer(4);
            }
          });
        }

        if (Array.isArray(plan.bulk_suppliers) && plan.bulk_suppliers.length) {
          addSectionTitle("Bulk supplier recommendations");
          ensureSpace(16);
          const supplierRows = [];
          plan.bulk_suppliers.forEach((group) => {
            const options = Array.isArray(group.options) ? group.options : [];
            options.forEach((option) => {
              supplierRows.push([
                group.for_region || group.near || "",
                option.name || "",
                option.type || "",
                typeof option.distance_km === "number"
                  ? option.distance_km.toLocaleString()
                  : option.distance_km ?? "",
                option.price_index || "",
                Array.isArray(option.recommended_bulk_items)
                  ? option.recommended_bulk_items.join(", ")
                  : "",
              ]);
            });
          });

          if (supplierRows.length) {
            autoTable(doc, {
              startY: y,
              head: [
                [
                  "Region",
                  "Supplier",
                  "Type",
                  "Distance (km)",
                  "Price index",
                  "Key bulk items",
                ],
              ],
              body: supplierRows,
              theme: "grid",
              styles: { fontSize: 10, cellPadding: 4, valign: "middle" },
              headStyles: { fillColor: [255, 138, 101], textColor: 255 },
              alternateRowStyles: { fillColor: [255, 244, 230] },
              margin: { left: marginLeft, right: marginLeft },
              columnStyles: {
                3: { halign: "right", cellWidth: 25 },
                5: { cellWidth: 70 },
              },
            });
            if (doc.lastAutoTable?.finalY) {
              y = doc.lastAutoTable.finalY + 10;
            }
          } else {
            addParagraph("No supplier recommendations returned.");
          }
        }

        if (
          Array.isArray(plan.meal_recommendations) &&
          plan.meal_recommendations.length
        ) {
          addSectionTitle("Meal recommendations");
          ensureSpace(16);
          const mealRows = plan.meal_recommendations.map((meal) => [
            meal.name || "",
            meal.region_fit || "",
            typeof meal.avg_cost_per_child === "number"
              ? `R${meal.avg_cost_per_child.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}`
              : meal.avg_cost_per_child ?? "",
            meal.macro_profile || "",
            meal.allergy_notice || "",
          ]);

          autoTable(doc, {
            startY: y,
            head: [
              [
                "Meal",
                "Region fit",
                "Avg cost",
                "Macro profile",
                "Allergy notice",
              ],
            ],
            body: mealRows,
            theme: "grid",
            styles: { fontSize: 10, cellPadding: 4, valign: "middle" },
            headStyles: { fillColor: [94, 53, 177], textColor: 255 },
            alternateRowStyles: { fillColor: [237, 231, 246] },
            margin: { left: marginLeft, right: marginLeft },
            columnStyles: { 2: { halign: "right", cellWidth: 28 } },
          });
          if (doc.lastAutoTable?.finalY) {
            y = doc.lastAutoTable.finalY + 10;
          }

          plan.meal_recommendations.forEach((meal) => {
            if (Array.isArray(meal.ingredients) && meal.ingredients.length) {
              addParagraph(
                `${meal.name || "Meal"} ingredients: ${meal.ingredients.join(
                  ", "
                )}`
              );
            }
          });
        }

        if (plan.methodology) {
          addSectionTitle("Methodology & notes");
          if (plan.methodology.geocode) {
            addParagraph(`Geocode: ${plan.methodology.geocode}`);
          }
          if (plan.methodology.routing) {
            addParagraph(`Routing: ${plan.methodology.routing}`);
          }
          if (plan.methodology.supplier_selection) {
            addParagraph(
              `Supplier selection: ${plan.methodology.supplier_selection}`
            );
          }
          if (plan.methodology.meals) {
            addParagraph(`Meals: ${plan.methodology.meals}`);
          }
        }

        const safeTripName =
          (plan.trip_name || "plan")
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "") || "plan";
        const timestamp = (
          plan.generated_at ? new Date(plan.generated_at) : new Date()
        )
          .toISOString()
          .split("T")[0];
        doc.save(`ai-plan-${safeTripName}-${timestamp}.pdf`);
      } catch (error) {
        console.error("Plan PDF generation failed:", error);
        this.reportError = "Unable to generate plan PDF. Please try again.";
      } finally {
        this.reportDownloading = false;
      }
    },
    async submitTrip() {
      this.formError = "";
      try {
        const centreName =
          this.authStore.activeCenter?.name ||
          this.authStore.activeCenter?.center ||
          "Cape Town Center";
        await this.planStore.submitTrip(centreName);
      } catch (error) {
        this.formError = error.message;
      }
    },
    async fetchAddresses(query) {
      // Prevent pointless repeat
      if (query === this.lastQuery) return;

      const key = query.toLowerCase();

      // Serve from cache
      if (this.cache[key]) {
        this.addressOptions = this.cache[key];
        this.lastQuery = query;
        return;
      }

      // Cancel previous request if still running
      if (this._aborter) this._aborter.abort();
      this._aborter = new AbortController();

      this.loadingAddresses = true;
      try {
        const config = useRuntimeConfig();
        const url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(
          query
        )}&filter=countrycode:za&limit=8&format=json&apiKey=${
          config.public.GEOAPIFY_KEY
        }`;
        const resp = await fetch(url, { signal: this._aborter.signal });
        if (!resp.ok) throw new Error(`Geoapify failed: ${resp.status}`);
        const json = await resp.json();

        const results = (json.results || []).map((r) => ({
          name: r.formatted || r.name,
          lat: r.lat,
          lon: r.lon,
        }));

        this.addressOptions = results;

        this.cache[key] = results;
        this.lastQuery = query;
      } catch (e) {
        if (e.name !== "AbortError") {
          console.error("Geoapify error:", e);
          this.addressOptions = [];
        }
      } finally {
        this.loadingAddresses = false;
        this._aborter = null;
      }
    },
    formatDate(date) {
      if (!date) {
        return "";
      }
      return new Date(date).toLocaleDateString();
    },
    formatNumber(value) {
      if (value === undefined || value === null) {
        return "0";
      }
      return Number(value).toLocaleString();
    },
    formatDistance(value) {
      if (value === undefined || value === null || value === "") {
        return "0";
      }
      const numeric = Number(value);
      if (Number.isNaN(numeric)) {
        return value;
      }
      return numeric.toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 1,
      });
    },
    formatRouteStops(stops) {
      if (!Array.isArray(stops) || !stops.length) {
        return "";
      }
      return stops.join(" → ");
    },
    milestoneColor(status) {
      switch (status) {
        case "Completed":
          return "success";
        case "In Progress":
          return "info";
        default:
          return "warning";
      }
    },
    impactBandColor(band) {
      const map = this.impactTable.meta.bandColorMap || {};
      return map[band] || this.severityColor(band) || "#616161";
    },
    impactStatusColor(status) {
      const map = this.impactTable.meta.statusColorMap || {};
      return map[status] || "primary";
    },
    async searchHotspots() {
      this.exportError = "";
      try {
        const province = this.selectedProvince || undefined;
        await this.hotspotsStore.fetchHotspots(province);
      } catch (error) {
        // errors handled via store state
      }
    },
    resetProvince() {
      this.selectedProvince = null;
      this.searchHotspots();
    },
    onProvinceChange(value) {
      this.selectedProvince = value;
      this.searchHotspots();
    },
    formatDateTime(value) {
      if (!value) {
        return "";
      }
      return new Date(value).toLocaleString();
    },
    severityColor(band) {
      if (band === "Critical") return "#e53935";
      if (band === "High") return "#fb8c00";
      if (band === "Medium") return "#fdd835";
      return "#43a047";
    },
    async exportHotspots() {
      if (typeof window === "undefined") {
        return;
      }

      this.exportError = "";

      if (!this.hotspotsStore.items.length) {
        await this.searchHotspots();
      }

      const items = this.hotspotsStore.sorted;

      if (!items.length) {
        this.exportError = "No hotspot data available to export.";
        return;
      }

      this.exporting = true;

      try {
        const xlsx = await import("xlsx");
        const overviewRows = items.map((item) => {
          const metrics = item.metrics || {};
          const reasons = Array.isArray(item.reasons)
            ? item.reasons.join("\n")
            : "";
          const sources = Array.isArray(item.sources)
            ? item.sources
                .map((source) => `${source.title} - ${source.url}`)
                .join("\n")
            : "";

          return {
            Rank: item.rank,
            Name: item.name,
            Province: item.province,
            "Admin level": item.adminLevel || "",
            "Severity band": item.band,
            "Severity score": item.score,
            Latitude: item.lat ?? "",
            Longitude: item.lng ?? "",
            "Shortage days (7d)": metrics.shortage_days_7d ?? "",
            "Meals per child (z-score)": metrics.meals_per_child_z ?? "",
            "Staple price (z-score)": metrics.staple_price_z ?? "",
            "Fuel price change (30d %)": metrics.fuel_price_pct30d ?? "",
            "SPI-30": metrics.spi30 ?? "",
            "NDVI anomaly": metrics.ndvi_anom ?? "",
            "Attendance change (14d %)": metrics.attendance_pct14d ?? "",
            "SAM cases per 10k": metrics.sam_cases_per_10k ?? "",
            "Key drivers": reasons,
            Sources: sources,
            "Last updated": this.formatDateTime(this.hotspotsLastUpdated),
          };
        });

        const workbook = xlsx.utils.book_new();
        const overviewSheet = xlsx.utils.json_to_sheet(overviewRows);
        xlsx.utils.book_append_sheet(
          workbook,
          overviewSheet,
          "Hotspots Overview"
        );

        const sourcesRows = [];
        items.forEach((item) => {
          if (!Array.isArray(item.sources) || !item.sources.length) {
            return;
          }
          item.sources.forEach((source, index) => {
            sourcesRows.push({
              Rank: item.rank,
              Name: item.name,
              Province: item.province,
              "Source #": index + 1,
              Title: source.title,
              URL: source.url,
            });
          });
        });

        if (sourcesRows.length) {
          const sourcesSheet = xlsx.utils.json_to_sheet(sourcesRows);
          xlsx.utils.book_append_sheet(workbook, sourcesSheet, "Source Links");
        }

        const timestamp = new Date().toISOString().split("T")[0];
        const fileName = `hotspots-report-${timestamp}.xlsx`;

        if (typeof xlsx.writeFileXLSX === "function") {
          xlsx.writeFileXLSX(workbook, fileName);
        } else {
          xlsx.writeFile(workbook, fileName);
        }
      } catch (error) {
        console.error("Hotspot export failed:", error);
        this.exportError =
          error?.message || "Unable to export hotspots report.";
      } finally {
        this.exporting = false;
      }
    },
  },
};
</script>

<style scoped>
.plan-hero {
  background: linear-gradient(135deg, #fc0909, #3c3635);
  padding-bottom: 100px;
  padding-top: 6%;
  border-bottom-left-radius: 32px;
  border-bottom-right-radius: 32px;
}

.plan-hero__content {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  padding: 32px 48px 72px;
  color: white;
}

.plan-hero__content p {
  max-width: 520px;
}

.plan-hero__metrics {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  padding: 0 48px 32px;
}

.plan-metric {
  padding: 20px 24px;
  color: white;
  backdrop-filter: blur(6px);
}

.ai-assistant__header {
  gap: 12px;
}

.ai-assistant__title {
  gap: 8px;
}

.panel-chip-group {
  gap: 8px;
}

.impact-card__header {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.impact-card__meta {
  display: flex;
  flex-direction: column;
  gap: 4px;
  text-align: left;
}

.impact-table :deep(.v-data-table__td) {
  vertical-align: top;
}

.impact-footprint__readiness {
  display: block;
  margin-top: 4px;
}

.impact-action {
  display: flex;
  flex-direction: column;
}

.impact-metrics {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.impact-chip-group {
  display: flex;
  flex-wrap: wrap;
  margin: -4px;
}

.impact-list {
  margin: 0;
  padding-left: 18px;
}

.impact-list li {
  margin-bottom: 4px;
}

.gap-small {
  gap: 8px;
}

.hotspot-card__header {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.hotspot-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  justify-content: flex-start;
  margin-top: 16px;
}

.hotspot-select {
  min-width: 220px;
}

.hotspot-controls__action,
.hotspot-controls__reset,
.hotspot-controls__export {
  height: 44px;
}

.hotspot-reasons {
  margin: 0;
  padding-left: 18px;
}

@media (max-width: 960px) {
  .plan-hero__content {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .plan-hero__metrics {
    padding: 0 24px 24px;
  }

  .hotspot-controls {
    margin-top: 12px;
  }
}

@media (min-width: 960px) {
  .hotspot-card__header {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .impact-card__header {
    flex-direction: row;
    align-items: flex-start;
    justify-content: space-between;
  }

  .impact-card__meta {
    text-align: right;
    align-items: flex-end;
  }

  .hotspot-controls {
    margin-top: 0;
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
