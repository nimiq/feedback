<script setup lang="ts">
import { shallowRef } from 'vue'
import { useI18n } from '../composables/useI18n'
import { useUniqueId } from '../composables/useUniqueId'
import AttachmentUploader from './AttachmentUploader.vue'
import DescriptionField from './DescriptionField.vue'

const { t } = useI18n()

const shareDebugInfo = shallowRef(false)
const emailId = useUniqueId('email')
</script>

<template>
  <DescriptionField placeholder-key="bugForm.descriptionPlaceholder" />

  <AttachmentUploader />

  <label class="flex flex-col">
    <h3 class="feedback-label mb-2 text-[var(--colors-neutral-800)]">{{ t('bugForm.emailLabel') }}</h3>
    <input :id="emailId" class="feedback-input w-auto" type="email" name="email" :placeholder="t('bugForm.emailPlaceholder')">
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
