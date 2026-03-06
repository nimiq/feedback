<script setup lang="ts">
import type { FormType } from '#backend/types'
import { computed, provide, ref } from 'vue'
import { useI18n } from '../composables/useI18n'
import { useRequiredInjection } from '../composables/useRequiredInjection'
import { CommunicationInjectionKey, FilesInjectionKey } from '../types'
import { createWidgetCommunication } from '../utils/communication'
import BugForm from './BugForm.vue'
import FeedbackForm from './FeedbackForm.vue'
import FormContainer from './FormContainer.vue'
import IdeaForm from './IdeaForm.vue'
import WidgetIcon from './WidgetIcon.vue'

const { app, feedbackEndpoint, tags = [], initialForm, dark = false } = defineProps<{
  app: string
  feedbackEndpoint?: string
  tags?: string[]
  initialForm?: FormType
  dark?: boolean
}>()

const activeForm = ref<FormType>()
const communication = createWidgetCommunication()
const { t } = useI18n()

const { resetFiles } = useRequiredInjection(FilesInjectionKey, 'FilesInjectionKey')

if (initialForm)
  activeForm.value = initialForm
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
    resetFiles()
  },
  showForm(type: FormType) {
    activeForm.value = type
  },
  closeWidget() {
    activeForm.value = undefined
    resetFiles()
  },
  goBack() {
    activeForm.value = undefined
    resetFiles()
    communication.emit('go-back', undefined)
  },
  communication,
})
</script>

<template>
  <div :style="{ colorScheme: dark ? 'dark' : 'light' }">
    <Transition
      enter-from-class="opacity-0" enter-to-class="opacity-100" leave-to-class="opacity-0"
      enter-active-class="transition-opacity duration-200" leave-active-class="transition-opacity duration-200"
      mode="out-in"
    >
      <!-- Form selection grid -->
      <div v-if="!activeForm" class="flex w-full flex-col">
        <h3 class="mb-3 text-center text-2xl font-bold leading-6 text-[var(--colors-neutral)]">
          {{ t('feedbackWidget.title') }}
        </h3>

        <div class="mt-8 mb-6 grid h-full grid-cols-2 grid-rows-2 gap-4 lg:mt-12 lg:mb-8">
          <button class="feedback-hover-card feedback-hover-card--red col-span-2 text-sm lg:text-base" @click="selectForm('bug')">
            <WidgetIcon name="exclamation" class="h-6 w-6 lg:h-8 lg:w-8" />
            <span>{{ t('feedbackWidget.bugReportButton') }}</span>
          </button>

          <button class="feedback-hover-card feedback-hover-card--green text-sm lg:text-base" @click="selectForm('idea')">
            <WidgetIcon name="leaf-2-filled" class="h-6 w-6 lg:h-8 lg:w-8" />
            <span>{{ t('feedbackWidget.ideaButton') }}</span>
          </button>

          <button class="feedback-hover-card feedback-hover-card--gold text-sm lg:text-base" @click="selectForm('feedback')">
            <WidgetIcon name="star" class="h-6 w-6 lg:h-8 lg:w-8" />
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
