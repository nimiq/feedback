<script setup lang="ts">
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from 'reka-ui'
</script>

<template>
  <DialogRoot>
    <DialogTrigger>
      <button>Hey</button>
    </DialogTrigger>
    <DialogPortal>
      <Transition name="backdrop">
        <DialogOverlay fixed inset-0 z-200 bg-darkblue op-60 />
      </Transition>
      <Transition name="modal">
        <DialogContent
          lg="top-1/2 left-1/2 translate--1/2"
          rounded="t-8 lg:8"
          data-modal
          fixed
          bottom-0
          z-200
          h-max
          max-h-85dvh
          w-full
          transform
          of-y-auto
          shadow-lg
          outline-none
          lg:max-w-500
        >
          <div relative bg-neutral-0 py-32 ring="1.5 neutral/3" class="modal-container">
            <DialogTitle
              text="24 center neutral lh-24"
              mb-12
              px-24
              font-bold
              lh-none
              lg:px-40
              as="h2"
            >
              <slot name="title" />
            </DialogTitle>
            <DialogDescription text="center neutral" block px-24 lg:px-40>
              <slot name="description" />
            </DialogDescription>

            <div mt-12 px-24 lg:px-40>
              CONTENT
            </div>

            <DialogClose aria-label="Close" close-btn absolute right-16 top-16 text-28 />
          </div>
        </DialogContent>
      </Transition>
    </DialogPortal>
  </DialogRoot>
</template>

<style scoped>
/* https://github.com/nimiq/wallet/blob/a88d34bfa16930adbfd52baaa5b0809c38c5c365/src/components/modals/Modal.vue */

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
    transition: transform 200ms ease-out;
  }

  .modal-enter-from,
  .modal-leave-to {
    --un-translate-y: 100%;
  }
}

@media (min-width: 1024px) {
  .modal-enter-active,
  .modal-leave-active {
    transition:
      opacity 250ms cubic-bezier(0.4, 0, 0.2, 1),
      transform 100ms var(--nq-ease);
  }

  .modal-enter-from,
  .modal-leave-to {
    opacity: 0;
    --un-scale-x: 0.96;
    --un-scale-y: 0.96;
    --un-translate-y: calc(-50% - 0.5rem);
  }
}
</style>
