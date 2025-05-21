<script setup lang="ts">
import type { SubmissionType } from '#backend/types'
import { defineEmits, ref, useTemplateRef } from 'vue'

defineProps<{ type: SubmissionType }>()
defineEmits<{ (e: 'reset'): void }>()
// const props = defineProps<{ type: SubmissionType }>()
const form = useTemplateRef('form')

const error = ref<string>()
const status = ref<'idle' | 'pending' | 'success' | 'error'>('idle')

const title: Record<SubmissionType, string> = {
  bug: 'Report a bug',
  idea: 'Got an idea?',
  feedback: 'Give feedback',
}

// @unocss-include
const icon: Record<SubmissionType, string> = {
  bug: 'i-nimiq:alert',
  idea: 'i-nimiq:leaf-2-filled',
  feedback: 'i-nimiq:star',
}

const iconGradient: Record<SubmissionType, string> = {
  bug: 'bg-gradient-red',
  idea: 'bg-gradient-green',
  feedback: 'bg-gradient-gold',
}

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

    <h2 flex="~ items-center gap-8" text-14 mb-16 px-20 text-balance nq-label>
      <div :class="iconGradient[type]" stack rounded-3 shrink-0 size-24 style="box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.07), 0px 1.5px 3px 0px rgba(0, 0, 0, 0.05), 0px 0.337px 2px 0px rgba(0, 0, 0, 0.03);">
        <div :class="icon[type]" text-white />
      </div>
      {{ title[type] }}
    </h2>

    <form ref="form" px-20 flex="~ col gap-16" @submit.prevent="() => submitFeedback()">
      <input type="text" name="type" :value="type" sr-only>

      <slot />

      <button type="submit" :disabled="status === 'pending'" f-mt-lg nq-pill-xl nq-pill-blue>
        {{ status === "pending" ? "Sending..." : "Submit Feedback" }}
      </button>
    </form>
  </div>
</template>

<style>
[nq-input-box] {
  /* Just for nimiq-feedback */
  max-height: calc(6lh + 2 * var(--padding));

  /* TODO MOve this to nimiq- text-neutral-800ui */
  border-radius: 6px;
  padding: 10px 12px;
  border: none;

  --border-color: rgb(var(--nq-neutral-400));
  outline: 1.5px solid var(--border-color);

  &:placeholder {
    --placeholder-color: rgb(var(--nq-neutral-500));
    color: var(--placeholder-color);
    transition: color 200ms var(--nq-ease);
  }

  &:hover {
    --border-color: rgb(var(--nq-blue-600));
  }

  &:focus-visible {
    --border-color: rgb(var(--nq-blue));
    color: rgb(var(--nq-blue));
  }
}

[nq-pill-xl] {
  border-radius: 9999px;
  color: rgb(var(--nq-white));
  width: 100%;
  padding: 1.5lh;
  line-height: 1;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-size: 15px;
}
</style>
