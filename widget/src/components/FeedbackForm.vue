<script setup lang="ts">
import { defineModel } from 'vue'
import FormContainer from './FormContainer.vue'

const placeholder = 'Please, tell us how we can make your Nimiq experience better*'
const rating = defineModel<number>()
</script>

<template>
  <FormContainer type="feedback">
    <div flex="~ items-center gap-24 justify-center" outline="[&:has(:focus-visible)]:1.5 blue" mx-auto rounded-4 w-max f-p-sm>
      <template v-for="i in 5" :key="i">
        <input :id="`rating-${i}`" v-model="rating" type="radio" name="rating" :value="i" sr-only>
        <label :for="`rating-${i}`" :data-state="i <= rating ? 'active' : undefined" text="neutral-300 reka-active:gold hocus:gold [&:has(~_label:hover)]:gold" size-40 cursor-pointer transition-colors i-nimiq:star />
      </template>
    </div>

    <label f-mt-sm>
      <textarea id="description" name="description" :placeholder="placeholder" rows="4" required nq-input-box />
    </label>
  </FormContainer>
</template>
