<script setup lang="ts">
import type { FormType } from '#backend/types'
import { computed, ref } from 'vue'
import { useI18n } from '../composables/useI18n'
import { createWidgetCommunication } from '../utils/communication'
import BugForm from './BugForm.vue'
import FeedbackForm from './FeedbackForm.vue'
import FormContainer from './FormContainer.vue'
import IdeaForm from './IdeaForm.vue'

defineProps<{ app: string, feedbackEndpoint?: string }>()

const activeForm = ref<FormType>()
const communication = createWidgetCommunication()
const { t } = useI18n()

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

function handleFormSuccess(data: any) {
  communication.emit('form-submitted', { success: true, data })
}

function handleFormError({ error, details }: { error: string, details?: any }) {
  communication.emit('form-error', { success: false, error, details })
}

// Expose widget control methods
defineExpose({
  showFormGrid() {
    activeForm.value = undefined
  },
  showForm(type: FormType) {
    activeForm.value = type
  },
  closeWidget() {
    activeForm.value = undefined
  },
  goBack() {
    activeForm.value = undefined
    communication.emit('go-back', undefined)
  },
  communication,
})
</script>

<template>
  <Transition
    enter-from-class="op-0" enter-to-class="op-100" leave-to-class="op-0"
    enter-active-class="transition-opacity duration-200" leave-active-class="transition-opacity duration-200"
    mode="out-in"
  >
    <!-- Form selection grid -->
    <div v-if="!activeForm" size-full flex="~ col">
      <h2 text="24 center neutral lh-24" lh-none font-bold mb-12>
        {{ t('feedbackWidget.title') }}
      </h2>

      <div grid="~ rows-2 cols-2 gap-16" class="grid-container" h-full f-mt-lg f-mb-md>
        <button col-span-2 nq-hoverable-red @click="selectForm('bug')">
          <div i-nimiq:exclamation />
          <span>{{ t('feedbackWidget.bugReportButton') }}</span>
        </button>

        <button nq-hoverable-green @click="selectForm('idea')">
          <div i-nimiq:leaf-2-filled />
          <span>{{ t('feedbackWidget.ideaButton') }}</span>
        </button>

        <button nq-hoverable-gold @click="selectForm('feedback')">
          <div i-nimiq:star />
          <span>{{ t('feedbackWidget.feedbackButton') }}</span>
        </button>
      </div>
    </div>

    <FormContainer
      v-else :type="activeForm!" :app :feedback-endpoint
      @form-success="handleFormSuccess" @form-error="handleFormError"
    >
      <component :is="cmp" />
    </FormContainer>
  </Transition>
</template>

<style scoped>
.grid-container {
  button {
    --uno: 'flex flex-col gap-8 items-center border-none justify-center text-white f-text-sm f-p-md f-rounded-md cursor-pointer';

    > div:first-child {
      --uno: 'f-size-md';
    }
  }
}
</style>
