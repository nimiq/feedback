<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from '../composables/useI18n'
import AttachmentUploader from './AttachmentUploader.vue'

const { t } = useI18n()

const shareDebugInfo = ref(false)

// placeholder constant removed
</script>

<template>
  <label flex>
    <textarea
      id="description" name="description" :placeholder="t('bugForm.descriptionPlaceholder')" :value="t('bugForm.descriptionDefaultValue')" rows="4" required
      nq-input-box focus-visible:outline-blue
    />
  </label>

  <AttachmentUploader />

  <label flex="~ col">
    <h2 mb-8 text="12 neutral-800" nq-label>{{ t('bugForm.emailLabel') }}</h2>
    <input id="email" type="email" nq-input-box name="email" :placeholder="t('bugForm.emailPlaceholder')">
  </label>

  <label flex="~ items-center gap-8" f-text-sm>
    <input v-model="shareDebugInfo" type="checkbox" name="shareDebugInfo" nq-switch>
    <span text-neutral-800 select-none>
      {{ t('bugForm.shareDebugInfoLabel') }}
    </span>
  </label>
</template>
