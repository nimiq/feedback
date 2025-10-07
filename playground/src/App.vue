<script setup lang="ts">
import { FeedbackModal } from 'nimiq-feedback-widget'
</script>

<template>
  <div flex="~ col items-center justify-center" p-8 bg-neutral-100 min-h-screen>
    <FeedbackModal
      app="playground"
      feedback-endpoint="https://nimiq-feedback.je-cf9.workers.dev/api/feedback?test=true"
      test
      :tags="['testing', 'playground']"
    />
  </div>
</template>
