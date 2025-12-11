<template>
  <v-card variant="tonal" :color="color" class="mb-6" rounded="lg">
    <v-card-title class="d-flex align-center justify-space-between">
      <div class="d-flex align-center">
        <v-avatar :color="color" size="44" class="mr-3" variant="flat">
          <v-icon color="white">mdi-database-import</v-icon>
        </v-avatar>
        <div>
          <div class="text-overline">Bulk import via Excel</div>
          <h4 class="text-subtitle-1 font-weight-bold mb-0">{{ title }}</h4>
        </div>
      </div>
      <div class="d-flex ga-2 align-center">
        <v-btn
          v-if="showTemplateDownload"
          variant="text"
          color="primary"
          prepend-icon="mdi-file-download-outline"
          @click="downloadTemplate"
        >
          {{ templateLabel }}
        </v-btn>
        <v-chip label prepend-icon="mdi-microsoft-excel" variant="text">XLSX supported</v-chip>
      </div>
    </v-card-title>
    <v-card-text>
      <v-row dense>
        <v-col cols="12" md="6">
          <v-file-input
            v-model="file"
            accept=".xlsx,.xls,.csv"
            label="Upload Excel template"
            variant="outlined"
            density="comfortable"
            prepend-inner-icon="mdi-upload"
            show-size
          />
        </v-col>
        <v-col cols="12" md="6" class="d-flex align-end justify-end ga-2">
          <v-btn
            v-if="showTemplateDownload"
            variant="tonal"
            color="primary"
            prepend-icon="mdi-file-eye-outline"
            @click="downloadTemplate"
          >
            Download template
          </v-btn>
          <v-btn :loading="loading" color="success" prepend-icon="mdi-database-arrow-up" @click="handleUpload">
            Bulk add
          </v-btn>
        </v-col>
      </v-row>

      <v-expand-transition>
        <v-alert
          v-if="feedback"
          :type="feedback.success ? 'success' : 'info'"
          variant="tonal"
          density="comfortable"
          class="mt-3"
        >
          <div class="d-flex align-start flex-column w-100 ga-2">
            <div class="text-body-2">
              {{ feedback.summary }}
              <div v-if="feedback.details" class="mt-2 text-medium-emphasis">{{ feedback.details }}</div>
            </div>

            <v-table v-if="results.length" density="comfortable" class="rounded-lg">
              <thead>
                <tr>
                  <th class="text-left">Name</th>
                  <th class="text-left">Outcome</th>
                  <th class="text-left">Notes</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, idx) in results" :key="idx">
                  <td>{{ row.name || 'Unnamed row' }}</td>
                  <td>
                    <v-chip :color="row.success ? 'success' : 'error'" label size="small" variant="flat">
                      {{ row.success ? 'Added' : 'Skipped' }}
                    </v-chip>
                  </td>
                  <td class="text-body-2 text-medium-emphasis">{{ row.message || 'Processed' }}</td>
                </tr>
              </tbody>
            </v-table>
          </div>
        </v-alert>
      </v-expand-transition>

      <p class="text-body-2 text-medium-emphasis mt-4 mb-0">
        Required: <strong>{{ requiredColumns.join(', ') }}</strong>. Optional: <strong>{{ optionalColumns.join(', ') }}</strong>
        plus Email and Motivation for assessors. Country and document type help with passports but are not mandatory. The
        template includes South African IDs and international passport examples, and the system handles validation and
        flagging automatically.
      </p>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { computed, ref } from 'vue'
import { downloadBulkTemplate, parseExcelFile } from '~/utils/excel'
import { useRegistryStore } from '~/stores/registry'

const props = defineProps({
  target: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    default: 'primary',
  },
})

const registryStore = useRegistryStore()

const file = ref(null)
const feedback = ref(null)
const results = ref([])
const loading = ref(false)

const title = computed(() => (props.target === 'assessors' ? 'Assessors & Moderators' : 'Learners / Students'))
const templateLabel = computed(() =>
  props.target === 'assessors' ? 'Assessor/Moderator template' : 'Learner template',
)
const requiredColumns = computed(() => ['Name', 'IDNumber or PassportNumber'])
const optionalColumns = computed(() =>
  props.target === 'assessors'
    ? ['Role (Assessor/Moderator)', 'Country', 'DocumentType']
    : ['Country', 'DocumentType'],
)

const showTemplateDownload = computed(() => true)

const downloadTemplate = () => {
  if (showTemplateDownload.value) {
    downloadBulkTemplate(props.target)
  }
}

const handleUpload = async () => {
  feedback.value = null
  results.value = []
  if (!file.value) return

  loading.value = true
  try {
    const rows = await parseExcelFile(file.value)

    const uploadResults =
      props.target === 'assessors'
        ? await registryStore.bulkRegisterAssessors(rows)
        : await registryStore.bulkRegisterLearners(rows)

    results.value = uploadResults

    const successes = uploadResults.filter((r) => r.success).length
    const failures = uploadResults.length - successes
    feedback.value = {
      success: successes > 0,
      summary: `Imported ${successes} record(s) · ${failures} skipped`,
      details: failures
        ? 'Duplicates or validation issues were skipped — flagging and verification happen automatically.'
        : 'Verification will flag any risky IDs after upload.',
    }
  } catch (error) {
    feedback.value = { success: false, summary: 'Could not read the Excel file', details: String(error) }
  }

  loading.value = false
}
</script>
