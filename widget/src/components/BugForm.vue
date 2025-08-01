<script setup lang="ts">
import { inject, ref, watch } from 'vue'
import { useI18n } from '../composables/useI18n'
import { FormValidationKey } from '../types'
import AttachmentUploader from './AttachmentUploader.vue'

const { t } = useI18n()

const shareDebugInfo = ref(false)
const description = ref('')

const formValidation = inject(FormValidationKey)
if (formValidation) {
  watch(description, (newValue) => {
    formValidation.description.value = newValue
  }, { immediate: true })
}
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

  <label flex="~ gap-8" data-input="share-debug-info" hidden f-text-sm f-mt-sm>
    <span shrink-0 h-1lh>
      <input v-model="shareDebugInfo" type="checkbox" name="shareDebugInfo" nq-switch border-transparent="!">
    </span>
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
