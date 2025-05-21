<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watchEffect } from 'vue'

const { maxFiles = 5 } = defineProps<{ maxFiles?: number }>()
const emit = defineEmits<{ 'update:files': [files: File[]] }>()

const fileInput = ref<HTMLInputElement>()

const files = ref<File[]>([])
watchEffect(() => emit('update:files', files.value))
const previews = computed(() => files.value.map(file => ({ file, url: URL.createObjectURL(file) })))

function handleFileSelect() {
  if (!fileInput.value)
    return
  const selectedFiles = Array.from(fileInput.value.files)
  const imageFiles = selectedFiles.filter(file => file.type.startsWith('image/'))
  const newFiles = [...files.value, ...imageFiles].slice(0, maxFiles)
  files.value = newFiles
  fileInput.value.value = ''
  emit('update:files', files.value)
}

function removeFile(index: number) {
  files.value.splice(index, 1)
}

onMounted(() => {
  fetchRandomImages()
})

async function fetchRandomImages() {
  try {
    ['https://picsum.photos/400/400', 'https://picsum.photos/640/360'].forEach(async (url, i) => {
      const response = await fetch(url)
      if (response.ok)
        files.value.push(new File([await response.blob()], `random-image-${i}.jpg`, { type: 'image/jpeg' }))
    })
  }
  catch (error) {
    console.error('Error fetching random images:', error)
  }
}

onMounted(async () => {
  // Uncomment to fetch random images on mount
  // await fetchRandomImages()
})

onBeforeUnmount(() => files.value = [])
</script>

<template>
  <label
    for="attachements" outline=" 1.5 offset--1.5 neutral-400 hocus:blue-500"
    :class="{ 'cursor-pointer': files.length === 0 }" group rounded-8 w-full transition-colors f-py-sm
  >
    <div grid="~ gap-16 justify-center cols-[repeat(auto-fit,128px)]" mx-auto w-full>
      <div
        v-for="(preview, index) in previews" :key="index" stack rounded-4 size-128 aspect-square
        outline=" 1.5 neutral/15"
      >
        <img :src="preview.url" :alt="`Preview ${index + 1}`" rounded-4 bg-neutral-100 object-contain>
        <button
          type="button" aria-label="Delete image" outline="1.5 offset--1.5 white/8"
          stack rounded-full bg-white size-24 shadow self-start right--12 top--12 justify-self-end @click.stop="removeFile(index)"
        >
          <div i-nimiq:cross text="neutral 10" />
        </button>
      </div>

      <div flex="~ col justify-center items-center" rounded-4 size-128 aspect-square outline="1.5 neutral/15">
        <div text="24 neutral-700 group-hocus:neutral-800" transition-colors i-nimiq:mountain-frame />
        <span font-semibold mt-6>Upload here</span>
        <span text="f-xs neutral-800" mt-2>Any image format</span>
      </div>
    </div>

    <input
      id="attachements" ref="fileInput" type="file" name="attachements" accept="image/*" multiple sr-only
      @change="handleFileSelect"
    >
  </label>
</template>
