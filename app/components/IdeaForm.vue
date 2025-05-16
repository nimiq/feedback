<script setup lang="ts">
import { ref } from 'vue'
import FormContainer from './FormContainer.vue'

const attachments = ref<File[]>([])
const maxAttachments = 5
const attachmentError = ref('')

function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files) {
    const newFiles = Array.from(target.files)

    // Check if adding these files would exceed the limit
    if (attachments.value.length + newFiles.length > maxAttachments) {
      attachmentError.value = `You can upload a maximum of ${maxAttachments} files`
      // Reset the input to clear selection
      if (target.value)
        target.value = ''
      return
    }

    attachmentError.value = ''
    attachments.value = [...attachments.value, ...newFiles]
  }
}

function removeAttachment(index: number) {
  attachments.value = attachments.value.filter((_, i) => i !== index)
  attachmentError.value = ''
}
</script>

<template>
  <FormContainer type="idea">
    <div>
      <h2>GOT AN IDEA?</h2>
      <label>
        Tell us how we can make your Nimiq experience better*
        <textarea id="description" name="description" rows="4" required nq-text-input />
      </label>
    </div>

    <div>
      <label for="attachments">Upload idea* (max 5 files)</label>
      <input
        id="attachments"
        type="file"
        multiple
        name="attachments"
        accept="image/png,image/jpeg"
        @change="handleFileChange"
      >
      <small>PNG, JPG</small>
      <p>For example a screenshot of a feature from another app</p>

      <div v-if="attachmentError" class="error-message">
        {{ attachmentError }}
      </div>

      <div v-if="attachments.length > 0" class="attachments-list">
        <div v-for="(file, index) in attachments" :key="index" class="attachment-item">
          {{ file.name }}
          <button type="button" class="remove-button" @click="removeAttachment(index)">
            Remove
          </button>
        </div>
      </div>
    </div>
  </FormContainer>
</template>
