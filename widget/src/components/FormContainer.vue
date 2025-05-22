<script setup lang="ts">
import type { FeedbackResponse, FeedbackResponseError, SubmissionType } from '#backend/types'
import { ref } from 'vue'

const { type, files = [] } = defineProps<{ type: SubmissionType, files?: File[] }>()

const error = ref<FeedbackResponseError>()
const status = ref<'idle' | 'pending' | 'success' | 'error'>('idle')
const response = ref<FeedbackResponse>()

const title: Record<SubmissionType, string> = {
  bug: 'Report a bug',
  idea: 'Got an idea?',
  feedback: 'Give feedback',
}

// @unocss-include
const icon: Record<SubmissionType, string> = {
  bug: 'i-nimiq:exclamation',
  idea: 'i-nimiq:leaf-2-filled',
  feedback: 'i-nimiq:star',
}

const iconGradient: Record<SubmissionType, string> = {
  bug: 'bg-gradient-red',
  idea: 'bg-gradient-green',
  feedback: 'bg-gradient-gold',
}

const feedbackEndpoint = 'http://localhost:3000/api/feedback'

async function submitFeedback(event: SubmitEvent) {
  status.value = 'pending'

  const formEl = event.target as HTMLFormElement
  const formData = new FormData(formEl)

  // Attach files manually to FormData
  if (type === 'bug' || type === 'idea') {
    // The form files has mime type "octet-stream" and not the original mime type
    // This is a workaround to get the original mime type
    formData.delete('attachments')
    Array.from(files).forEach(file => formData.append('attachments', file))
  }

  const res = await fetch(feedbackEndpoint, { method: 'POST', body: formData })
    .catch((err) => {
      status.value = 'error'
      return err
    })

  if (!res.ok) {
    status.value = 'error'
    error.value = await res.json() as FeedbackResponseError
    return
  }

  response.value = await res.json() as FeedbackResponse
  status.value = 'success'
}
</script>

<template>
  <div>
    <h2 flex="~ items-center gap-8" text-14 mb-16 px-20 text-balance nq-label>
      <div
        :class="iconGradient[type]" stack rounded-3 shrink-0 size-24
        style="box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.07), 0px 1.5px 3px 0px rgba(0, 0, 0, 0.05), 0px 0.337px 2px 0px rgba(0, 0, 0, 0.03);"
      >
        <div :class="icon[type]" text-white />
      </div>
      {{ title[type] }}
    </h2>

    <div v-if="status === 'success'" role="alert">
      Thank you for your feedback! Your issue has been created.
      <pre>
        {{ { response } }}
      </pre>
    </div>

    <form v-else px-20 flex="~ col gap-16" @submit.prevent="submitFeedback">
      <input type="text" name="type" :value="type" sr-only>

      <slot />

      <div v-if="status === 'error'" role="alert" text="f-xs red-1100" font-semibold f-px-xs>
        <p>
          <strong>Error:</strong> {{ error?.message }}
        </p>
        <ul v-for="issue in error.issues" :key="issue" list-disc f-px-xs>
          <li>{{ issue }}</li>
        </ul>
        <details>
          <summary>Details</summary>
          <pre outline="1.5 red-500" font-normal font-mono rounded-6 bg-red-400 f-p-2xs>{{ error }}</pre>
        </details>
      </div>

      <button type="submit" :disabled="status === 'pending'" f-mt-lg nq-pill-xl nq-pill-blue disabled:op-60>
        <div v-if="status === 'pending'" i-nimiq:spinner />
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
