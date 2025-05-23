<script setup lang="ts">
import type { FormType } from '#backend/types'
import { computed, ref } from 'vue'
import { createWidgetCommunication } from '../utils/communication'
import BugForm from './BugForm.vue'
import FeedbackForm from './FeedbackForm.vue'
import FormContainer from './FormContainer.vue'
import IdeaForm from './IdeaForm.vue'

// MODIFIED: Added appName to props
const props = defineProps<{ appName: string }>()

const activeForm = ref<FormType>()
const communication = createWidgetCommunication()

const cmp = computed(() => {
  switch (activeForm.value) {
    case 'bug':
      return BugForm
    case 'idea':
      return IdeaForm
    case 'feedback':
      return FeedbackForm
    default:
      return null
  }
})

function selectForm(type: FormType) {
  activeForm.value = type
  communication.emit('form-selected', type)
}

function goBack() {
  console.log('Widget goBack called, resetting activeForm')
  activeForm.value = undefined
  communication.emit('go-back', undefined)
}

// Handle form submission events
function handleFormSuccess(data: any) {
  console.log('Form submitted successfully WIDGET:', data)
  communication.emit('form-submitted', { success: true, data })
}

function handleFormError({ error, details }: { error: string, details?: any }) {
  communication.emit('formError', { success: false, error, details })
}

// Expose widget control methods
defineExpose({
  showFormGrid() {
    activeForm.value = undefined
  },
  showForm(type: FormType) {
    console.log('showForm widget', type)
    activeForm.value = type
  },
  closeWidget() {
    activeForm.value = undefined
  },
  goBack,
  communication,
})

const files = ref<File[]>([])
</script>

<template>
  <Transition
    enter-from-class="op-0" enter-to-class="op-100" leave-to-class="op-0"
    enter-active-class="transition-opacity duration-200" leave-active-class="transition-opacity duration-200"
    mode="out-in"
  >
    <!-- Form selection grid -->
    <div v-if="!activeForm">
      <h2 text="24 center neutral lh-24" font-bold lh-none mb-12>
        {{ $t('feedbackWidget.title') }}
      </h2>

      <div flex="~ col gap-32">
        <div grid="~ rows-2 cols-2 gap-16" f-mt-lg f-mb-md class="grid-container">
          <button data-color="red" col-span-2 nq-hoverable @click="selectForm('bug')">
            <div i-nimiq:exclamation />
            <span>{{ $t('feedbackWidget.bugReportButton') }}</span>
          </button>

          <button data-color="green" nq-hoverable @click="selectForm('idea')">
            <div i-nimiq:leaf-2-filled />
            <span>{{ $t('feedbackWidget.ideaButton') }}</span>
          </button>

          <button data-color="gold" nq-hoverable @click="selectForm('feedback')">
            <div i-nimiq:star />
            <span>{{ $t('feedbackWidget.feedbackButton') }}</span>
          </button>
        </div>
        <p text="center f-sm neutral-800">
          <a href="https://nimiq.com" target="_blank" un-text-current underline hocus:bg-transparent>
            {{ $t('feedbackWidget.termsAndConditionsLink') }}</a>{{ $t('feedbackWidget.termsApplySuffix') }}
        </p>
      </div>
    </div>

    <!-- MODIFIED: Pass appName to FormContainer -->
    <FormContainer
      v-else :files="files" :type="activeForm!" :app-name="props.appName" @form-success="handleFormSuccess"
      @form-error="handleFormError"
    >
      <component :is="cmp" />
    </FormContainer>
  </Transition>
</template>

<style scoped>
.grid-container {
  button {
    --uno: 'flex flex-col gap-8 items-center justify-center text-white f-text-sm f-p-md f-rounded-md cursor-pointer';

    &[data-color='green'] {
      --uno: 'bg-gradient-green hocus:bg-gradient-green-darkened';
    }

    &[data-color='red'] {
      --uno: 'bg-gradient-red hocus:bg-gradient-red-darkened';
    }

    &[data-color='gold'] {
      --uno: 'bg-gradient-gold hocus:bg-gradient-gold-darkened';
    }

    > div:first-child {
      --uno: 'f-size-md';
    }
  }
}
</style>
