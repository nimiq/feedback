<script setup lang="ts">
import { shallowRef, watch } from 'vue'
import { useI18n } from '../composables/useI18n'
import { useRequiredInjection } from '../composables/useRequiredInjection'
import { useUniqueId } from '../composables/useUniqueId'
import { FormValidationKey } from '../types'

defineOptions({ name: 'DescriptionField' })

const { placeholderKey } = defineProps<{
  placeholderKey: string
}>()

const description = shallowRef('')
const descriptionId = useUniqueId('description')
const formValidation = useRequiredInjection(FormValidationKey, 'FormValidationKey')
const { t } = useI18n()

watch(description, (newValue) => {
  formValidation.description.value = newValue
}, { immediate: true })
</script>

<template>
  <label class="flex" :for="descriptionId">
    <textarea
      :id="descriptionId"
      v-model="description"
      name="description"
      :placeholder="t(placeholderKey)"
      rows="4"
      required
      class="feedback-input"
    />
  </label>
</template>
