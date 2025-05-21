<script setup lang="ts">
import AttachmentUploader from './AttachmentUploader.vue'
import FormContainer from './FormContainer.vue'

const placeholder = 'Please, tell us how we can make your Nimiq experience better*'
</script>

<template>
  <FormContainer type="idea">
    <label>
      <textarea id="description" name="description" :placeholder rows="4" required nq-input-box />
    </label>

    <AttachmentUploader :max-files="5" />

    <p text-neutral-800 mt--8>
      For example a screenshot of a feature from another app
    </p>
  </FormContainer>
</template>
