<script setup lang="ts">
import { useI18n } from '../composables/useI18n'
import AttachmentUploader from './AttachmentUploader.vue'

const { t } = useI18n()

// placeholder constant removed
</script>

<template>
  <label flex>
    <textarea id="description" name="description" :placeholder="t('ideaForm.descriptionPlaceholder')" rows="4" required nq-input-box />
  </label>

  <AttachmentUploader />

  <p text-neutral-800 mt--8>
    {{ t('ideaForm.exampleHint') }}
  </p>
</template>
