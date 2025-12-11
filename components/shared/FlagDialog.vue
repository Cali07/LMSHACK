<template>
  <v-dialog v-model="model" max-width="500px">
    <v-card>
      <v-card-title class="d-flex align-center">
        <v-icon class="mr-2" color="error">mdi-flag</v-icon>
        Flag {{ roleLabel }}
      </v-card-title>
      <v-divider />
      <v-card-text>
        <p class="text-body-2 mb-3">Provide a reason for flagging. This will be stored with the record.</p>
        <v-textarea
          v-model="reason"
          label="Flag reason"
          variant="outlined"
          density="comfortable"
          rows="3"
          auto-grow
          required
        />
      </v-card-text>
      <v-card-actions class="justify-end">
        <v-btn variant="text" @click="close">Cancel</v-btn>
        <v-btn color="error" :loading="loading" @click="save">Save flag</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { computed, ref, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  roleLabel: {
    type: String,
    default: 'record',
  },
  loading: {
    type: Boolean,
    default: false,
  },
  initialReason: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['update:modelValue', 'save', 'close'])

const reason = ref(props.initialReason)

watch(
  () => props.modelValue,
  (visible) => {
    if (visible) {
      reason.value = props.initialReason
    }
  },
)

const model = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  },
})

const close = () => emit('close')
const save = () => emit('save', reason.value || 'Flagged for manual review')
</script>
