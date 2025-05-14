<script setup lang="ts">
const rating = ref(5)
const description = ref('')

// TODO Reset the form after submission
const { error, execute: submitFeedback, status } = await useFetch('/api/feedback', {
  method: 'POST',
  body: {
    rating,
    description,
  },
  immediate: false,
  watch: false,
})
</script>

<template>
  <div>
    <h2>Submit Feedback</h2>

    <div v-if="status === 'success'" role="alert">
      Thank you for your feedback! Your issue has been created.
    </div>

    <div v-if="status === 'error'" role="alert">
      Error: {{ error }}
    </div>

    <form @submit.prevent="() => submitFeedback()">
      <div>
        <label for="rating">Rating (0-5):</label>
        <input
          id="rating"
          v-model="rating"
          type="number"
          min="0"
          max="5"
          required
        >
      </div>

      <div>
        <label for="description">Description:</label>
        <textarea
          id="description"
          v-model="description"
          rows="4"
          required
        />
      </div>

      <button type="submit" :disabled="status === 'pending'">
        {{ status === 'pending' ? 'Submitting...' : 'Submit Feedback' }}
      </button>
    </form>
  </div>
</template>
