<script setup lang="ts">
import type { FeedbackResponse, FeedbackResponseError, FormType } from '#backend/types'
import { ref } from 'vue'
import { useT } from '../composables/useI18n'

export interface FormContainerEmits {
  formSuccess: [data: FeedbackResponse]
  formError: [{ error: string, details?: any }]
}

const { type, files = [], app, feedbackEndpoint } = defineProps<{
  type: FormType
  files?: File[]
  app: string
  feedbackEndpoint: string
}>()

const emit = defineEmits<FormContainerEmits>()

const acceptTerms = ref('on')

const t = useT()

const error = ref<FeedbackResponseError>()
const status = ref<'idle' | 'pending' | 'success' | 'error'>('idle')
const response = ref<FeedbackResponse>()

const titleKeys: Record<FormType, string> = {
  bug: 'formContainer.titleBug',
  idea: 'formContainer.titleIdea',
  feedback: 'formContainer.titleFeedback',
}

const icon: Record<FormType, string> = {
  bug: 'i-nimiq:exclamation',
  idea: 'i-nimiq:leaf-2-filled',
  feedback: 'i-nimiq:star',
}

// @unocss-include
const iconGradient: Record<FormType, string> = {
  bug: 'bg-gradient-red',
  idea: 'bg-gradient-green',
  feedback: 'bg-gradient-gold',
}

async function submitFeedback(event: SubmitEvent) {
  status.value = 'pending'

  const formEl = event.target as HTMLFormElement
  const formData = new FormData(formEl)

  if (type === 'bug' || type === 'idea') {
    formData.delete('attachments')
    Array.from(files).forEach(file => formData.append('attachments', file as Blob))
  }

  const res = await fetch(feedbackEndpoint, { method: 'POST', body: formData })
    .catch((err) => {
      status.value = 'error'
      return err
    })

  if (!res.ok) {
    status.value = 'error'
    error.value = await res.json() as FeedbackResponseError
    emit('formError', { error: error.value.message, details: error.value })
    return
  }

  response.value = await res.json() as FeedbackResponse
  status.value = 'success'
  emit('formSuccess', response.value)
}
</script>

<template>
  <div flex="~ col">
    <h2 flex="~ items-center gap-8" text-14 mb-16 size-full text-balance nq-label>
      <div
        :class="iconGradient[type]" stack rounded-3 shrink-0 size-24
        style="box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.07), 0px 1.5px 3px 0px rgba(0, 0, 0, 0.05), 0px 0.337px 2px 0px rgba(0, 0, 0, 0.03);"
      >
        <div :class="icon[type]" text-white />
      </div>
      {{ t(titleKeys[type]) }}
    </h2>

    <div v-if="status === 'success'" role="alert">
      <p>{{ t('formContainer.successMessage') }}</p>
    </div>

    <form v-else flex="~ col gap-16" px-1.5 @submit.prevent="submitFeedback">
      <input type="text" name="type" :value="type" sr-only>
      <input type="text" name="app" :value="app" sr-only>

      <slot />

      <label flex="~ items-center gap-8" f-text-sm f-mt-sm>
        <input v-model="acceptTerms" type="checkbox" name="acceptTerms" :value="acceptTerms === 'on'" required nq-switch>
        <span text-neutral-800 select-none>
          <a href="https://nimiq.com" target="_blank" un-text-current>
            {{ t('feedbackWidget.termsAndConditionsLink') }}</a>{{ t('feedbackWidget.termsApplySuffix') }}
        </span>
      </label>

      <div v-if="status === 'error'" role="alert" text="f-xs red-1100" font-semibold>
        <p>
          <strong>{{ t('formContainer.errorPrefix') }}</strong> {{ error?.message }}
        </p>
        <ul v-for="issue in error.issues" :key="issue" list-disc f-px-xs>
          <li>{{ issue }}</li>
        </ul>
        <details>
          <summary>{{ t('formContainer.errorDetailsSummary') }}</summary>
          <pre outline="1.5 red-500" font-mono font-normal rounded-6 bg-red-400 f-p-2xs>{{ error }}</pre>
        </details>
      </div>

      <button type="submit" :disabled="acceptTerms !== 'on' || status === 'pending'" mx-0 mb-0 mt-auto nq-pill-xl nq-pill-blue disabled:op-60>
        <div v-if="status === 'pending'" i-nimiq:spinner />
        {{ status === "pending" ? t('formContainer.sendingButton') : t('formContainer.submitButtonDefault') }}
      </button>
    </form>
  </div>
</template>

<style>
/* Styles remain the same */
[nq-input-box] {
  max-height: calc(6lh + 2 * var(--padding));
  border-radius: 6px;
  padding: 10px 12px;
  border: none;
  --border-color: var(--colors-neutral-400);
  outline: 1.5px solid var(--border-color);
}

[nq-input-box]:placeholder {
  --placeholder-color: var(--colors-neutral-500);
  color: var(--placeholder-color);
  transition: color 200ms var(--nq-ease);
}

[nq-input-box]:hover {
  --border-color: var(--colors-blue-600);
}

[nq-input-box]:focus,
[nq-input-box]:focus-visible {
  --border-color: var(--colors-blue);
  color: var(--colors-blue);
  outline-style: solid;
  outline-width: 1.5px;
}

[nq-pill-xl] {
  border-radius: 9999px;
  color: var(--colors-white);
  width: 100%;
  padding: 1.5lh;
  line-height: 1;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-size: 15px;
}
</style>
