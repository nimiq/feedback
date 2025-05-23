<script setup lang="ts">
import AttachmentUploader from './AttachmentUploader.vue'

const files = defineModel<File[]>({ default: [] })

const placeholder = 'Please, tell us how we can make your Nimiq experience better*'
</script>

<template>
  <label>
    <textarea id="description" name="description" :placeholder rows="4" required nq-input-box />
  </label>

  <AttachmentUploader :max-files="5" :files />

  <p text-neutral-800 mt--8>
    For example a screenshot of a feature from another app
  </p>
</template>
