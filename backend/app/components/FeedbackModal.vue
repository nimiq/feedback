<script setup lang="ts">
import { DialogClose, DialogContent, DialogOverlay, DialogPortal, DialogRoot, DialogTitle, DialogTrigger } from 'reka-ui'

import { nextTick, onBeforeUnmount, shallowRef, useId, watch } from 'vue'

const { lang = 'en', feedbackEndpoint = '/api/feedback', tags = [] } = defineProps<{ lang?: string, feedbackEndpoint?: string, tags?: string[] }>()

const widgetInstance = shallowRef<WidgetInstance>()
const currentView = shallowRef<'grid' | 'form' | 'success' | 'error'>('grid')
const successData = shallowRef<any>()
const errorData = shallowRef<any>()
const isModalOpen = shallowRef(false)

const feedbackWidgetId = `feedback-widget-${useId()}`

useHead({
  link: [{ rel: 'stylesheet', href: '/widget.css' }],
  script: [{
    src: '/widget.js',
    defer: true,
    onload: () => {
      if (isModalOpen.value)
        mountWidget()
    },
  }],
})

function mountWidget() {
  if (widgetInstance.value || !isModalOpen.value)
    return

  if (!window.mountFeedbackWidget) {
    return
  }

  nextTick().then(() => {
    if (widgetInstance.value || !isModalOpen.value || !document.getElementById(feedbackWidgetId))
      return
    widgetInstance.value = window.mountFeedbackWidget(`#${feedbackWidgetId}`, { app: 'playground', lang, feedbackEndpoint, tags })
    setupCommunicationListeners()
  })
}

function setupCommunicationListeners() {
  if (widgetInstance.value?.communication) {
    widgetInstance.value.communication.on('form-selected', () => {
      currentView.value = 'form'
    })
    widgetInstance.value.communication.on('go-back', () => {
      currentView.value = 'grid'
    })
    widgetInstance.value.communication.on('form-submitted', (data) => {
      successData.value = data
      currentView.value = 'success'
    })
    widgetInstance.value.communication.on('form-error', (error) => {
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
  isModalOpen.value = open
  if (open) {
    if (!widgetInstance.value) {
      currentView.value = 'grid'
    }
    nextTick().then(() => {
      mountWidget()
    })
  }
  else {
    cleanupCommunicationListeners()
    widgetInstance.value?.destroy?.()
    widgetInstance.value = undefined
    currentView.value = 'grid'
    successData.value = null
    errorData.value = null
  }
}

watch(() => lang, async (newLang, oldLang) => {
  if (newLang === oldLang || !isModalOpen.value)
    return

  cleanupCommunicationListeners()
  widgetInstance.value?.destroy?.()
  widgetInstance.value = undefined

  if (currentView.value === 'success' || currentView.value === 'error') {
    currentView.value = 'grid'
  }

  await nextTick()
  mountWidget()
}, { immediate: false })

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

onBeforeUnmount(() => {
  cleanupCommunicationListeners()
  widgetInstance.value?.destroy()
})
</script>

<template>
  <DialogRoot @update:open="handleOpenChange">
    <DialogTrigger
      class="feedback-stack fixed bottom-6 right-6 z-[200] h-9 w-9 rounded-full bg-[var(--colors-neutral)] text-[var(--colors-neutral-0)] shadow-lg outline-[1.5px] outline-[color-mix(in_oklch,var(--colors-white)_8%,transparent)] transition-transform lg:bottom-8 lg:right-8 lg:h-10 lg:w-10"
    >
      <Icon name="nimiq:thumb-up-thumb-down" class="h-[22px] w-[22px] lg:h-6 lg:w-6" />
    </DialogTrigger>

    <DialogPortal>
      <Transition name="feedback-backdrop">
        <DialogOverlay class="fixed inset-0 z-[200] bg-[color-mix(in_oklch,var(--colors-darkblue)_60%,transparent)]" />
      </Transition>

      <Transition name="feedback-modal">
        <DialogContent
          class="fixed bottom-8 right-8 z-[200] h-max max-h-[85dvh] w-[calc(100%-2rem)] max-w-[31.25rem] overflow-y-auto rounded-t-[8px] rounded-b-[8px] bg-[var(--colors-neutral-0)] px-6 pt-8 pb-4 shadow-lg outline-[1.5px] outline-[color-mix(in_oklch,var(--colors-neutral)_7%,transparent)] lg:px-10"
        >
          <DialogClose aria-label="Close" class="absolute right-1 top-1 flex h-12 w-12 items-center justify-center bg-transparent">
            <div class="feedback-stack mx-auto h-6 w-6 rounded-full bg-[var(--colors-neutral-400)] text-white transition-colors hover:bg-[var(--colors-neutral-500)]">
              <Icon name="nimiq:cross" class="h-3 w-3" />
            </div>
          </DialogClose>

          <button
            v-if="currentView !== 'grid'" aria-label="Go back"
            class="absolute left-3 top-1 flex h-12 w-12 items-center justify-center bg-transparent text-[var(--colors-neutral-500)] transition-colors hover:text-[var(--colors-neutral-600)]"
            @click="goBack"
          >
            <Icon name="nimiq:arrow-left" class="h-8 w-8" />
          </button>

          <div v-if="currentView === 'success'" class="px-6 py-6 lg:px-8 lg:py-8">
            <DialogTitle as="h2" class="mb-3 flex items-center justify-center gap-2 px-6 text-center text-2xl font-bold leading-6 text-[var(--colors-neutral)] lg:px-10">
              <Icon name="nimiq:check" class="h-4 w-4" />
              Thank you for your feedback!
            </DialogTitle>
            <div class="success-content text-center">
              <p class="mb-16">
                Your feedback has been submitted successfully.
              </p>
              <div
                v-if="successData?.data?.github?.issueUrl || successData?.data?.linear?.issueUrl"
                class="flex flex-wrap items-center justify-center gap-3"
              >
                <NuxtLink
                  v-if="successData?.data?.github?.issueUrl" :to="successData.data.github.issueUrl" target="_blank" external
                  class="feedback-pill feedback-pill--blue inline-flex px-4 py-2 text-sm font-bold"
                >
                  <Icon name="nimiq:logos-github" class="h-[18px] w-[18px]" />
                  View on GitHub
                </NuxtLink>
                <NuxtLink
                  v-if="successData?.data?.linear?.issueUrl" :to="successData.data.linear.issueUrl" target="_blank" external
                  class="feedback-pill feedback-pill--blue inline-flex px-4 py-2 text-sm font-bold"
                >
                  <Icon name="nimiq:arrow-up-right" class="h-[18px] w-[18px]" />
                  View on Linear
                </NuxtLink>
              </div>
              <DialogClose
                class="mx-auto mt-4 block rounded-md bg-gray-600 px-4 py-2 text-white transition-colors hover:bg-gray-700"
              >
                Close
              </DialogClose>
            </div>
          </div>

          <div v-else-if="currentView === 'error'" class="px-6 py-6 lg:px-8 lg:py-8">
            <DialogTitle as="h2" class="mb-3 flex items-center justify-center gap-2 px-6 text-center text-2xl font-bold leading-6 text-[var(--colors-neutral)] lg:px-10">
              <Icon name="nimiq:exclamation" class="h-4 w-4" />
              <span class="flex-1 text-left text-base lg:text-lg">
                Something went wrong
              </span>
            </DialogTitle>
            <div class="error-content text-center">
              <p class="mb-16">
                {{ errorData?.error || 'An error occurred while submitting your feedback.' }}
              </p>
              <button
                data-action="retry"
                class="hover:bg-blue-700 text-white mx-auto mt-4 px-4 py-2 rounded-md bg-blue-600 block transition-colors"
                @click="goBack"
              >
                Try Again
              </button>
            </div>
          </div>
          <div v-show="currentView === 'grid' || currentView === 'form'" :id="feedbackWidgetId" data-feedback-widget />
        </DialogContent>
      </Transition>
    </DialogPortal>
  </DialogRoot>
</template>
