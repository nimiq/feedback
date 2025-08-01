<script setup lang="ts">
import { inject, ref, watch } from 'vue'
import { useI18n } from '../composables/useI18n'
import { FormValidationKey } from '../types'

const rating = defineModel<number>({ default: 0 })
const description = ref('')
const { t } = useI18n()

const formValidation = inject(FormValidationKey)
if (formValidation) {
  watch(rating, (newValue) => {
    formValidation.rating.value = newValue
  }, { immediate: true })

  watch(description, (newValue) => {
    formValidation.description.value = newValue
  }, { immediate: true })
}
</script>

<template>
  <div
    flex="~ items-center justify-center gap-24" outline="[&:has(:focus-visible)]:1.5 blue" mx-auto rounded-4 w-max
    f-p-sm
  >
    <template v-for="i in 5" :key="i">
      <input :id="`rating-${i}`" v-model="rating" class="peer" type="radio" name="rating" :value="i" sr-only>
      <label
        :for="`rating-${i}`" :data-state="i <= rating ? 'active' : undefined"
        text="neutral-300 data-[state=active]:gold hocus:gold [&:has(~_label:hover)]:gold" :style="`--i: ${i}; --b:40ms`"
        delay="[calc(25ms*var(--i))] group-hocus:[calc(var(--b)*(5-var(--i)))]" size-40 cursor-pointer transition-colors
        ease-out i-nimiq:star
      />
    </template>
  </div>

  <label flex f-mt-sm>
    <textarea
      id="description" v-model="description" name="description" :placeholder="t('feedbackForm.descriptionPlaceholder')" rows="4"
      required nq-input-box
    />
  </label>
</template>
