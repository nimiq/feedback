<script setup lang="ts">
import type { SubmissionType } from '#imports'
import { computed, useFetch, useTemplateRef } from '#imports'

const props = defineProps<{ type: SubmissionType }>()
const emit = defineEmits(['reset'])
const form = useTemplateRef('form')

// Used to reset the form after successful submission
const { error, execute: submitFeedback, status } = await useFetch('/api/feedback', {
  method: 'POST',
  body: computed(() => {
    if (!form.value)
      return undefined

    const formData = new FormData(form.value)
    // Make sure we include the submission type
    formData.append('type', props.type)

    return formData
  }),
  immediate: false,
  watch: false,
  onResponseError: (error: any) => {
    console.error('Form submission error:', error)
  },
  onResponse: () => {
    // Reset the form on successful submission
    if (form.value) {
      form.value.reset()
      emit('reset')
    }
  },
})
</script>

<template>
  <div>
    <div v-if="status === 'success'" role="alert">
      Thank you for your feedback! Your issue has been created.
    </div>

    <div v-if="status === 'error'" role="alert">
      Error: {{ error }}
    </div>

    <form ref="form" @submit.prevent="() => submitFeedback()">
      <input type="text" name="type" :value="type" sr-only>
      <slot />

      <button type="submit" :disabled="status === 'pending'">
        {{ status === 'pending' ? 'Submitting...' : 'Submit Feedback' }}
      </button>
    </form>
  </div>
</template>
