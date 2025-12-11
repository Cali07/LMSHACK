<template>
  <v-container class="py-8" fluid>
    <v-row justify="center">
      <v-col cols="12" md="10" lg="9">
        <v-card class="mb-6" elevation="6">
          <v-card-text class="d-flex flex-column flex-md-row align-center justify-space-between">
            <div>
              <p class="text-caption text-medium-emphasis mb-1">W&RSETA Learner Management System</p>
              <h1 class="text-h5 text-md-h4 font-weight-bold">Accreditation & Learner Registry</h1>
              <p class="text-body-2 mt-2 mb-0">
                Capture assessor, moderator, and learner details with inline SA ID validation, duplicate prevention, and
                clear verification outcomes. All actions are mocked and ready to swap for real endpoints later.
              </p>
            </div>
            <v-avatar color="primary" size="64" class="mt-4 mt-md-0">
              <v-icon color="white" size="32">mdi-clipboard-check</v-icon>
            </v-avatar>
          </v-card-text>
        </v-card>

        <v-row class="mb-4" dense>
          <v-col v-for="summary in summaries" :key="summary.label" cols="12" sm="4">
            <v-card variant="tonal" :color="summary.color" class="h-100">
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

        <v-tabs v-model="activeTab" color="primary" bg-color="surface">
          <v-tab value="assessors">Assessors & Moderators</v-tab>
          <v-tab value="learners">Learners / Students</v-tab>
          <v-tab value="reports">Reports</v-tab>
        </v-tabs>

        <v-window v-model="activeTab" class="mt-4">
          <v-window-item value="assessors">
            <v-card elevation="4">
              <v-card-title class="d-flex align-center">
                <v-icon class="mr-2" color="primary">mdi-account-tie</v-icon>
                Register Assessors & Moderators
              </v-card-title>
              <v-divider />
              <v-card-text>
                <v-alert v-if="assessorMessage" :type="assessorSuccess ? 'success' : 'error'" class="mb-4" density="comfortable">
                  {{ assessorMessage }}
                </v-alert>
                <v-form @submit.prevent="handleAssessorSubmit">
                  <v-row dense>
                    <v-col cols="12" md="4">
                      <v-select
                        v-model="assessorForm.role"
                        :items="assessorRoles"
                        label="Role"
                        variant="outlined"
                        density="comfortable"
                        prepend-inner-icon="mdi-account-badge"
                        required
                      />
                    </v-col>
                    <v-col cols="12" md="4">
                      <v-text-field
                        v-model="assessorForm.name"
                        label="Full name"
                        variant="outlined"
                        density="comfortable"
                        prepend-inner-icon="mdi-account"
                        required
                      />
                    </v-col>
                    <v-col cols="12" md="4">
                      <v-text-field
                        v-model="assessorForm.email"
                        label="Email"
                        type="email"
                        variant="outlined"
                        density="comfortable"
                        prepend-inner-icon="mdi-email"
                        required
                      />
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="assessorForm.idNumber"
                        label="South African ID"
                        variant="outlined"
                        density="comfortable"
                        prepend-inner-icon="mdi-card-account-details"
                        placeholder="13-digit SA ID"
                        counter="13"
                      />
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-textarea
                        v-model="assessorForm.motivation"
                        label="Motivation / reason"
                        variant="outlined"
                        density="comfortable"
                        auto-grow
                        rows="2"
                        prepend-inner-icon="mdi-text-long"
                        required
                      />
                    </v-col>
                    <v-col cols="12" md="6" class="d-flex align-center">
                      <v-checkbox
                        v-model="assessorUsePassport"
                        label="Use passport / alternative ID"
                        density="compact"
                        hide-details
                        color="primary"
                        prepend-icon="mdi-passport-biometric"
                      />
                    </v-col>
                  </v-row>

                  <v-expand-transition>
                    <div v-if="assessorNeedsExtraDetails" class="mt-2">
                      <v-alert color="warning" variant="tonal" class="mb-3" icon="mdi-alert">
                        ID validation requires additional verification. Please capture passport and document details.
                      </v-alert>
                      <v-row dense>
                        <v-col cols="12" md="4">
                          <v-text-field
                            v-model="assessorForm.passportNumber"
                            label="Passport / Alternative ID"
                            variant="outlined"
                            density="comfortable"
                            prepend-inner-icon="mdi-passport"
                            required
                          />
                        </v-col>
                        <v-col cols="12" md="4">
                          <v-text-field
                            v-model="assessorForm.country"
                            label="Country of issue"
                            variant="outlined"
                            density="comfortable"
                            prepend-inner-icon="mdi-earth"
                            required
                          />
                        </v-col>
                        <v-col cols="12" md="4">
                          <v-text-field
                            v-model="assessorForm.documentType"
                            label="Document type"
                            variant="outlined"
                            density="comfortable"
                            prepend-inner-icon="mdi-file-document"
                            required
                          />
                        </v-col>
                      </v-row>
                    </div>
                  </v-expand-transition>

                  <v-row dense>
                    <v-col cols="12" md="6">
                      <v-alert
                        v-if="assessorIdInsight"
                        :color="assessorIdInsight.valid ? 'success' : assessorIdInsight.isSouthAfrican ? 'error' : 'warning'"
                        variant="tonal"
                        density="comfortable"
                        class="mt-3"
                        icon="mdi-information"
                      >
                        <div class="font-weight-medium">SA ID insight</div>
                        <div class="text-body-2">
                          Age: {{ assessorIdInsight.age ?? 'Unknown' }} · Gender: {{ assessorIdInsight.gender }}
                        </div>
                        <div v-if="assessorIdInsight.reason" class="text-body-2 mt-1">
                          {{ assessorIdInsight.reason }}
                        </div>
                      </v-alert>
                    </v-col>
                    <v-col cols="12" md="6" class="d-flex align-end justify-end mt-2">
                      <v-btn :loading="submittingAssessor" type="submit" color="primary" prepend-icon="mdi-account-check">
                        Submit registration
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-form>
              </v-card-text>
            </v-card>
          </v-window-item>

          <v-window-item value="learners">
            <v-card elevation="4">
              <v-card-title class="d-flex align-center">
                <v-icon class="mr-2" color="primary">mdi-school</v-icon>
                Register Learners / Students
              </v-card-title>
              <v-divider />
              <v-card-text>
                <v-alert v-if="learnerMessage" :type="learnerSuccess ? 'success' : 'error'" class="mb-4" density="comfortable">
                  {{ learnerMessage }}
                </v-alert>
                <v-form @submit.prevent="handleLearnerSubmit">
                  <v-row dense>
                    <v-col cols="12" md="5">
                      <v-text-field
                        v-model="learnerForm.name"
                        label="Full name"
                        variant="outlined"
                        density="comfortable"
                        prepend-inner-icon="mdi-account"
                        required
                      />
                    </v-col>
                    <v-col cols="12" md="4">
                      <v-text-field
                        v-model="learnerForm.idNumber"
                        label="South African ID"
                        variant="outlined"
                        density="comfortable"
                        prepend-inner-icon="mdi-card-account-details"
                        placeholder="13-digit SA ID"
                        counter="13"
                      />
                    </v-col>
                    <v-col cols="12" md="3">
                      <v-file-input
                        v-model="learnerForm.profile"
                        label="Profile photo (optional stub)"
                        variant="outlined"
                        density="comfortable"
                        prepend-inner-icon="mdi-camera"
                        show-size
                        hint="Upload is mocked and not persisted"
                        persistent-hint
                      />
                    </v-col>
                    <v-col cols="12" md="6" class="d-flex align-center">
                      <v-checkbox
                        v-model="learnerUsePassport"
                        label="Use passport / alternative ID"
                        density="compact"
                        hide-details
                        color="primary"
                        prepend-icon="mdi-passport-biometric"
                      />
                    </v-col>
                  </v-row>

                  <v-expand-transition>
                    <div v-if="learnerNeedsExtraDetails" class="mt-2">
                      <v-alert color="warning" variant="tonal" class="mb-3" icon="mdi-alert">
                        Non-SA ID detected. Capture supporting document details to continue.
                      </v-alert>
                      <v-row dense>
                        <v-col cols="12" md="4">
                          <v-text-field
                            v-model="learnerForm.passportNumber"
                            label="Passport / Alternative ID"
                            variant="outlined"
                            density="comfortable"
                            prepend-inner-icon="mdi-passport"
                            required
                          />
                        </v-col>
                        <v-col cols="12" md="4">
                          <v-text-field
                            v-model="learnerForm.country"
                            label="Country of issue"
                            variant="outlined"
                            density="comfortable"
                            prepend-inner-icon="mdi-earth"
                            required
                          />
                        </v-col>
                        <v-col cols="12" md="4">
                          <v-text-field
                            v-model="learnerForm.documentType"
                            label="Document type"
                            variant="outlined"
                            density="comfortable"
                            prepend-inner-icon="mdi-file-document"
                            required
                          />
                        </v-col>
                      </v-row>
                    </div>
                  </v-expand-transition>

                  <v-row dense>
                    <v-col cols="12" md="6">
                      <v-alert
                        v-if="learnerIdInsight"
                        :color="learnerIdInsight.valid ? 'success' : learnerIdInsight.isSouthAfrican ? 'error' : 'warning'"
                        variant="tonal"
                        density="comfortable"
                        class="mt-3"
                        icon="mdi-information"
                      >
                        <div class="font-weight-medium">ID insight</div>
                        <div class="text-body-2">
                          Age: {{ learnerIdInsight.age ?? 'Unknown' }} · Gender: {{ learnerIdInsight.gender }}
                        </div>
                        <div v-if="learnerIdInsight.reason" class="text-body-2 mt-1">
                          {{ learnerIdInsight.reason }}
                        </div>
                      </v-alert>
                    </v-col>
                    <v-col cols="12" md="6" class="d-flex align-end justify-end mt-2">
                      <v-btn :loading="submittingLearner" type="submit" color="primary" prepend-icon="mdi-school">
                        Add learner
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-form>
              </v-card-text>
            </v-card>
          </v-window-item>

          <v-window-item value="reports">
            <v-row dense>
              <v-col cols="12" md="6">
                <v-card elevation="4" class="mb-4">
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
                  <v-data-table
                    :headers="assessorHeaders"
                    :items="filteredAssessors"
                    item-key="id"
                    density="comfortable"
                    class="elevation-0"
                  >
                    <template #item.idNumber="{ item }">
                      {{ item.idNumber || item.passportNumber || '—' }}
                    </template>
                    <template #item.status="{ item }">
                      <v-chip :color="statusColor(item.status)" label size="small" variant="tonal">
                        {{ formatStatus(item.status, item.flagged) }}
                      </v-chip>
                    </template>
                    <template #item.actions="{ item }">
                      <v-btn
                        size="small"
                        variant="text"
                        color="error"
                        prepend-icon="mdi-flag"
                        @click="openFlagDialog(item, 'assessors', item.role)"
                      >
                        Flag
                      </v-btn>
                    </template>
                  </v-data-table>
                </v-card>
              </v-col>
              <v-col cols="12" md="6">
                <v-card elevation="4" class="mb-4">
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
                  <v-data-table
                    :headers="learnerHeaders"
                    :items="filteredLearners"
                    item-key="id"
                    density="comfortable"
                    class="elevation-0"
                  >
                    <template #item.idNumber="{ item }">
                      {{ item.idNumber || item.passportNumber || '—' }}
                    </template>
                    <template #item.status="{ item }">
                      <v-chip :color="statusColor(item.status)" label size="small" variant="tonal">
                        {{ formatStatus(item.status, item.flagged) }}
                      </v-chip>
                    </template>
                    <template #item.actions="{ item }">
                      <v-btn
                        size="small"
                        variant="text"
                        color="error"
                        prepend-icon="mdi-flag"
                        @click="openFlagDialog(item, 'learners', 'Learner')"
                      >
                        Flag
                      </v-btn>
                    </template>
                  </v-data-table>
                </v-card>
              </v-col>
            </v-row>
          </v-window-item>
        </v-window>
      </v-col>
    </v-row>

    <v-dialog v-model="flagDialog.visible" max-width="480px">
      <v-card>
        <v-card-title class="d-flex align-center">
          <v-icon class="mr-2" color="error">mdi-flag</v-icon>
          Flag {{ flagDialog.roleLabel }}
        </v-card-title>
        <v-divider />
        <v-card-text>
          <p class="text-body-2 mb-3">Provide a reason for flagging. This will be stored with the record.</p>
          <v-textarea
            v-model="flagDialog.reason"
            label="Flag reason"
            variant="outlined"
            density="comfortable"
            rows="3"
            auto-grow
            required
          />
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn variant="text" @click="closeFlagDialog">Cancel</v-btn>
          <v-btn color="error" :loading="flagDialog.loading" @click="submitFlag">Save flag</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { mapStores } from 'pinia'
import { useRegistryStore } from '~/stores/registry'

export default {
  name: 'RegistryDashboard',
  data() {
    return {
      activeTab: 'assessors',
      assessorForm: {
        role: 'Assessor',
        name: '',
        email: '',
        idNumber: '',
        motivation: '',
        passportNumber: '',
        country: '',
        documentType: '',
      },
      learnerForm: {
        name: '',
        idNumber: '',
        passportNumber: '',
        country: '',
        documentType: '',
        profile: null,
      },
      assessorUsePassport: false,
      learnerUsePassport: false,
      assessorMessage: '',
      assessorSuccess: false,
      learnerMessage: '',
      learnerSuccess: false,
      assessorIdInsight: null,
      learnerIdInsight: null,
      submittingAssessor: false,
      submittingLearner: false,
      assessorFilter: 'all',
      learnerFilter: 'all',
      flagDialog: {
        visible: false,
        recordId: null,
        collection: null,
        roleLabel: '',
        reason: '',
        loading: false,
      },
      assessorRoles: ['Assessor', 'Moderator'],
      statusFilters: [
        { title: 'All', value: 'all' },
        { title: 'Verified', value: 'verified' },
        { title: 'Failed', value: 'failed' },
        { title: 'Flagged', value: 'flagged' },
        { title: 'Pending verification', value: 'pending' },
      ],
      assessorHeaders: [
        { title: 'Name', key: 'name' },
        { title: 'Role', key: 'role' },
        { title: 'ID / Passport', key: 'idNumber', value: (item) => item.idNumber || item.passportNumber },
        { title: 'Status', key: 'status' },
        { title: 'Reason / Notes', key: 'failedReason' },
        { title: 'Actions', key: 'actions', sortable: false },
      ],
      learnerHeaders: [
        { title: 'Name', key: 'name' },
        { title: 'ID / Passport', key: 'idNumber', value: (item) => item.idNumber || item.passportNumber },
        { title: 'Status', key: 'status' },
        { title: 'Reason / Notes', key: 'failedReason' },
        { title: 'Actions', key: 'actions', sortable: false },
      ],
    }
  },
  computed: {
    ...mapStores(useRegistryStore),
    assessorNeedsExtraDetails() {
      return (
        this.assessorUsePassport ||
        (this.assessorIdInsight && (!this.assessorIdInsight.valid || !this.assessorIdInsight.isSouthAfrican))
      )
    },
    learnerNeedsExtraDetails() {
      return (
        this.learnerUsePassport ||
        (this.learnerIdInsight && (!this.learnerIdInsight.valid || !this.learnerIdInsight.isSouthAfrican))
      )
    },
    filteredAssessors() {
      return this.filterByStatus(this.registryStore.assessorModeratorList, this.assessorFilter)
    },
    filteredLearners() {
      return this.filterByStatus(this.registryStore.learners, this.learnerFilter)
    },
    summaries() {
      const assessorStats = this.statusSummary(this.registryStore.assessorModeratorList)
      const learnerStats = this.statusSummary(this.registryStore.learners)
      const moderatorStats = this.statusSummary(this.registryStore.moderators)

      return [
        { label: 'Assessors & Moderators', total: assessorStats.total, verified: assessorStats.verified, flagged: assessorStats.flagged, color: 'primary', icon: 'mdi-account-badge' },
        { label: 'Learners', total: learnerStats.total, verified: learnerStats.verified, flagged: learnerStats.flagged, color: 'secondary', icon: 'mdi-school' },
        { label: 'Moderators only', total: moderatorStats.total, verified: moderatorStats.verified, flagged: moderatorStats.flagged, color: 'teal', icon: 'mdi-account-tie' },
      ]
    },
  },
  watch: {
    'assessorForm.idNumber'(value) {
      this.assessorIdInsight = value ? this.registryStore.validateSouthAfricanId(value) : null
    },
    'learnerForm.idNumber'(value) {
      this.learnerIdInsight = value ? this.registryStore.validateSouthAfricanId(value) : null
    },
  },
  methods: {
    statusSummary(items) {
      const total = items.length
      const verified = items.filter((i) => i.status === 'verified').length
      const flagged = items.filter((i) => i.flagged || i.status === 'flagged').length
      return { total, verified, flagged }
    },
    filterByStatus(list, status) {
      if (status === 'all') return list
      if (status === 'flagged') return list.filter((item) => item.flagged || item.status === 'flagged')
      return list.filter((item) => item.status === status)
    },
    statusColor(status) {
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
    },
    formatStatus(status, flagged) {
      if (flagged || status === 'flagged') return 'Flagged'
      if (status === 'pending') return 'Pending verification'
      return status.charAt(0).toUpperCase() + status.slice(1)
    },
    resetAssessorForm() {
      this.assessorForm = {
        role: 'Assessor',
        name: '',
        email: '',
        idNumber: '',
        motivation: '',
        passportNumber: '',
        country: '',
        documentType: '',
      }
      this.assessorIdInsight = null
      this.assessorUsePassport = false
    },
    resetLearnerForm() {
      this.learnerForm = {
        name: '',
        idNumber: '',
        passportNumber: '',
        country: '',
        documentType: '',
        profile: null,
      }
      this.learnerIdInsight = null
      this.learnerUsePassport = false
    },
    async handleAssessorSubmit() {
      this.assessorMessage = ''
      this.assessorSuccess = false
      this.submittingAssessor = true

      const result = await this.registryStore.registerAssessorOrModerator({
        ...this.assessorForm,
        role: this.assessorForm.role,
      })

      this.submittingAssessor = false
      this.assessorSuccess = result.success
      this.assessorMessage = result.success
        ? 'Assessor/moderator recorded with mock API. Verification outcome has been stored.'
        : result.message

      if (result.success) {
        this.resetAssessorForm()
      }
    },
    async handleLearnerSubmit() {
      this.learnerMessage = ''
      this.learnerSuccess = false
      this.submittingLearner = true

      const result = await this.registryStore.registerLearner({
        ...this.learnerForm,
      })

      this.submittingLearner = false
      this.learnerSuccess = result.success
      this.learnerMessage = result.success
        ? 'Learner captured with mock API. Verification outcome has been stored.'
        : result.message

      if (result.success) {
        this.resetLearnerForm()
      }
    },
    openFlagDialog(item, collection, roleLabel) {
      this.flagDialog = {
        visible: true,
        recordId: item.id,
        collection,
        roleLabel,
        reason: item.failedReason || '',
        loading: false,
      }
    },
    closeFlagDialog() {
      this.flagDialog.visible = false
      this.flagDialog.recordId = null
      this.flagDialog.collection = null
      this.flagDialog.reason = ''
    },
    async submitFlag() {
      if (!this.flagDialog.collection || !this.flagDialog.recordId) return
      this.flagDialog.loading = true
      const response = await this.registryStore.flagRecord(
        this.flagDialog.collection,
        this.flagDialog.recordId,
        this.flagDialog.reason || 'Flagged for manual review',
      )
      this.flagDialog.loading = false

      if (response.success) {
        this.closeFlagDialog()
      }
    },
  },
}
</script>

<style scoped>
.v-application {
  background: #f5f7fb;
}
</style>
