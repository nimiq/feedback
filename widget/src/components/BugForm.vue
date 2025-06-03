<script setup lang="ts">
import { useI18n } from '../composables/useI18n'
import AttachmentUploader from './AttachmentUploader.vue'

const files = defineModel<File[]>({ default: [] })
const { t } = useI18n()

// placeholder constant removed
</script>

<template>
  <label>
    <textarea
      id="description" name="description" :placeholder="t('bugForm.descriptionPlaceholder')" :value="t('bugForm.descriptionDefaultValue')" rows="4" required
      nq-input-box focus-visible:outline-blue
    />
  </label>

  <AttachmentUploader v-model="files" :max-files="5" />

  <label>
    <h2 mb-8 text="12 neutral-800" nq-label>{{ t('bugForm.emailLabel') }}</h2>
    <input id="email" type="email" nq-input-box name="email" :placeholder="t('bugForm.emailPlaceholder')">
  </label>
</template>
