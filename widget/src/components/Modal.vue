<script setup lang="ts">
import { DialogClose, DialogContent, DialogOverlay, DialogPortal, DialogRoot, DialogTitle, DialogTrigger } from 'reka-ui'
import { computed, ref } from 'vue'
import BugForm from './BugForm.vue'
import FeedbackForm from './FeedbackForm.vue'
import IdeaForm from './IdeaForm.vue'

const activeForm = ref<'issue' | 'idea' | 'feedback'>()

const cmp = computed(() => {
  switch (activeForm.value) {
    case 'issue':
      return BugForm
    case 'idea':
      return IdeaForm
    case 'feedback':
      return FeedbackForm
    default:
      return null
  }
})
</script>

<template>
  <DialogRoot>
    <DialogTrigger
      text="22/24 neutral-0" outline=" 1.5  offset--1.5 white/8" f-size="36/40" stack rounded-full
      bg-neutral shadow-lg fixed f-bottom-md f-right-md
    >
      <div i-nimiq:thumb-up-thumb-down />
    </DialogTrigger>
    <DialogPortal>
      <Transition name="backdrop">
        <DialogOverlay bg-darkblue op-60 inset-0 fixed z-200 />
      </Transition>
      <Transition name="modal">
        <DialogContent lg="f-bottom-md f-right-md" rounded="t-8 lg:8" data-modal h-full max-h-85dvh w-full shadow-lg transform fixed z-200 of-y-auto lg:max-w-500>
          <div ring="1.5 neutral/3" bg-neutral-0 relative f-pt-xl f-pb-sm>
            <DialogClose aria-label="Close" bg-transparent size-48 right-4 top-4 absolute>
              <div bg="neutral-400 hocus:neutral-500" stack mx-auto rounded-full size-24 transition-colors>
                <div text-white size-12 i-nimiq:cross />
              </div>
            </DialogClose>

            <button
              aria-label="Go back" text="neutral-500 hocus:neutral-600" text-32 bg-transparent size-48
              transition-colors left-12 top-4 absolute nq-arrow-back before:left-8 @click="activeForm = undefined"
            />

            <Transition
              enter-from-class="op-0" enter-to-class="op-100" leave-to-class="op-0"
              enter-active-class="transition-opacity duration-200" leave-active-class="transition-opacity duration-200"
              mode="out-in"
            >
              <div v-if="!activeForm">
                <DialogTitle text="24 center neutral lh-24" font-bold lh-none mb-12 px-24 lg:px-40 as="h2">
                  Send your feedback
                </DialogTitle>

                <div flex="~ col gap-32">
                  <div grid="~ rows-2 cols-2 gap-16" f-mt-sm f-p-md class="grid-container">
                    <button data-color="red" col-span-2 @click="activeForm = 'issue'">
                      <div i-nimiq:exclamation />
                      <span>Bug report</span>
                    </button>

                    <button data-color="green" @click="activeForm = 'idea'">
                      <div i-nimiq:leaf-2-filled />
                      <span>Got an idea?</span>
                    </button>

                    <button data-color="gold" @click="activeForm = 'feedback'">
                      <div i-nimiq:star />
                      <span>Feedback</span>
                    </button>
                  </div>
                  <p text="center f-sm neutral-800">
                    <a href="https://nimiq.com" target="_blank" un-text-current underline hocus:bg-transparent>
                      Terms and conditions</a> apply
                  </p>
                </div>
              </div>
              <component :is="cmp" v-else />
            </Transition>
          </div>
        </DialogContent>
      </Transition>
    </DialogPortal>
  </DialogRoot>
</template>

<style scoped>
ul li {
  --uno: 'size-full flex flex-col relative shrink-0 snap-center snap-always px-32 of-y-auto';
}

.grid-container {
  button {
    --uno: 'flex flex-col gap-8 items-center justify-center text-white nq-hoverable f-text-sm f-p-md f-rounded-md cursor-pointer';

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

.backdrop-enter-active {
  transition: opacity 650ms cubic-bezier(0.3, 1, 0.2, 1);
}

.backdrop-leave-active {
  transition: opacity 650ms cubic-bezier(0.3, 0, 0, 1);
}

.backdrop-enter-from,
.backdrop-leave-to {
  opacity: 0;
}

@media (max-width: 1024px) {
  .modal-enter-active,
  .modal-leave-active {
    transform-origin: bottom right;
    transition: transform 200ms ease-out;
  }

  .modal-enter-from,
  .modal-leave-to {
    --un-scale: 0.96;
  }
}

@media (min-width: 1024px) {
  .modal-enter-active,
  .modal-leave-active {
    transform-origin: bottom right;
    transition:
      opacity 250ms cubic-bezier(0.4, 0, 0.2, 1),
      transform 100ms var(--nq-ease);
  }

  .modal-enter-from,
  .modal-leave-to {
    opacity: 0;
    --un-scale: 0.96;
  }
}
</style>
