<script setup lang="ts">
import type { FormType } from '#backend/types'
import type { I18nContext } from '../locales/types'
import { DialogClose, DialogContent, DialogDescription, DialogOverlay, DialogPortal, DialogRoot, DialogTitle, DialogTrigger, VisuallyHidden } from 'reka-ui'
import { computed, nextTick, provide, ref, watch } from 'vue'
import { localeMessages } from '../locales'
import { I18nInjectionKey } from '../locales/types'
import { FilesInjectionKey } from '../types'
import { createTranslationFunction } from '../utils/i18n'
import FeedbackWidget from './FeedbackWidget.vue'

interface FeedbackModalProps {
  app: string
  lang?: string
  feedbackEndpoint?: string
  tags?: string[]
  initialForm?: FormType
  dark?: boolean
  open?: boolean
  test?: boolean
}

const props = withDefaults(defineProps<FeedbackModalProps>(), {
  lang: 'en',
  feedbackEndpoint: undefined,
  tags: () => [],
  initialForm: undefined,
  dark: false,
  open: false,
  test: false,
})

const emit = defineEmits<{
  'update:open': [value: boolean]
}>()

const widgetInstance = ref<any>()
const currentView = ref<'grid' | 'form' | 'success' | 'error'>('grid')
const successData = ref<any>()
const errorData = ref<any>()
const internalOpen = ref(false)

// Use internal state when not controlled externally
const isModalOpen = computed({
  get: () => internalOpen.value,
  set: (value) => {
    internalOpen.value = value
    emit('update:open', value)
  },
})

// Sync with external prop when controlled
watch(() => props.open, (newVal) => {
  internalOpen.value = newVal
})

const computedFeedbackEndpoint = computed(() => {
  if (!props.feedbackEndpoint)
    return undefined
  const url = new URL(props.feedbackEndpoint)
  if (props.test) {
    url.searchParams.set('test', 'true')
  }
  return url.toString()
})

// Provide i18n context
const currentMessages = localeMessages[props.lang] || localeMessages.en
const i18nContext: I18nContext = {
  locale: props.lang,
  messages: currentMessages,
  t: createTranslationFunction(currentMessages),
}
provide(I18nInjectionKey, i18nContext)

// Provide files context
const files = ref<File[]>([])
provide(FilesInjectionKey, {
  files,
  updateFiles: (newFiles: File[]) => {
    files.value = newFiles
  },
})

function setupCommunicationListeners() {
  if (widgetInstance.value?.communication) {
    widgetInstance.value.communication.on('form-selected', (_type: FormType) => {
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
  <DialogRoot v-model:open="isModalOpen" @update:open="handleOpenChange">
    <DialogTrigger as-child>
      <slot>
        <button
          type="button"
          aria-label="Open Feedback"
          flex="~ items-center justify-center"
          text="neutral-0 hocus:neutral-100"

          shadow-md rounded-full bg-neutral transition-colors f-text-md f-size-lg
          @click="() => { console.log('Button clicked!'); isModalOpen = true }"
        >
          <div f-text-lg i-nimiq:thumb-up-thumb-down />
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

          f-rounded-t-md outline-none h-max max-h-85dvh max-w-140 w-full shadow-lg transform bottom-0 fixed z-200 of-hidden xl:f-rounded-md
          @open-auto-focus.prevent
        >
          <VisuallyHidden>
            <DialogTitle>Feedback</DialogTitle>
            <DialogDescription>Share your feedback with us</DialogDescription>
          </VisuallyHidden>
          <div ring="1.5 neutral/3" flex="~ col" f-rounded-t-md bg-neutral-0 h-full max-h-85dvh relative of-hidden xl:f-rounded-md>
            <!-- Close button -->
            <DialogClose
              aria-label="Close"
              flex="~ items-center justify-center"
              text="neutral-800 hocus:neutral-900"
              outline="1.5 ~ offset--1.5 neutral/3"
              bg="neutral-200 hocus:neutral-300"
              f-inset-r-xs f-inset-t-xs rounded-full cursor-pointer transition-colors absolute z-10 f-text-sm f-size-sm
            >
              <div i-nimiq:cross />
            </DialogClose>

            <!-- Back button -->
            <button
              v-if="currentView !== 'grid'"
              aria-label="Go back"
              text="neutral-500 hocus:neutral-600"

              f-inset-l-xs f-inset-t-2xs bg-transparent transition-colors absolute f-text-xl f-size-lg
              @click="goBack"
            >
              <div i-nimiq:arrow-left />
            </button>

            <!-- Widget Container with scrollbar -->
            <div flex-1 of-x-hidden of-y-auto f-py-md>
              <div f-px-md>
                <!-- Success view -->
                <div v-if="currentView === 'success'" f-p-md>
                  <h2 text="center neutral" flex="~ items-center justify-center" lh-none font-bold f-text-lg f-mb-xs f-gap-xs>
                    <div i-nimiq:check />
                    <span>Thank you for your feedback!</span>
                  </h2>
                  <div text-center>
                    <p f-mb-sm>
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
                  <h2 text="center neutral" flex="~ items-center justify-center" lh-none font-bold f-text-lg f-mb-xs f-gap-xs>
                    <div f-size-sm i-nimiq:exclamation />
                    <span text-left flex-1 f-text-md>
                      Something went wrong
                    </span>
                  </h2>
                  <div text-center>
                    <p f-mb-sm>
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
                <FeedbackWidget v-else ref="widgetInstance" v-bind="{ app, tags, initialForm, dark, feedbackEndpoint: computedFeedbackEndpoint }" />
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
  transition: opacity 250ms cubic-bezier(0.4, 0, 0.2, 1);
}

.backdrop-leave-active {
  transition: opacity 200ms cubic-bezier(0.4, 0, 0.2, 1);
}

.backdrop-enter-from,
.backdrop-leave-to {
  opacity: 0;
}

@media (max-width: 1280px) {
  .modal-enter-active {
    transition: transform 300ms cubic-bezier(0.16, 1, 0.3, 1);
  }

  .modal-leave-active {
    transition: transform 250ms cubic-bezier(0.4, 0, 1, 1);
  }

  .modal-enter-from,
  .modal-leave-to {
    transform: translateY(100%);
  }
}

@media (min-width: 1280px) {
  .modal-enter-active {
    transition:
      opacity 200ms cubic-bezier(0.4, 0, 0.2, 1),
      transform 300ms cubic-bezier(0.16, 1, 0.3, 1);
  }

  .modal-leave-active {
    transition:
      opacity 150ms cubic-bezier(0.4, 0, 1, 1),
      transform 200ms cubic-bezier(0.4, 0, 1, 1);
  }

  .modal-enter-from,
  .modal-leave-to {
    opacity: 0;
    transform: translate(-50%, calc(-50% - 0.5rem)) scale(0.96);
  }
}
</style>
