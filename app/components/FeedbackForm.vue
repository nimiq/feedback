<script setup lang="ts">
import FormContainer from './FormContainer.vue'
</script>

<template>
  <h2>Feedback</h2>
  <FormContainer type="feedback">
    <div>
      <label for="rating">Rating (0-5):</label>
      <input id="rating" type="number" name="rating" min="0" max="5" required>
    </div>

    <div>
      <label for="description">Description:</label>
      <textarea id="description" name="description" rows="4" required />
    </div>
  </FormContainer>
</template>
