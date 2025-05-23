<script setup lang="ts">
import type { WidgetInstance } from '../../env'
import { DialogClose, DialogContent, DialogOverlay, DialogPortal, DialogRoot, DialogTitle, DialogTrigger } from 'reka-ui'
import { nextTick, ref } from 'vue'

const widgetContainer = ref<HTMLElement>()
const widgetInstance = ref<WidgetInstance>()
const currentView = ref<'grid' | 'form' | 'success' | 'error'>('grid')
const successData = ref<any>()
const errorData = ref<any>()

// Mount the widget when the modal opens
async function mountWidget() {
  await nextTick()

  // Make sure the widget script is loaded
  if (!window.mountFeedbackWidget) {
    console.error('Widget script not loaded')
    return
  }

  widgetInstance.value = window.mountFeedbackWidget('#widget-container')

  // Set up direct communication with the widget
  if (widgetInstance.value?.communication) {
    widgetInstance.value.communication.on('form-selected', (type) => {
      console.log('[playground] Form selected:', type)
      currentView.value = 'form'
    })

    widgetInstance.value.communication.on('go-back', () => {
      console.log('[playground] Go back event received')
      currentView.value = 'grid'
    })

    widgetInstance.value.communication.on('form-submitted', (data) => {
      console.log('[playground] Form submitted successfully:', data)
      successData.value = data
      currentView.value = 'success'
    })

    widgetInstance.value.communication.on(formError, (error) => {
      console.log('[playground] Form submission error:', error)
      errorData.value = error
      currentView.value = 'error'
    })
  }
}

function handleOpenChange(open: boolean) {
  if (open) {
    mountWidget()
  }
  else {
    // Reset state when modal closes
    // Clean up communication listeners if they exist
    if (widgetInstance.value?.communication) {
      widgetInstance.value.communication.off('form-selected')
      widgetInstance.value.communication.off('go-back')
      widgetInstance.value.communication.off('form-submitted')
      widgetInstance.value.communication.off(formError)
    }

    // unloadCSS()
    // unloadJs()
    currentView.value = 'grid'
    successData.value = null
    errorData.value = null
    if (widgetInstance.value)
      widgetInstance.value = undefined
  }
}

function goBack() {
  console.log('[playground] Going back from:', currentView.value)

  if (currentView.value === 'success' || currentView.value === 'error') {
    currentView.value = 'form'
    // If we're coming from success/error state, go back to the form
  }
  else if (currentView.value === 'form') {
    currentView.value = 'grid'
    widgetInstance.value?.goBack()
  }
}
</script>

<template>
  <DialogRoot @update:open="handleOpenChange">
    <DialogTrigger
      text="22/24 neutral-0" outline="1.5 offset--1.5 white/8" f-size="36/40" stack rounded-full bg-neutral
      shadow-lg fixed f-bottom-md f-right-md @mouseenter="mountWidget" @focus="mountWidget"
    >
      <div i-nimiq:thumb-up-thumb-down />
    </DialogTrigger>

    <DialogPortal>
      <Transition name="backdrop">
        <DialogOverlay bg-darkblue op-60 inset-0 fixed z-200 />
      </Transition>

      <Transition name="modal">
        <DialogContent
          lg="f-bottom-md f-right-md" rounded="t-8 lg:8"
          outline="1.5 offset--1.5 neutral/7"
          f-px="24/40" data-modal bg-neutral-0 h-max max-h-85dvh w-full shadow-lg transform bottom-32 right-32 fixed z-200 of-y-auto f-pt-xl f-pb-sm lg:max-w-500
        >
          <!-- Close button -->
          <DialogClose aria-label="Close" bg-transparent size-48 right-4 top-4 absolute>
            <div bg="neutral-400 hocus:neutral-500" stack mx-auto rounded-full size-24 transition-colors>
              <div text-white size-12 i-nimiq:cross />
            </div>
          </DialogClose>

          <!-- Back button - show when not on grid view -->
          <button
            v-if="currentView !== 'grid'" aria-label="Go back" text="neutral-500 hocus:neutral-600" text-32
            bg-transparent size-48 transition-colors left-12 top-4 absolute nq-arrow-back before:left-8 @click="goBack"
          />

          <!-- Success view -->
          <div v-if="currentView === 'success'" class="success-view f-p-md">
            <DialogTitle text="24 center neutral lh-24" font-bold lh-none mb-12 px-24 lg:px-40 as="h2">
              <div i-nimiq:check />
              Thank you for your feedback!
            </DialogTitle>
            <div class="success-content text-center">
              <p class="mb-16">
                Your feedback has been submitted successfully.
              </p>
              <a v-if="successData?.data?.github?.issueUrl" :href="successData.data.github.issueUrl" target="_blank" nq-pill-arrow nq-pill-blue>
                <div i-nimiq:logos-github />
                View on GitHub
              </a>
              <DialogClose
                class="text-white mx-auto mt-4 px-4 py-2 rounded-md bg-gray-600 block transition-colors hover:bg-gray-700"
              >
                Close
              </DialogClose>
            </div>
          </div>

          <!-- Error view -->
          <div v-else-if="currentView === 'error'" class="error-view f-p-md">
            <DialogTitle text="24 center neutral lh-24" font-bold lh-none mb-12 px-24 lg:px-40 as="h2">
              <div i-nimiq:exclamation />
              Something went wrong
            </DialogTitle>
            <div class="error-content text-center">
              <p class="mb-16">
                {{ errorData?.error || 'An error occurred while submitting your feedback.' }}
              </p>
              <button class="text-white mx-auto mt-4 px-4 py-2 rounded-md bg-blue-600 block transition-colors hover:bg-blue-700" @click="goBack">
                Try Again
              </button>
            </div>
          </div>

          <!-- Widget container -->
          <div v-else id="widget-container" ref="widgetContainer" />
        </DialogContent>
      </Transition>
    </DialogPortal>
  </DialogRoot>
</template>
