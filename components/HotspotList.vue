<template>
  <v-card class="pa-4">
    <v-card-title class="d-flex align-center justify-space-between">
      <div>Top 10 Hotspots</div>
      <div class="text-caption" v-if="lastUpdated">Updated: {{ new Date(lastUpdated).toLocaleString() }}</div>
    </v-card-title>
    <v-divider/>
    <v-table density="comfortable">
      <thead>
      <tr>
        <th>#</th>
        <th>City/Town</th>
        <th>Province</th>
        <th>Severity</th>
        <th>Score</th>
        <th>Reasons</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="h in hotspots" :key="h.id">
        <td>{{ h.rank }}</td>
        <td>{{ h.name }}</td>
        <td>{{ h.province }}</td>
        <td>
          <v-chip :style="{ background: severityColor(h.band), color: '#fff' }" size="small">
            {{ h.band }}
          </v-chip>
        </td>
        <td>{{ h.score }}</td>
        <td class="reasons-td">
          <ul>
            <li v-for="(r, i) in h.reasons.slice(0, 2)" :key="i">{{ r }}</li>
          </ul>
        </td>
      </tr>
      </tbody>
    </v-table>
  </v-card>
</template>

<script>
import { useHotspotsStore } from '~/stores/hotspots'

export default {
  name: 'HotspotList',
  computed: {
    hotspots() {
      const store = useHotspotsStore()
      return store.sorted
    },
    lastUpdated() {
      const store = useHotspotsStore()
      return store.lastUpdated
    }
  },
  methods: {
    severityColor(band) {
      if (band === 'Critical') return '#e53935'
      if (band === 'High') return '#fb8c00'
      if (band === 'Medium') return '#fdd835'
      return '#43a047'
    }
  }
}
</script>

<style scoped>
.reasons-td ul { padding-left: 18px; margin: 0; }
</style>
