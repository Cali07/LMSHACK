<template>
  <v-row dense>
    <v-col cols="12" md="6">
      <v-card elevation="4" class="mb-4" rounded="lg">
        <v-card-title class="d-flex align-center justify-space-between">
          <div class="d-flex align-center">
            <v-icon class="mr-2" color="primary">mdi-account-multiple</v-icon>
            Assessors & Moderators
          </div>
          <v-select
            v-model="assessorFilter"
            :items="statusFilters"
            label="Status filter"
            density="compact"
            hide-details
            variant="outlined"
            style="max-width: 220px"
          />
        </v-card-title>
        <v-divider />
        <v-data-table :headers="assessorHeaders" :items="filteredAssessors" item-key="id" density="comfortable" class="elevation-0">
          <template #item.idNumber="{ item }">
            {{ item.idNumber || item.passportNumber || '—' }}
          </template>
          <template #item.status="{ item }">
            <v-chip :color="statusColor(item.status)" label size="small" variant="tonal">
              {{ formatStatus(item.status, item.flagged) }}
            </v-chip>
          </template>
          <template #item.actions="{ item }">
            <v-btn size="small" variant="text" color="error" prepend-icon="mdi-flag" @click="() => emitFlag(item, 'assessors', item.role)">
              Flag
            </v-btn>
          </template>
        </v-data-table>
      </v-card>
    </v-col>
    <v-col cols="12" md="6">
      <v-card elevation="4" class="mb-4" rounded="lg">
        <v-card-title class="d-flex align-center justify-space-between">
          <div class="d-flex align-center">
            <v-icon class="mr-2" color="primary">mdi-account-school</v-icon>
            Learners
          </div>
          <v-select
            v-model="learnerFilter"
            :items="statusFilters"
            label="Status filter"
            density="compact"
            hide-details
            variant="outlined"
            style="max-width: 220px"
          />
        </v-card-title>
        <v-divider />
        <v-data-table :headers="learnerHeaders" :items="filteredLearners" item-key="id" density="comfortable" class="elevation-0">
          <template #item.idNumber="{ item }">
            {{ item.idNumber || item.passportNumber || '—' }}
          </template>
          <template #item.status="{ item }">
            <v-chip :color="statusColor(item.status)" label size="small" variant="tonal">
              {{ formatStatus(item.status, item.flagged) }}
            </v-chip>
          </template>
          <template #item.actions="{ item }">
            <v-btn size="small" variant="text" color="error" prepend-icon="mdi-flag" @click="() => emitFlag(item, 'learners', 'Learner')">
              Flag
            </v-btn>
          </template>
        </v-data-table>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  assessorHeaders: Array,
  learnerHeaders: Array,
  filteredAssessors: Array,
  filteredLearners: Array,
  statusFilters: Array,
  statusColor: Function,
  formatStatus: Function,
  modelValueAssessorFilter: String,
  modelValueLearnerFilter: String,
})

const emit = defineEmits(['update:assessorFilter', 'update:learnerFilter', 'flag'])

const assessorFilter = computed({
  get: () => props.modelValueAssessorFilter,
  set: (value) => emit('update:assessorFilter', value),
})

const learnerFilter = computed({
  get: () => props.modelValueLearnerFilter,
  set: (value) => emit('update:learnerFilter', value),
})

const emitFlag = (item, collection, label) => {
  emit('flag', { item, collection, label })
}
</script>
