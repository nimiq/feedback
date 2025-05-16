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
  <FormContainer type="bug">
    <div>
      <h2>BUG DESCRIPTION</h2>
      <label for="description">Please let us know what's your bug is about*</label>
      <textarea id="description" name="description" rows="4" required />
    </div>

    <div>
      <label for="attachments">Upload screenshots of bug* (max 5 files)</label>
      <input
        id="attachments"
        type="file"
        name="attachments"
        accept="image/png,image/jpeg"
        multiple
        @change="handleFileChange"
      >
      <small>PNG, JPG</small>

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

    <div>
      <h2>EMAIL</h2>
      <label for="email">If we need more information*</label>
      <input id="email" type="email" name="email">
    </div>
  </FormContainer>
</template>
