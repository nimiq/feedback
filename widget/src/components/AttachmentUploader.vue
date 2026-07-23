<script setup lang="ts">
import { onBeforeUnmount, ref, shallowRef, useTemplateRef, watch } from 'vue'
import { imageMimeTypes, maxAttachments, maxAttachmentSize } from '#backend/utils'
import { useI18n } from '../composables/useI18n'
import { useRequiredInjection } from '../composables/useRequiredInjection'
import { useUniqueId } from '../composables/useUniqueId'
import { FilesInjectionKey } from '../types'
import WidgetIcon from './WidgetIcon.vue'

const { maxFiles = maxAttachments } = defineProps<{ maxFiles?: number }>()
const { files, removeFile, setFiles } = useRequiredInjection(FilesInjectionKey, 'FilesInjectionKey')

const previews = ref<string[]>([])
const imageAspectRatios = ref<number[]>([])
const validationError = shallowRef('')

const { t } = useI18n()
const fileInput = useTemplateRef<HTMLInputElement>('file-input')
const fileInputId = useUniqueId('attachments')

function resetPreviews() {
  previews.value.forEach(url => URL.revokeObjectURL(url))
  previews.value = []
  imageAspectRatios.value = []
}

// Watch for external changes to files (like when going back) and clean up previews
watch(files, (newFiles) => {
  if (newFiles.length === 0)
    resetPreviews()
}, { deep: true })

onBeforeUnmount(() => {
  resetPreviews()
})

function handleFileSelect() {
  if (!fileInput.value)
    return
  const selectedFiles = Array.from(fileInput.value.files ?? [], file => file)
  validationError.value = ''
  const validFiles = selectedFiles.filter((file) => {
    if (!imageMimeTypes.includes(file.type)) {
      validationError.value = t('attachmentUploader.unsupportedType', { name: file.name })
      return false
    }
    if (file.size > maxAttachmentSize) {
      validationError.value = t('attachmentUploader.fileTooLarge', { name: file.name })
      return false
    }
    return true
  })
  const combinedFiles = [...files.value, ...validFiles]
  if (combinedFiles.length > maxFiles)
    validationError.value = t('attachmentUploader.tooManyFiles', { max: maxFiles })
  const newFiles = combinedFiles.slice(0, maxFiles)
  setFiles(newFiles)
  resetPreviews()

  files.value.forEach((file, index) => {
    const url = URL.createObjectURL(file)
    previews.value.push(url)

    const img = new Image()
    img.onload = () => {
      const aspectRatio = img.width / img.height
      imageAspectRatios.value[index] = aspectRatio
    }
    img.src = url
  })

  fileInput.value.value = ''
}

function handleRemoveFile(index: number) {
  URL.revokeObjectURL(previews.value[index])
  removeFile(index)
  previews.value.splice(index, 1)
  imageAspectRatios.value.splice(index, 1)
}
</script>

<template>
  <label :for="fileInputId" :class="{ 'cursor-pointer': files.length === 0 }" class="group w-full">
    <h3 class="feedback-label mb-2 text-[var(--colors-neutral-800)]">{{ t('attachmentUploader.title') }}</h3>

    <div class="grid w-full gap-4" style="grid-template-columns: repeat(auto-fit, 8rem);">
      <div
        v-for="(preview, index) in previews" :key="preview"
        class="feedback-stack !h-32 !w-32 rounded-[4px] outline-[1.5px] outline-[var(--colors-neutral-200)]" :class="[
          imageAspectRatios[index] < 1 ? '' : 'aspect-square',
        ]"
        :style="imageAspectRatios[index] < 1 ? { aspectRatio: imageAspectRatios[index] } : {}"
      >
        <img
          :src="preview" :alt="t('attachmentUploader.previewAlt', { number: index + 1 })"
          class="max-h-32 h-full rounded-[4px] bg-[var(--colors-neutral-100)] object-contain"
        >
        <button
          type="button" :aria-label="t('attachmentUploader.deleteImageLabel')"
          class="feedback-stack relative right-[-0.75rem] top-[-0.75rem] justify-self-end self-start rounded-full bg-[var(--colors-white)] shadow-[var(--nq-shadow)] outline-[1.5px] outline-[color-mix(in_oklch,var(--colors-white)_8%,transparent)] h-6 w-6"
          @click.stop.capture="handleRemoveFile(index)"
        >
          <WidgetIcon name="cross" class="h-2.5 w-2.5 text-[var(--colors-neutral)]" />
        </button>
      </div>

      <div
        v-if="files.length < maxFiles"
        class="flex aspect-square h-32 w-32 flex-col items-center justify-center rounded-[4px] outline-[1.5px] outline-[color-mix(in_oklch,var(--colors-neutral)_15%,transparent)]"
      >
        <WidgetIcon name="mountain-frame" class="h-6 w-6 text-[var(--colors-neutral-700)] transition-colors group-hover:text-[var(--colors-neutral-800)]" />
        <span class="mt-6 font-semibold">{{ t('attachmentUploader.uploadHere') }}</span>
        <span class="mt-2 px-2 text-center text-xs text-[var(--colors-neutral-800)] sm:text-sm">{{ t('attachmentUploader.anyImageFormat') }}</span>
      </div>
    </div>

    <p v-if="validationError" role="alert" class="mt-2 text-sm text-[var(--colors-red-1100)]">
      {{ validationError }}
    </p>

    <input
      :id="fileInputId" ref="file-input" type="file" name="attachments" :accept="imageMimeTypes.join(',')" multiple sr-only
      @change="handleFileSelect"
    >
  </label>
</template>
