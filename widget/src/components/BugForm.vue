<script setup lang="ts">
import AttachmentUploader from './AttachmentUploader.vue'
import FormContainer from './FormContainer.vue'

const placeholder = 'Please, tell us how we can make your Nimiq experience better*'
</script>

<template>
  <FormContainer type="bug">
    <label>
      <textarea id="description" name="description" :placeholder rows="4" required nq-input-box />
    </label>

    <AttachmentUploader :max-files="5" />

    <label>
      <h2 mb-8 text="12 neutral-800" nq-label>Email</h2>
      <input id="email" type="email" nq-input-box name="email" placeholder="If we need more information*">
    </label>
  </FormContainer>
</template>
