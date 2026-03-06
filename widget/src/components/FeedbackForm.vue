<script setup lang="ts">
import { ref, watch } from 'vue'
import { useI18n } from '../composables/useI18n'
import { useRequiredInjection } from '../composables/useRequiredInjection'
import { FormValidationKey } from '../types'
import WidgetIcon from './WidgetIcon.vue'

const rating = defineModel<number>({ default: 0 })
const description = ref('')
const hoveredRating = ref<number | null>(null)
const { t } = useI18n()

const formValidation = useRequiredInjection(FormValidationKey, 'FormValidationKey')

watch(rating, (newValue) => {
  formValidation.rating.value = newValue
}, { immediate: true })

watch(description, (newValue) => {
  formValidation.description.value = newValue
}, { immediate: true })
</script>

<template>
  <div class="feedback-rating-group">
    <template v-for="i in 5" :key="i">
      <input :id="`rating-${i}`" v-model="rating" class="peer" type="radio" name="rating" :value="i" sr-only>
      <label
        :for="`rating-${i}`"
        :data-active="i <= (hoveredRating ?? rating)"
        :style="`--i: ${i}`"
        class="feedback-rating-star h-10 w-10"
        @mouseenter="hoveredRating = i"
        @mouseleave="hoveredRating = null"
      >
        <WidgetIcon name="star" class="h-10 w-10" />
      </label>
    </template>
  </div>

  <label class="mt-4 flex lg:mt-6">
    <textarea
      id="description" v-model="description" name="description" :placeholder="t('feedbackForm.descriptionPlaceholder')" rows="4"
      required class="feedback-input"
    />
  </label>
</template>
