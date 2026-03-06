<script setup lang="ts">
import { ref, watch } from 'vue'
import { useI18n } from '../composables/useI18n'
import { useRequiredInjection } from '../composables/useRequiredInjection'
import { FormValidationKey } from '../types'
import AttachmentUploader from './AttachmentUploader.vue'

const { t } = useI18n()

const shareDebugInfo = ref(false)
const description = ref('')

const formValidation = useRequiredInjection(FormValidationKey, 'FormValidationKey')

watch(description, (newValue) => {
  formValidation.description.value = newValue
}, { immediate: true })
</script>

<template>
  <label class="flex">
    <textarea
      id="description" v-model="description" name="description" :placeholder="t('bugForm.descriptionPlaceholder')" rows="4" required
      class="feedback-input"
    />
  </label>

  <AttachmentUploader />

  <label class="flex flex-col">
    <h3 class="feedback-label mb-2 text-[var(--colors-neutral-800)]">{{ t('bugForm.emailLabel') }}</h3>
    <input id="email" class="feedback-input w-auto" type="email" name="email" :placeholder="t('bugForm.emailPlaceholder')">
  </label>

  <label class="mt-4 hidden gap-2 text-sm lg:mt-6" data-input="share-debug-info">
    <span class="inline-flex h-[1lh] shrink-0">
      <input v-model="shareDebugInfo" class="feedback-switch border-transparent" type="checkbox" name="shareDebugInfo">
    </span>
    <span class="select-none text-[var(--colors-neutral-800)]">
      {{ t('bugForm.shareDebugInfoLabel') }}
    </span>
  </label>
</template>

<style>
[data-app='nimiq-pay'] [data-input='share-debug-info'] {
  display: inherit !important;
}
</style>
