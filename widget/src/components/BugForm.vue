<script setup lang="ts">
import { ref } from 'vue'
import AttachmentUploader from './AttachmentUploader.vue'
import FormContainer from './FormContainer.vue'

const files = ref<File[]>([])

const placeholder = 'Please, tell us how we can make your Nimiq experience better*'
</script>

<template>
  <FormContainer type="bug" :files>
    <label>
      <textarea id="description" name="description" :placeholder value="This is a test, awesome!" rows="4" required nq-input-box />
    </label>

    <AttachmentUploader v-model="files" :max-files="5" />

    <label>
      <h2 mb-8 text="12 neutral-800" nq-label>Email</h2>
      <input id="email" type="email" nq-input-box name="email" placeholder="If we need more information*">
    </label>
  </FormContainer>
</template>
