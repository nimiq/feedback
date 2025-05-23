<script setup lang="ts">
import AttachmentUploader from './AttachmentUploader.vue'

const files = defineModel<File[]>({ default: [] })

// placeholder constant removed
</script>

<template>
  <label>
    <textarea
      id="description" name="description" :placeholder="$t('bugForm.descriptionPlaceholder')" :value="$t('bugForm.descriptionDefaultValue')" rows="4" required
      nq-input-box
    />
  </label>

  <AttachmentUploader v-model="files" :max-files="5" />

  <label>
    <h2 mb-8 text="12 neutral-800" nq-label>{{ $t('bugForm.emailLabel') }}</h2>
    <input id="email" type="email" nq-input-box name="email" :placeholder="$t('bugForm.emailPlaceholder')">
  </label>
</template>
