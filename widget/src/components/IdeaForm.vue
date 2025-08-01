<script setup lang="ts">
import { inject, ref, watch } from 'vue'
import { useI18n } from '../composables/useI18n'
import { FormValidationKey } from '../types'
import AttachmentUploader from './AttachmentUploader.vue'

const { t } = useI18n()

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
      id="description" v-model="description" name="description" :placeholder="t('ideaForm.descriptionPlaceholder')" rows="4" required
      nq-input-box
    />
  </label>

  <AttachmentUploader />

  <div text="neutral-700 f-sm" mt--8 flex="~ items-center gap-8">
    <span shrink-0 h-1lh>
      <div op-90 i-nimiq:info />
    </span>
    <p>
      {{ t('ideaForm.exampleHint') }}
    </p>
  </div>
</template>
