<script setup lang="ts">
import { useI18n } from '../composables/useI18n'
import AttachmentUploader from './AttachmentUploader.vue'
import DescriptionField from './DescriptionField.vue'
import WidgetIcon from './WidgetIcon.vue'

const { t } = useI18n()
</script>

<template>
  <DescriptionField placeholder-key="ideaForm.descriptionPlaceholder" />

  <AttachmentUploader />

  <div class="-mt-2 flex items-center gap-2 text-sm text-[var(--colors-neutral-700)] lg:text-base">
    <span class="inline-flex h-[1lh] shrink-0">
      <WidgetIcon name="info" class="h-3.5 w-3.5 opacity-90" />
    </span>
    <p>
      {{ t('ideaForm.exampleHint') }}
    </p>
  </div>
</template>
