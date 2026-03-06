<script setup lang="ts">
import type { FeedbackResponse, FeedbackResponseError, FormType } from '#backend/types'
import { computed, provide, ref } from 'vue'
import { useI18n } from '../composables/useI18n'
import { useRequiredInjection } from '../composables/useRequiredInjection'
import { CommunicationInjectionKey, FilesInjectionKey, FormValidationKey } from '../types'
import WidgetIcon from './WidgetIcon.vue'

export interface FormContainerEmits {
  formSuccess: [data: FeedbackResponse]
  formError: [{ error: string, details?: any }]
}

const { type, app, feedbackEndpoint, tags = [] } = defineProps<{
  type: FormType
  app: string
  feedbackEndpoint?: string
  tags?: string[]
}>()
const emit = defineEmits<FormContainerEmits>()

const { files } = useRequiredInjection(FilesInjectionKey, 'FilesInjectionKey')
const communication = useRequiredInjection(CommunicationInjectionKey, 'CommunicationInjectionKey')

const acceptTerms = ref(false)
const description = ref('')
const rating = ref(0)

provide(FormValidationKey, { description, rating })

const { t } = useI18n()
const isFormValid = computed(() => {
  const hasDescription = description.value.trim().length > 0
  const hasRating = type === 'feedback' ? rating.value > 0 : true
  const hasAcceptedTerms = acceptTerms.value

  return hasDescription && hasRating && hasAcceptedTerms
})

const error = ref<FeedbackResponseError>()
const status = ref<'idle' | 'pending' | 'success' | 'error'>('idle')
const response = ref<FeedbackResponse>()

const titleKeys: Record<FormType, string> = {
  bug: 'formContainer.titleBug',
  idea: 'formContainer.titleIdea',
  feedback: 'formContainer.titleFeedback',
}

const icon: Record<FormType, 'exclamation' | 'leaf-2-filled' | 'star'> = {
  bug: 'exclamation',
  idea: 'leaf-2-filled',
  feedback: 'star',
}

const iconGradient: Record<FormType, string> = {
  bug: 'feedback-icon-badge--red',
  idea: 'feedback-icon-badge--green',
  feedback: 'feedback-icon-badge--gold',
}

async function parseErrorResponse(res: Response): Promise<FeedbackResponseError> {
  try {
    const data = await res.json() as FeedbackResponseError & { data?: FeedbackResponseError }
    if (data?.data?.message) {
      return {
        success: false,
        message: data.data.message,
        issues: data.data.issues,
        details: data.data.details ?? data,
      }
    }
    if (data?.message) {
      return data
    }
  }
  catch {
  }

  return {
    success: false,
    message: `Request failed with ${res.status} ${res.statusText}`.trim(),
  }
}

function setSubmissionError(nextError: FeedbackResponseError) {
  error.value = nextError
  status.value = 'error'
  emit('formError', { error: nextError.message, details: nextError })
}

async function submitFeedback(event: SubmitEvent) {
  // eslint-disable-next-line no-console
  console.log('[Nimiq Feedback Widget] 📤 Starting form submission...')
  status.value = 'pending'

  const formEl = event.target as HTMLFormElement
  const formData = new FormData(formEl)

  /* eslint-disable no-console */
  if (type === 'bug' || type === 'idea') {
    console.log('Submitting feedback:', {
      type: formData.get('type'),
      app: formData.get('app'),
      attachments: files.value,
    })
    formData.delete('attachments')
    console.log('Files to be attached:', files.value)
    Array.from(files.value, file => file).forEach(file => formData.append('attachments', file as Blob))
    console.log('Form data after appending files:', Array.from(formData.entries(), entry => entry))
  }

  // Emit before-submit hook to allow host to add additional data (like debug logs)
  communication?.emit('before-submit', { formData, type, app })

  let res: Response
  try {
    res = await fetch(feedbackEndpoint ?? '/api/feedback', { method: 'POST', body: formData })
  }
  catch (err) {
    console.log('[Nimiq Feedback Widget] ❌ Form submission failed before a response was received')
    setSubmissionError({
      success: false,
      message: err instanceof Error ? err.message : 'Unable to submit feedback. Please try again.',
      details: err,
    })
    return
  }

  if (!res.ok) {
    console.log(`[Nimiq Feedback Widget] ❌ Form submission failed: ${res.status} ${res.statusText}`)
    setSubmissionError(await parseErrorResponse(res))
    return
  }

  response.value = await res.json() as FeedbackResponse
  status.value = 'success'

  console.log('[Nimiq Feedback Widget] ✅ Form submitted successfully')
  emit('formSuccess', response.value)
}
</script>

<template>
  <div class="flex h-full flex-col">
    <h2 class="feedback-label mb-4 flex h-max w-full items-center gap-2 text-balance text-sm">
      <div
        :class="iconGradient[type]"
        class="feedback-icon-badge feedback-stack h-6 w-6 shrink-0 rounded-[3px]"
      >
        <WidgetIcon :name="icon[type]" class="h-3.5 w-3.5 text-white" />
      </div>
      {{ t(titleKeys[type]) }}
    </h2>

    <div v-if="status === 'success'" role="alert">
      <p>{{ t('formContainer.successMessage') }}</p>
    </div>

    <form v-else :data-app="app" class="flex h-full flex-col gap-4 px-1.5" @submit.prevent="submitFeedback">
      <input type="text" name="type" :value="type" sr-only>
      <input type="text" name="app" :value="app" sr-only>
      <input type="text" name="tags" :value="tags.join(',')" sr-only>

      <slot />

      <label class="mt-4 flex items-start gap-2 text-sm lg:mt-6">
        <span class="mt-1 inline-flex h-[1lh] shrink-0">
          <input v-model="acceptTerms" class="feedback-switch border-transparent" type="checkbox" name="acceptTerms" required>
        </span>
        <span class="select-none text-[var(--colors-neutral-800)]">
          {{ t('formContainer.consentTermsAndFeedback') }} <span class="text-[var(--colors-orange)]">*</span>
        </span>
      </label>

      <p class="mt-6 text-sm text-[var(--colors-neutral-700)] lg:mt-8">
        <a href="https://nimiq.com/terms/" target="_blank" class="text-current underline">
          {{ t('formContainer.readFullTerms') }}</a>
        <span class="mx-2">·</span>
        <a href="https://nimiq.com/privacy-policy/" target="_blank" class="text-current underline">
          {{ t('formContainer.learnMore') }}</a> {{ t('formContainer.privacyPolicyText') }}
      </p>

      <div v-if="status === 'error'" role="alert" class="text-xs font-semibold text-[var(--colors-red-1100)] sm:text-sm">
        <p>
          <strong>{{ t('formContainer.errorPrefix') }}</strong> {{ error?.message }}
        </p>
        <ul v-for="issue in error?.issues" :key="issue" class="list-disc px-3 sm:px-4">
          <li>{{ issue }}</li>
        </ul>
        <details>
          <summary>{{ t('formContainer.errorDetailsSummary') }}</summary>
          <pre class="rounded-md bg-[var(--colors-red-400)] p-2 font-mono font-normal outline-[1.5px] outline-[var(--colors-red-500)] sm:p-3">{{ error }}</pre>
        </details>
      </div>

      <div class="mt-auto flex">
        <button
          type="submit"
          :disabled="!isFormValid || status === 'pending'"
          class="feedback-pill feedback-pill--blue feedback-pill--xl w-full disabled:opacity-60"
        >
          <WidgetIcon v-if="status === 'pending'" name="spinner" class="h-4 w-4" />
          {{ status === "pending" ? t('formContainer.sendingButton') : t('formContainer.submitButtonDefault') }}
        </button>
      </div>
    </form>
  </div>
</template>
