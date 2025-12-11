<template>
  <v-card elevation="6" class="mb-6" rounded="lg">
    <v-card-title class="d-flex align-center justify-space-between">
      <div class="d-flex align-center">
        <v-avatar color="primary" size="46" class="mr-3">
          <v-icon color="white">mdi-account-badge</v-icon>
        </v-avatar>
        <div>
          <div class="text-overline text-primary">Assessors & Moderators</div>
          <h3 class="text-h6 font-weight-bold mb-0">Register new professional</h3>
        </div>
      </div>
      <v-chip color="primary" label variant="tonal" prepend-icon="mdi-security">ID validation enabled</v-chip>
    </v-card-title>
    <v-divider />
    <v-card-text>
      <v-alert v-if="message" :type="success ? 'success' : 'error'" class="mb-4" density="comfortable">
        {{ message }}
      </v-alert>
      <v-form @submit.prevent="handleSubmit">
        <v-row dense>
          <v-col cols="12" md="4">
            <v-select
              v-model="form.role"
              :items="roles"
              label="Role"
              variant="outlined"
              density="comfortable"
              prepend-inner-icon="mdi-account-tie"
              required
            />
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="form.name"
              label="Full name"
              variant="outlined"
              density="comfortable"
              prepend-inner-icon="mdi-account"
              required
            />
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="form.email"
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
              v-model="form.idNumber"
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
              v-model="form.motivation"
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
              v-model="usePassport"
              label="Use passport / alternative ID"
              density="compact"
              hide-details
              color="primary"
              prepend-icon="mdi-passport-biometric"
            />
          </v-col>
        </v-row>

        <v-expand-transition>
          <div v-if="needsExtraDetails" class="mt-2">
            <v-alert color="warning" variant="tonal" class="mb-3" icon="mdi-alert">
              ID validation requires additional verification. Please capture passport and document details.
            </v-alert>
            <v-row dense>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="form.passportNumber"
                  label="Passport / Alternative ID"
                  variant="outlined"
                  density="comfortable"
                  prepend-inner-icon="mdi-passport"
                  required
                />
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="form.country"
                  label="Country of issue"
                  variant="outlined"
                  density="comfortable"
                  prepend-inner-icon="mdi-earth"
                  required
                />
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="form.documentType"
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
              v-if="idInsight"
              :color="idInsight.valid ? 'success' : idInsight.isSouthAfrican ? 'error' : 'warning'"
              variant="tonal"
              density="comfortable"
              class="mt-3"
              icon="mdi-information"
            >
              <div class="font-weight-medium">SA ID insight</div>
              <div class="text-body-2">Age: {{ idInsight.age ?? 'Unknown' }} · Gender: {{ idInsight.gender }}</div>
              <div v-if="idInsight.reason" class="text-body-2 mt-1">{{ idInsight.reason }}</div>
            </v-alert>
          </v-col>
          <v-col cols="12" md="6" class="d-flex align-end justify-end mt-2">
            <v-btn :loading="submitting" type="submit" color="primary" prepend-icon="mdi-account-check">
              Submit registration
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { computed, reactive, ref, watch } from 'vue'
import { useRegistryStore } from '~/stores/registry'

const registryStore = useRegistryStore()

const roles = ['Assessor', 'Moderator']
const form = reactive({
  role: 'Assessor',
  name: '',
  email: '',
  idNumber: '',
  motivation: '',
  passportNumber: '',
  country: '',
  documentType: '',
})

const usePassport = ref(false)
const message = ref('')
const success = ref(false)
const idInsight = ref(null)
const submitting = ref(false)

watch(
  () => form.idNumber,
  (value) => {
    idInsight.value = value ? registryStore.validateSouthAfricanId(value) : null
  },
)

const needsExtraDetails = computed(
  () =>
    usePassport.value ||
    (idInsight.value && (!idInsight.value.valid || !idInsight.value.isSouthAfrican)),
)

const resetForm = () => {
  form.role = 'Assessor'
  form.name = ''
  form.email = ''
  form.idNumber = ''
  form.motivation = ''
  form.passportNumber = ''
  form.country = ''
  form.documentType = ''
  idInsight.value = null
  usePassport.value = false
}

const handleSubmit = async () => {
  message.value = ''
  success.value = false
  submitting.value = true

  const response = await registryStore.registerAssessorOrModerator({
    ...form,
    role: form.role,
  })

  submitting.value = false
  success.value = response.success
  message.value = response.success
    ? 'Assessor/moderator recorded with mock API. Verification outcome has been stored.'
    : response.message

  if (response.success) {
    resetForm()
  }
}
</script>
