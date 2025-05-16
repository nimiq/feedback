<script setup lang="ts">
import type { SubmissionType } from '#backend/types'
import { ref, useTemplateRef } from 'vue'

defineProps<{ type: SubmissionType }>()
// const props = defineProps<{ type: SubmissionType }>()
const form = useTemplateRef('form')

const error = ref<string>()
const status = ref<'idle' | 'pending' | 'success' | 'error'>('idle')

async function submitFeedback() {
  // TODO

}

// Used to reset the form after successful submission
// const { error, execute: submitFeedback, status } = await useFetch('/api/feedback', {
//   method: 'POST',
//   body: computed(() => {
//     if (!form.value)
//       return undefined

//     const formData = new FormData(form.value)
//     // Make sure we include the submission type
//     formData.append('type', props.type)

//     return formData
//   }),
//   immediate: false,
//   watch: false,
//   onResponseError: (error: any) => {
//     console.error('Form submission error:', error)
//   },
//   onResponse: () => {
//     // Reset the form on successful submission
//     if (form.value) {
//       form.value.reset()
//       emit('reset')
//     }
//   },
// })
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
