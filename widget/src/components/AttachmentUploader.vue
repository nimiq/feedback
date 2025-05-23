<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

const { maxFiles = 5 } = defineProps<{ maxFiles?: number }>()
const files = defineModel<File[]>({ default: [] })

const fileInput = ref<HTMLInputElement>()

const previews = computed(() => files.value.map(file => URL.createObjectURL(file)))

function handleFileSelect() {
  if (!fileInput.value)
    return
  const newFiles = [...files.value, ...(Array.from(fileInput.value.files))].slice(0, maxFiles)
  files.value = newFiles
  fileInput.value.value = undefined
}

function removeFile(index: number) {
  files.value.splice(index, 1)
}

onMounted(async () => {
  // Uncomment to fetch random images on mount
  await Promise.allSettled(['https://picsum.photos/400/400', 'https://picsum.photos/640/360'].map(async (url, i) => {
    await fetch(url).then(async r => files.value.push(new File([await r.blob()], `random-image-${i}.jpeg`, { type: 'image/jpeg' })))
  }))
})
</script>

<template>
  <label
    for="attachments" outline=" 1.5 offset--1.5 neutral-400 hocus:blue-500"
    :class="{ 'cursor-pointer': files.length === 0 }" group rounded-8 w-full transition-colors f-py-sm
  >
    <div grid="~ gap-16 justify-center cols-[repeat(auto-fit,128px)]" mx-auto w-full>
      <div
        v-for="(preview, index) in previews" :key="index" stack rounded-4 size-128 aspect-square
        outline=" 1.5 neutral-200"
      >
        <img
          :src="preview" :alt="$t('attachmentUploader.previewAlt', { number: index + 1 })" rounded-4 bg-neutral-100
          object-contain
        >
        <button
          type="button" :aria-label="$t('attachmentUploader.deleteImageLabel')" outline="1.5 offset--1.5 white/8"
          stack rounded-full bg-white size-24 shadow self-start right--12 top--12 justify-self-end
          @click.stop="removeFile(index)"
        >
          <div i-nimiq:cross text="neutral 10" />
        </button>
      </div>

      <div flex="~ col justify-center items-center" rounded-4 size-128 aspect-square outline="1.5 neutral/15">
        <div text="24 neutral-700 group-hocus:neutral-800" transition-colors i-nimiq:mountain-frame />
        <span font-semibold mt-6>{{ $t('attachmentUploader.uploadHere') }}</span>
        <span text="f-xs neutral-800" mt-2>{{ $t('attachmentUploader.anyImageFormat') }}</span>
      </div>
    </div>

    <input
      id="attachments" ref="fileInput" type="file" name="attachments" accept="image/*" multiple sr-only
      @change="handleFileSelect"
    >
  </label>
</template>
