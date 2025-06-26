<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from '../composables/useI18n'
import AttachmentUploader from './AttachmentUploader.vue'

const { t } = useI18n()

const shareDebugInfo = ref(false)
const description = ref('')

// placeholder constant removed
</script>

<template>
  <label flex>
    <textarea
      id="description" v-model="description" name="description" :placeholder="t('bugForm.descriptionPlaceholder')" rows="4" required
      nq-input-box focus-visible:outline-blue
    />
  </label>

  <AttachmentUploader />

  <label flex="~ col">
    <h3 mb-8 text="12 neutral-800" nq-label>{{ t('bugForm.emailLabel') }}</h3>
    <input id="email" w-auto type="email" nq-input-box name="email" :placeholder="t('bugForm.emailPlaceholder')">
  </label>

  <label flex="~ items-center gap-8" data-input="share-debug-info" hidden f-text-sm f-mt-sm>
    <input v-model="shareDebugInfo" type="checkbox" name="shareDebugInfo" shrink-0 nq-switch border-transparent="!">
    <span text-neutral-800 select-none>
      {{ t('bugForm.shareDebugInfoLabel') }}
    </span>
  </label>
</template>

<style>
[data-app='nimiq-pay'] [data-input='share-debug-info'] {
  display: inherit !important;
}
</style>
