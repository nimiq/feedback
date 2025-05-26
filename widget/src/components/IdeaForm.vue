<script setup lang="ts">
import { useT } from '../composables/useI18n'
import AttachmentUploader from './AttachmentUploader.vue'

const files = defineModel<File[]>({ default: [] })
const t = useT()

// placeholder constant removed
</script>

<template>
  <label>
    <textarea id="description" name="description" :placeholder="t('ideaForm.descriptionPlaceholder')" rows="4" required nq-input-box />
  </label>

  <AttachmentUploader :max-files="5" :files />

  <p text-neutral-800 mt--8>
    {{ t('ideaForm.exampleHint') }}
  </p>
</template>
