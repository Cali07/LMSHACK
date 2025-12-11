<template>
  <v-card elevation="6" class="mb-6" rounded="lg">
    <v-card-title class="d-flex align-center justify-space-between">
      <div class="d-flex align-center">
        <v-avatar color="secondary" size="46" class="mr-3">
          <v-icon color="white">mdi-school</v-icon>
        </v-avatar>
        <div>
          <div class="text-overline text-secondary">Learners / Students</div>
          <h3 class="text-h6 font-weight-bold mb-0">Capture new learner</h3>
        </div>
      </div>
      <v-chip color="secondary" label variant="tonal" prepend-icon="mdi-shield-check">Compliance ready</v-chip>
    </v-card-title>
    <v-divider />
    <v-card-text>
      <v-alert v-if="message" :type="success ? 'success' : 'error'" class="mb-4" density="comfortable">
        {{ message }}
      </v-alert>
      <v-form @submit.prevent="handleSubmit">
        <v-row dense>
          <v-col cols="12" md="5">
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
              v-model="form.idNumber"
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
              v-model="form.profile"
              label="Profile photo (mocked)"
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
              v-model="usePassport"
              label="Use passport / alternative ID"
              density="compact"
              hide-details
              color="secondary"
              prepend-icon="mdi-passport-biometric"
            />
          </v-col>
        </v-row>

        <v-expand-transition>
          <div v-if="needsExtraDetails" class="mt-2">
            <v-alert color="warning" variant="tonal" class="mb-3" icon="mdi-alert">
              Non-SA ID detected. Capture supporting document details to continue.
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
              <div class="font-weight-medium">ID insight</div>
              <div class="text-body-2">Age: {{ idInsight.age ?? 'Unknown' }} · Gender: {{ idInsight.gender }}</div>
              <div v-if="idInsight.reason" class="text-body-2 mt-1">{{ idInsight.reason }}</div>
            </v-alert>
          </v-col>
          <v-col cols="12" md="6" class="d-flex align-end justify-end mt-2">
            <v-btn :loading="submitting" type="submit" color="secondary" prepend-icon="mdi-school">
              Add learner
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

const form = reactive({
  name: '',
  idNumber: '',
  passportNumber: '',
  country: '',
  documentType: '',
  profile: null,
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
  form.name = ''
  form.idNumber = ''
  form.passportNumber = ''
  form.country = ''
  form.documentType = ''
  form.profile = null
  idInsight.value = null
  usePassport.value = false
}

const handleSubmit = async () => {
  message.value = ''
  success.value = false
  submitting.value = true

  const response = await registryStore.registerLearner({
    ...form,
  })

  submitting.value = false
  success.value = response.success
  message.value = response.success
    ? 'Learner captured with mock API. Verification outcome has been stored.'
    : response.message

  if (response.success) {
    resetForm()
  }
}
</script>
