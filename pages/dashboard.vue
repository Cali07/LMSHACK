<template>
  <div class="page-shell">
    <v-container class="py-8" fluid>
      <v-row justify="center">
        <v-col cols="12" md="10" lg="10">
          <div class="d-flex align-center justify-space-between mb-3">
            <div class="d-flex align-center">
              <v-avatar color="primary" size="40" class="mr-2">
                <v-icon color="white">mdi-shield-lock-outline</v-icon>
              </v-avatar>
              <div>
                <p class="text-caption text-medium-emphasis mb-0">Signed in as</p>
                <strong>{{ authStore.user?.username }}</strong>
              </div>
            </div>
            <v-btn variant="text" color="primary" prepend-icon="mdi-logout" @click="logout">Logout</v-btn>
          </div>

          <hero-header />
          <summary-cards :summaries="summaries" />

          <v-tabs v-model="activeTab" color="primary" bg-color="surface" class="rounded-lg">
            <v-tab value="assessors">Assessors & Moderators</v-tab>
            <v-tab value="learners">Learners / Students</v-tab>
            <v-tab value="reports">Reports</v-tab>
          </v-tabs>

          <v-window v-model="activeTab" class="mt-4">
            <v-window-item value="assessors">
              <assessor-form />
              <bulk-upload-card target="assessors" color="primary" />
            </v-window-item>

            <v-window-item value="learners">
              <learner-form />
              <bulk-upload-card target="learners" color="secondary" />
            </v-window-item>

            <v-window-item value="reports">
              <v-card class="mb-4" rounded="lg" elevation="4">
                <v-card-title class="d-flex align-center justify-space-between">
                  <div class="d-flex align-center">
                    <v-icon class="mr-2" color="primary">mdi-file-chart</v-icon>
                    Reporting toolkit
                  </div>
                  <div class="d-flex align-center ga-2">
                    <v-btn color="primary" variant="tonal" prepend-icon="mdi-microsoft-excel" @click="exportExcel">
                      Export Excel
                    </v-btn>
                  </div>
                </v-card-title>
                <v-card-text>
                  <insights-charts
                    :assessor-count="registryStore.assessors.length"
                    :moderator-count="registryStore.moderators.length"
                    :learner-count="registryStore.learners.length"
                    :verified="statusBuckets.verified"
                    :failed="statusBuckets.failed"
                    :pending="statusBuckets.pending"
                    :flagged="statusBuckets.flagged"
                  />
                </v-card-text>
              </v-card>

              <reports-tables
                :assessor-headers="assessorHeaders"
                :learner-headers="learnerHeaders"
                :filtered-assessors="filteredAssessors"
                :filtered-learners="filteredLearners"
                :status-filters="statusFilters"
                :status-color="statusColor"
                :format-status="formatStatus"
                :model-value-assessor-filter="assessorFilter"
                :model-value-learner-filter="learnerFilter"
                @update:assessorFilter="assessorFilter = $event"
                @update:learnerFilter="learnerFilter = $event"
                @flag="openFlagDialog"
              />
            </v-window-item>
          </v-window>
        </v-col>
      </v-row>

      <flag-dialog
        v-model="flagDialog.visible"
        :role-label="flagDialog.roleLabel"
        :loading="flagDialog.loading"
        :initial-reason="flagDialog.reason"
        @close="closeFlagDialog"
        @save="submitFlag"
      />
    </v-container>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import HeroHeader from '~/components/dashboard/HeroHeader.vue'
import SummaryCards from '~/components/dashboard/SummaryCards.vue'
import AssessorForm from '~/components/registry/AssessorForm.vue'
import LearnerForm from '~/components/registry/LearnerForm.vue'
import BulkUploadCard from '~/components/registry/BulkUploadCard.vue'
import ReportsTables from '~/components/reports/ReportsTables.vue'
import InsightsCharts from '~/components/reports/InsightsCharts.vue'
import FlagDialog from '~/components/shared/FlagDialog.vue'
import { useRegistryStore } from '~/stores/registry'
import { useAuthStore } from '~/stores/auth'
import { exportRegistryWorkbook } from '~/utils/excel'

definePageMeta({
  middleware: 'auth',
})

const router = useRouter()
const registryStore = useRegistryStore()
const authStore = useAuthStore()

const activeTab = ref('assessors')
const assessorFilter = ref('all')
const learnerFilter = ref('all')

const statusFilters = [
  { title: 'All', value: 'all' },
  { title: 'Verified', value: 'verified' },
  { title: 'Failed', value: 'failed' },
  { title: 'Flagged', value: 'flagged' },
  { title: 'Pending verification', value: 'pending' },
]

const assessorHeaders = [
  { title: 'Name', key: 'name' },
  { title: 'Role', key: 'role' },
  { title: 'ID / Passport', key: 'idNumber', value: (item) => item.idNumber || item.passportNumber },
  { title: 'Status', key: 'status' },
  { title: 'Reason / Notes', key: 'failedReason' },
  { title: 'Actions', key: 'actions', sortable: false },
]

const learnerHeaders = [
  { title: 'Name', key: 'name' },
  { title: 'ID / Passport', key: 'idNumber', value: (item) => item.idNumber || item.passportNumber },
  { title: 'Status', key: 'status' },
  { title: 'Reason / Notes', key: 'failedReason' },
  { title: 'Actions', key: 'actions', sortable: false },
]

const flagDialog = ref({
  visible: false,
  recordId: null,
  collection: null,
  roleLabel: '',
  reason: '',
  loading: false,
})

const statusSummary = (items) => {
  const total = items.length
  const verified = items.filter((i) => i.status === 'verified').length
  const flagged = items.filter((i) => i.flagged || i.status === 'flagged').length
  return { total, verified, flagged }
}

const filterByStatus = (list, status) => {
  if (status === 'all') return list
  if (status === 'flagged') return list.filter((item) => item.flagged || item.status === 'flagged')
  return list.filter((item) => item.status === status)
}

const filteredAssessors = computed(() => filterByStatus(registryStore.assessorModeratorList, assessorFilter.value))
const filteredLearners = computed(() => filterByStatus(registryStore.learners, learnerFilter.value))

const summaries = computed(() => {
  const assessorStats = statusSummary(registryStore.assessorModeratorList)
  const learnerStats = statusSummary(registryStore.learners)
  const moderatorStats = statusSummary(registryStore.moderators)

  return [
    { label: 'Assessors & Moderators', total: assessorStats.total, verified: assessorStats.verified, flagged: assessorStats.flagged, color: 'primary', icon: 'mdi-account-badge' },
    { label: 'Learners', total: learnerStats.total, verified: learnerStats.verified, flagged: learnerStats.flagged, color: 'secondary', icon: 'mdi-school' },
    { label: 'Moderators only', total: moderatorStats.total, verified: moderatorStats.verified, flagged: moderatorStats.flagged, color: 'teal', icon: 'mdi-account-tie' },
  ]
})

const statusBuckets = computed(() => {
  const combined = [...registryStore.assessorModeratorList, ...registryStore.learners]
  return {
    verified: combined.filter((i) => i.status === 'verified').length,
    failed: combined.filter((i) => i.status === 'failed').length,
    pending: combined.filter((i) => i.status === 'pending').length,
    flagged: combined.filter((i) => i.flagged || i.status === 'flagged').length,
  }
})

const statusColor = (status) => {
  switch (status) {
    case 'verified':
      return 'success'
    case 'failed':
      return 'error'
    case 'flagged':
      return 'orange'
    default:
      return 'warning'
  }
}

const formatStatus = (status, flagged) => {
  if (flagged || status === 'flagged') return 'Flagged'
  if (status === 'pending') return 'Pending verification'
  return status.charAt(0).toUpperCase() + status.slice(1)
}

const openFlagDialog = ({ item, collection, label }) => {
  flagDialog.value = {
    visible: true,
    recordId: item.id,
    collection,
    roleLabel: label,
    reason: item.failedReason || '',
    loading: false,
  }
}

const closeFlagDialog = () => {
  flagDialog.value.visible = false
  flagDialog.value.recordId = null
  flagDialog.value.collection = null
  flagDialog.value.reason = ''
}

const submitFlag = async (reason) => {
  if (!flagDialog.value.collection || !flagDialog.value.recordId) return
  flagDialog.value.loading = true
  const response = await registryStore.flagRecord(flagDialog.value.collection, flagDialog.value.recordId, reason)
  flagDialog.value.loading = false

  if (response.success) {
    closeFlagDialog()
  }
}

const exportExcel = () => {
  exportRegistryWorkbook({
    assessors: registryStore.assessors,
    moderators: registryStore.moderators,
    learners: registryStore.learners,
  })
}

const logout = () => {
  authStore.logout()
  router.replace('/')
}
</script>

<style scoped>
.page-shell {
  min-height: 100vh;
  background: radial-gradient(circle at 10% 20%, rgba(59, 130, 246, 0.1), transparent 24%),
    radial-gradient(circle at 80% 10%, rgba(16, 185, 129, 0.1), transparent 24%),
    linear-gradient(180deg, #f5f7fb 0%, #e9eef7 100%);
}
</style>
