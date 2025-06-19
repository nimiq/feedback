<script setup lang="ts">
import { inject, ref, watch } from 'vue'
import { useI18n } from '../composables/useI18n'
import { FilesInjectionKey } from '../types'

const { maxFiles = 5 } = defineProps<{ maxFiles?: number }>()
const { files, updateFiles } = inject(FilesInjectionKey)

const previews = ref<string[]>([])
const imageAspectRatios = ref<number[]>([])

const { t } = useI18n()
const fileInput = ref<HTMLInputElement>()

// Watch for external changes to files (like when going back) and clean up previews
watch(files, (newFiles) => {
  if (newFiles.length === 0) {
    // Clean up all preview URLs when files are cleared
    previews.value.forEach(url => URL.revokeObjectURL(url))
    previews.value = []
    imageAspectRatios.value = []
  }
}, { deep: true })

function handleFileSelect() {
  if (!fileInput.value)
    return
  const newFiles = [...files.value, ...(Array.from(fileInput.value.files))].slice(0, maxFiles)
  updateFiles(newFiles)
  previews.value.forEach(url => URL.revokeObjectURL(url))

  // Create previews and calculate aspect ratios
  previews.value = []
  imageAspectRatios.value = []

  files.value.forEach((file, index) => {
    const url = URL.createObjectURL(file)
    previews.value.push(url)

    // Load image to get dimensions
    const img = new Image()
    img.onload = () => {
      const aspectRatio = img.width / img.height
      imageAspectRatios.value[index] = aspectRatio
    }
    img.src = url
  })

  fileInput.value.value = undefined
}

function removeFile(index: number) {
  URL.revokeObjectURL(previews.value[index])
  files.value.splice(index, 1)
  previews.value.splice(index, 1)
  imageAspectRatios.value.splice(index, 1)
}
</script>

<template>
  <label for="attachments" :class="{ 'cursor-pointer': files.length === 0 }" group w-full>
    <h3 mb-8 text="12 neutral-800" nq-label>{{ t('attachmentUploader.title') }}</h3>

    <div grid="~ gap-16 cols-[repeat(auto-fit,128px)]" w-full>
      <div
        v-for="(preview, index) in previews" :key="preview"
        class="stack outline-1.5 outline-neutral-200 rounded-4 size-128" :class="[
          imageAspectRatios[index] < 1 ? '' : 'aspect-square',
        ]"
        :style="imageAspectRatios[index] < 1 ? { aspectRatio: imageAspectRatios[index] } : {}"
      >
        <img
          :src="preview" :alt="t('attachmentUploader.previewAlt', { number: index + 1 })"
          rounded-4 bg-neutral-100 h-full object-contain
        >
        <button
          type="button" :aria-label="t('attachmentUploader.deleteImageLabel')" outline="1.5 offset--1.5 white/8"
          stack rounded-full bg-white size-24 shadow self-start right--12 top--12 justify-self-end
          @click.stop.capture="removeFile(index)"
        >
          <div i-nimiq:cross text="neutral 10" />
        </button>
      </div>

      <div
        v-if="files.length < maxFiles"
        flex="~ col justify-center items-center" rounded-4 size-128 aspect-square outline="1.5 neutral/15"
      >
        <div text="24 neutral-700 group-hocus:neutral-800" transition-colors i-nimiq:mountain-frame />
        <span font-semibold mt-6>{{ t('attachmentUploader.uploadHere') }}</span>
        <span text="f-xs neutral-800 center" mt-2 px-2>{{ t('attachmentUploader.anyImageFormat') }}</span>
      </div>
    </div>

    <input
      id="attachments" ref="fileInput" type="file" name="attachments" accept="image/*" multiple sr-only
      @change="handleFileSelect"
    >
  </label>
</template>
