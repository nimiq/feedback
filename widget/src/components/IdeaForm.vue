<script setup lang="ts">
import { useI18n } from '../composables/useI18n'
import AttachmentUploader from './AttachmentUploader.vue'

const { t } = useI18n()
</script>

<template>
  <label flex>
    <textarea
      id="description" name="description" :placeholder="t('ideaForm.descriptionPlaceholder')" rows="4" required
      nq-input-box
    />
  </label>

  <AttachmentUploader />

  <div text="neutral-700 f-sm" mt--8 flex="~ items-center gap-8">
    <div op-90 shrink-0 i-nimiq:info />
    <p>
      {{ t('ideaForm.exampleHint') }}
    </p>
  </div>
</template>
