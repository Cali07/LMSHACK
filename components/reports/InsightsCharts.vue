<template>
  <v-row dense>
    <v-col cols="12" md="4">
      <v-card rounded="lg" class="pa-3" elevation="4">
        <div class="d-flex align-center justify-space-between mb-2">
          <div>
            <p class="text-caption mb-1 text-medium-emphasis">Verification outcomes</p>
            <h4 class="text-subtitle-1 font-weight-bold mb-0">Quality snapshot</h4>
          </div>
          <v-avatar color="primary" size="38"><v-icon color="white">mdi-check-decagram</v-icon></v-avatar>
        </div>
        <client-only>
          <apexchart type="donut" height="260" :options="donutOptions" :series="donutSeries" />
        </client-only>
      </v-card>
    </v-col>
    <v-col cols="12" md="4">
      <v-card rounded="lg" class="pa-3" elevation="4">
        <div class="d-flex align-center justify-space-between mb-2">
          <div>
            <p class="text-caption mb-1 text-medium-emphasis">Role distribution</p>
            <h4 class="text-subtitle-1 font-weight-bold mb-0">Assessor vs moderator vs learner</h4>
          </div>
          <v-avatar color="secondary" size="38"><v-icon color="white">mdi-account-group</v-icon></v-avatar>
        </div>
        <client-only>
          <apexchart type="bar" height="260" :options="roleOptions" :series="roleSeries" />
        </client-only>
      </v-card>
    </v-col>
    <v-col cols="12" md="4">
      <v-card rounded="lg" class="pa-3" elevation="4">
        <div class="d-flex align-center justify-space-between mb-2">
          <div>
            <p class="text-caption mb-1 text-medium-emphasis">Flagged & pending</p>
            <h4 class="text-subtitle-1 font-weight-bold mb-0">Follow-up workload</h4>
          </div>
          <v-avatar color="pink" size="38"><v-icon color="white">mdi-alert-decagram</v-icon></v-avatar>
        </div>
        <client-only>
          <apexchart type="radialBar" height="260" :options="radialOptions" :series="radialSeries" />
        </client-only>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup>
import { computed } from 'vue'
import { useNuxtApp } from '#app'
import VueApexCharts from 'vue3-apexcharts'

const props = defineProps({
  assessorCount: Number,
  moderatorCount: Number,
  learnerCount: Number,
  verified: Number,
  failed: Number,
  pending: Number,
  flagged: Number,
})

const donutSeries = computed(() => [props.verified ?? 0, props.failed ?? 0, props.pending ?? 0, props.flagged ?? 0])

const donutOptions = {
  labels: ['Verified', 'Failed', 'Pending', 'Flagged'],
  colors: ['#22c55e', '#ef4444', '#f59e0b', '#fb7185'],
  legend: { position: 'bottom' },
  dataLabels: { enabled: true },
}

const roleSeries = computed(() => [
  {
    data: [props.assessorCount ?? 0, props.moderatorCount ?? 0, props.learnerCount ?? 0],
    name: 'Records',
  },
])

const roleOptions = {
  chart: { toolbar: { show: false } },
  plotOptions: { bar: { borderRadius: 8, columnWidth: '45%' } },
  dataLabels: { enabled: false },
  xaxis: { categories: ['Assessors', 'Moderators', 'Learners'] },
  colors: ['#3b82f6'],
}

const radialSeries = computed(() => {
  const total = (props.assessorCount ?? 0) + (props.moderatorCount ?? 0) + (props.learnerCount ?? 0)
  const flagged = props.flagged ?? 0
  const pending = props.pending ?? 0
  const percFlagged = total ? Math.round((flagged / total) * 100) : 0
  const percPending = total ? Math.round((pending / total) * 100) : 0
  return [percFlagged, percPending]
})

const radialOptions = {
  labels: ['Flagged', 'Pending'],
  colors: ['#ec4899', '#f59e0b'],
  plotOptions: {
    radialBar: {
      hollow: { size: '45%' },
      track: { background: '#f3f4f6' },
      dataLabels: { value: { formatter: (value) => `${value}%` } },
    },
  },
}

const nuxtApp = useNuxtApp()
nuxtApp.vueApp.component('apexchart', VueApexCharts)
</script>
