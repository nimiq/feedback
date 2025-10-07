<script setup lang="ts">
import type { FormType } from '#backend/types'
import { DialogClose, DialogContent, DialogOverlay, DialogPortal, DialogRoot, DialogTrigger } from 'reka-ui'
import { computed, nextTick, ref, watch } from 'vue'
import { useI18n } from '../composables/useI18n'
import { FilesInjectionKey } from '../types'
import { createWidgetCommunication } from '../utils/communication'
import FeedbackWidget from './FeedbackWidget.vue'

interface FeedbackModalProps {
  app: string
  lang?: string
  feedbackEndpoint?: string
  tags?: string[]
  initialForm?: FormType
  dark?: boolean
  open?: boolean
}

const props = withDefaults(defineProps<FeedbackModalProps>(), {
  lang: 'en',
  feedbackEndpoint: undefined,
  tags: () => [],
  initialForm: undefined,
  dark: false,
  open: false,
})

const emit = defineEmits<{
  'update:open': [value: boolean]
}>()

const widgetInstance = ref<any>()
const currentView = ref<'grid' | 'form' | 'success' | 'error'>('grid')
const successData = ref<any>()
const errorData = ref<any>()
const isModalOpen = computed({
  get: () => props.open,
  set: (value) => emit('update:open', value),
})

const files = ref<File[]>([])

function setupCommunicationListeners() {
  if (widgetInstance.value?.communication) {
    widgetInstance.value.communication.on('form-selected', (type: FormType) => {
      currentView.value = 'form'
    })
    widgetInstance.value.communication.on('go-back', () => {
      currentView.value = 'grid'
    })
    widgetInstance.value.communication.on('form-submitted', (data: any) => {
      successData.value = data
      currentView.value = 'success'
    })
    widgetInstance.value.communication.on('form-error', (error: any) => {
      errorData.value = error
      currentView.value = 'error'
    })
  }
}

function cleanupCommunicationListeners() {
  if (widgetInstance.value?.communication) {
    widgetInstance.value.communication.off('form-selected')
    widgetInstance.value.communication.off('go-back')
    widgetInstance.value.communication.off('form-submitted')
    widgetInstance.value.communication.off('form-error')
  }
}

function handleOpenChange(open: boolean) {
  emit('update:open', open)
  if (!open) {
    cleanupCommunicationListeners()
    widgetInstance.value = undefined
    currentView.value = 'grid'
    successData.value = null
    errorData.value = null
    files.value = []
  }
}

function goBack() {
  if (currentView.value === 'success' || currentView.value === 'error') {
    currentView.value = 'grid'
    widgetInstance.value?.showFormGrid?.()
  }
  else if (currentView.value === 'form') {
    currentView.value = 'grid'
    widgetInstance.value?.goBack()
  }
}

watch(() => props.lang, async (newLang, oldLang) => {
  if (newLang === oldLang || !isModalOpen.value)
    return

  cleanupCommunicationListeners()
  widgetInstance.value = undefined

  if (currentView.value === 'success' || currentView.value === 'error') {
    currentView.value = 'grid'
  }

  await nextTick()
  setupCommunicationListeners()
}, { immediate: false })

watch(() => props.open, async (open) => {
  if (open) {
    currentView.value = 'grid'
    await nextTick()
    setupCommunicationListeners()
  }
})
</script>

<template>
  <DialogRoot :open="isModalOpen" @update:open="handleOpenChange">
    <DialogTrigger as-child>
      <slot>
        <button
          aria-label="Open Feedback"
          flex="~ items-center justify-center"
          text="neutral-0 hocus:neutral-100 20"
          bg="blue hocus:blue-darkened"
          rounded-full size-48 transition-colors shadow-md
        >
          <div i-nimiq:thumbs-up />
        </button>
      </slot>
    </DialogTrigger>

    <DialogPortal>
      <Transition name="backdrop">
        <DialogOverlay bg-darkblue op-60 inset-0 fixed z-200 />
      </Transition>

      <Transition name="modal">
        <DialogContent
          xl="top-1/2 left-1/2 translate--1/2"
          rounded="t-8 xl:8"
          outline-none h-max max-h-85dvh w-full shadow-lg transform bottom-0 fixed z-200 of-hidden xl:max-w-500
          @open-auto-focus.prevent
        >
          <div ring="1.5 neutral/3" rounded="t-8 xl:8" flex="~ col" bg-neutral-0 h-full max-h-85dvh relative of-hidden>
            <!-- Close button -->
            <DialogClose
              aria-label="Close"
              flex="~ items-center justify-center"
              text="neutral-700 hocus:neutral-800 12"
              outline="1.5 ~ offset--1.5 neutral/3"
              bg="neutral-100 hocus:neutral-200"
              rounded-full size-32 transition-colors right-16 top-16 absolute z-10
            >
              <div i-nimiq:cross />
            </DialogClose>

            <!-- Back button -->
            <button
              v-if="currentView !== 'grid'"
              aria-label="Go back"
              text="neutral-500 hocus:neutral-600 32"
              bg-transparent size-48 transition-colors left-12 top-4 absolute
              @click="goBack"
            >
              <div i-nimiq:arrow-left />
            </button>

            <!-- Widget Container with scrollbar -->
            <div flex-1 of-x-hidden of-y-auto f-py-md>
              <div f-px-md>
                <!-- Success view -->
                <div v-if="currentView === 'success'" f-p-md>
                  <h2 text="24 center neutral lh-24" flex="~ gap-8 items-center justify-center" lh-none font-bold mb-12>
                    <div i-nimiq:check />
                    <span>Thank you for your feedback!</span>
                  </h2>
                  <div text-center>
                    <p mb-16>
                      Your feedback has been submitted successfully.
                    </p>
                    <a
                      v-if="successData?.data?.github?.issueUrl"
                      :href="successData.data.github.issueUrl"
                      target="_blank"
                      nq-pill-arrow nq-pill-blue
                    >
                      <div i-nimiq:logos-github />
                      View on GitHub
                    </a>
                  </div>
                </div>

                <!-- Error view -->
                <div v-else-if="currentView === 'error'" f-p-md>
                  <h2 text="24 center neutral lh-24" flex="~ gap-8 items-center justify-center" lh-none font-bold mb-12>
                    <div size-16 i-nimiq:exclamation />
                    <span text-left flex-1 f-text-md>
                      Something went wrong
                    </span>
                  </h2>
                  <div text-center>
                    <p mb-16>
                      {{ errorData?.error || 'An error occurred while submitting your feedback.' }}
                    </p>
                    <button
                      nq-pill-blue
                      @click="goBack"
                    >
                      Try Again
                    </button>
                  </div>
                </div>

                <!-- Widget -->
                <FeedbackWidget
                  v-else
                  ref="widgetInstance"
                  :app
                  :feedback-endpoint
                  :tags
                  :initial-form
                  :dark
                />
              </div>
            </div>
          </div>
        </DialogContent>
      </Transition>
    </DialogPortal>
  </DialogRoot>
</template>

<style scoped>
.backdrop-enter-active {
  transition: opacity 650ms cubic-bezier(.3, 1, .2, 1);
}

.backdrop-leave-active {
  transition: opacity 650ms cubic-bezier(.3, 0, 0, 1);
}

.backdrop-enter-from,
.backdrop-leave-to {
  opacity: 0;
}

@media (max-width: 1280px) {
  .modal-enter-active,
  .modal-leave-active {
    transition: transform 200ms ease-out;
  }

  .modal-enter-from,
  .modal-leave-to {
    transform: translateY(100%);
  }
}

@media (min-width: 1280px) {
  .modal-enter-active,
  .modal-leave-active {
    transition:
      opacity 250ms cubic-bezier(.4, 0, .2, 1),
      transform 100ms var(--nq-ease);
  }

  .modal-enter-from,
  .modal-leave-to {
    opacity: 0;
    transform: translate(-50%, calc(-50% - 0.5rem)) scale(0.96);
  }
}
</style>
