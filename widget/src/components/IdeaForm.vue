<script setup lang="ts">
import { ref, watch } from 'vue'
import { useI18n } from '../composables/useI18n'
import { useRequiredInjection } from '../composables/useRequiredInjection'
import { FormValidationKey } from '../types'
import AttachmentUploader from './AttachmentUploader.vue'
import WidgetIcon from './WidgetIcon.vue'

const { t } = useI18n()

const description = ref('')

const formValidation = useRequiredInjection(FormValidationKey, 'FormValidationKey')

watch(description, (newValue) => {
  formValidation.description.value = newValue
}, { immediate: true })
</script>

<template>
  <label class="flex">
    <textarea
      id="description" v-model="description" name="description" :placeholder="t('ideaForm.descriptionPlaceholder')" rows="4" required
      class="feedback-input"
    />
  </label>

  <AttachmentUploader />

  <div class="-mt-2 flex items-center gap-2 text-sm text-[var(--colors-neutral-700)] lg:text-base">
    <span class="inline-flex h-[1lh] shrink-0">
      <WidgetIcon name="info" class="h-3.5 w-3.5 opacity-90" />
    </span>
    <p>
      {{ t('ideaForm.exampleHint') }}
    </p>
  </div>
</template>
