<script setup lang="ts">
import { inject, ref } from 'vue'
import { useI18n } from '../composables/useI18n'
import { FilesInjectionKey } from '../types'

const { maxFiles = 5 } = defineProps<{ maxFiles?: number }>()
const { files, updateFiles } = inject(FilesInjectionKey)

const previews = ref<string[]>([])

const { t } = useI18n()
const fileInput = ref<HTMLInputElement>()

function handleFileSelect() {
  if (!fileInput.value)
    return
  const newFiles = [...files.value, ...(Array.from(fileInput.value.files))].slice(0, maxFiles)
  updateFiles(newFiles)
  previews.value.forEach(url => URL.revokeObjectURL(url))
  previews.value = files.value.map(file => URL.createObjectURL(file))
  fileInput.value.value = undefined
}

function removeFile(index: number) {
  files.value.splice(index, 1)
}
</script>

<template>
  <label for="attachments" :class="{ 'cursor-pointer': files.length === 0 }" group w-full>
    <div grid="~ gap-16 cols-[repeat(auto-fit,128px)]" w-full>
      <div
        v-for="(preview, index) in previews" :key="preview" stack rounded-4 size-128 aspect-square
        outline=" 1.5 neutral-200"
      >
        <img
          :src="preview" :alt="t('attachmentUploader.previewAlt', { number: index + 1 })"
          rounded-4 bg-neutral-100 h-full object-contain
        >
        <button
          type="button" :aria-label="t('attachmentUploader.deleteImageLabel')" outline="1.5 offset--1.5 white/8"
          stack rounded-full bg-white size-24 shadow self-start right--12 top--12 justify-self-end
          @click.stop="removeFile(index)"
        >
          <div i-nimiq:cross text="neutral 10" />
        </button>
      </div>

      <div flex="~ col justify-center items-center" rounded-4 size-128 aspect-square outline="1.5 neutral/15">
        <div text="24 neutral-700 group-hocus:neutral-800" transition-colors i-nimiq:mountain-frame />
        <span font-semibold mt-6>{{ t('attachmentUploader.uploadHere') }}</span>
        <span text="f-xs neutral-800" mt-2>{{ t('attachmentUploader.anyImageFormat') }}</span>
      </div>
    </div>

    <input
      id="attachments" ref="fileInput" type="file" name="attachments" accept="image/*" multiple sr-only
      @change="handleFileSelect"
    >
  </label>
</template>
