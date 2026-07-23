<script setup lang="ts">
import { shallowRef, watch } from 'vue'
import { useRequiredInjection } from '../composables/useRequiredInjection'
import { useUniqueId } from '../composables/useUniqueId'
import { FormValidationKey } from '../types'
import DescriptionField from './DescriptionField.vue'
import WidgetIcon from './WidgetIcon.vue'

const rating = defineModel<number>({ default: 0 })
const hoveredRating = shallowRef<number | null>(null)
const ratingId = useUniqueId('rating')

const formValidation = useRequiredInjection(FormValidationKey, 'FormValidationKey')

watch(rating, (newValue) => {
  formValidation.rating.value = newValue
}, { immediate: true })
</script>

<template>
  <div class="feedback-rating-group">
    <template v-for="i in 5" :key="i">
      <input :id="`${ratingId}-${i}`" v-model="rating" class="peer" type="radio" name="rating" :value="i" sr-only>
      <label
        :for="`${ratingId}-${i}`"
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

  <div class="mt-4 lg:mt-6">
    <DescriptionField placeholder-key="feedbackForm.descriptionPlaceholder" />
  </div>
</template>
