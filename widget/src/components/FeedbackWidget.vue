<script setup lang="ts">
import type { FormType } from '#backend/types'
import { computed, inject, provide, ref } from 'vue'
import { useI18n } from '../composables/useI18n'
import { CommunicationInjectionKey, FilesInjectionKey } from '../types'
import { createWidgetCommunication } from '../utils/communication'
import BugForm from './BugForm.vue'
import FeedbackForm from './FeedbackForm.vue'
import FormContainer from './FormContainer.vue'
import IdeaForm from './IdeaForm.vue'

const props = defineProps<{ app: string, feedbackEndpoint?: string, tags?: string[], initialForm?: FormType, dark?: boolean }>()
const { app, feedbackEndpoint, tags = [], dark = false } = props

const activeForm = ref<FormType>()
const communication = createWidgetCommunication()
const { t } = useI18n()

const { updateFiles } = inject(FilesInjectionKey)

if (props.initialForm)
  activeForm.value = props.initialForm
provide(CommunicationInjectionKey, communication)

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
  // eslint-disable-next-line no-console
  console.log('[Nimiq Feedback Widget] 📡 Notifying parent component...')
  communication.emit('form-submitted', { success: true, data })
  // eslint-disable-next-line no-console
  console.log('[Nimiq Feedback Widget] ✨ Event sent to host application')
}

function handleFormError({ error, details }: { error: string, details?: any }) {
  communication.emit('form-error', { success: false, error, details })
}

defineExpose({
  showFormGrid() {
    activeForm.value = undefined
    // Prevent files from persisting when navigating away
    updateFiles([])
  },
  showForm(type: FormType) {
    activeForm.value = type
  },
  closeWidget() {
    activeForm.value = undefined
    // Prevent files from persisting when navigating away
    updateFiles([])
  },
  goBack() {
    activeForm.value = undefined
    // Prevent files from persisting when navigating away
    updateFiles([])
    communication.emit('go-back', undefined)
  },
  communication,
})
</script>

<template>
  <div :style="{ colorScheme: dark ? 'dark' : 'light' }">
    <Transition
      enter-from-class="op-0" enter-to-class="op-100" leave-to-class="op-0"
      enter-active-class="transition-opacity duration-200" leave-active-class="transition-opacity duration-200"
      mode="out-in"
    >
      <!-- Form selection grid -->
      <div v-if="!activeForm" w-full flex="~ col">
        <h3 text="24 center neutral lh-24" lh-none font-bold mb-12>
          {{ t('feedbackWidget.title') }}
        </h3>

        <div grid="~ rows-2 cols-2 gap-16" class="grid-container" h-full f-mt-lg f-mb-md>
          <button text-white col-span-2 nq-hoverable-red flex="~ col justify-center items-center gap-12" @click="selectForm('bug')">
            <div f-text-2xl i-nimiq:exclamation />
            <span>{{ t('feedbackWidget.bugReportButton') }}</span>
          </button>

          <button text-white nq-hoverable-green flex="~ col justify-center items-center gap-12" @click="selectForm('idea')">
            <div f-text-2xl i-nimiq:leaf-2-filled />
            <span>{{ t('feedbackWidget.ideaButton') }}</span>
          </button>

          <button text-white nq-hoverable-gold flex="~ col justify-center items-center gap-12" @click="selectForm('feedback')">
            <div f-text-2xl i-nimiq:star />
            <span>{{ t('feedbackWidget.feedbackButton') }}</span>
          </button>
        </div>
      </div>

      <FormContainer
        v-else :type="activeForm!" :app :feedback-endpoint :tags
        @form-success="handleFormSuccess" @form-error="handleFormError"
      >
        <component :is="cmp" />
      </FormContainer>
    </Transition>
  </div>
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
