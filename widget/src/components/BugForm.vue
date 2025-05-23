<script setup lang="ts">
import AttachmentUploader from './AttachmentUploader.vue'

const files = defineModel<File[]>({ default: [] })

const placeholder = 'Please, tell us how we can make your Nimiq experience better*'
</script>

<template>
  <label>
    <textarea
      id="description" name="description" :placeholder value="This is a test, awesome!" rows="4" required
      nq-input-box
    />
  </label>

  <AttachmentUploader v-model="files" :max-files="5" />

  <label>
    <h2 mb-8 text="12 neutral-800" nq-label>Email</h2>
    <input id="email" type="email" nq-input-box name="email" placeholder="If we need more information*">
  </label>
</template>
