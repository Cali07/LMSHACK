<template>
  <v-row class="mb-4" dense>
    <v-col v-for="summary in summaries" :key="summary.label" cols="12" sm="4">
      <v-card variant="tonal" :color="summary.color" class="h-100" rounded="xl">
        <v-card-text>
          <div class="d-flex align-center justify-space-between">
            <div>
              <p class="text-caption text-medium-emphasis mb-1">{{ summary.label }}</p>
              <div class="text-h5 font-weight-bold">{{ summary.total }}</div>
              <div class="text-body-2">Verified: {{ summary.verified }} · Flagged: {{ summary.flagged }}</div>
            </div>
            <v-avatar color="white" size="42">
              <v-icon :color="summary.color">{{ summary.icon }}</v-icon>
            </v-avatar>
          </div>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup>
const props = defineProps({
  summaries: {
    type: Array,
    required: true,
  },
})
</script>
