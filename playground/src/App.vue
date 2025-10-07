<script setup lang="ts">
import { FeedbackModal } from 'nimiq-feedback-widget'
</script>

<template>
  <div flex="~ col items-center justify-center" p-8 bg-neutral-100 min-h-screen>
    <h1 text-4xl text-neutral-800 font-bold mb-8>
      Feedback Widget Playground
    </h1>

    <div flex="~ col" gap-6 max-w-md w-full>
      <div p-6 rounded-lg bg-white shadow>
        <h2 text-xl font-semibold mb-4>
          Test Scenarios
        </h2>
        <ul list="disc inside" text-neutral-600 space-y-2>
          <li>Test form selection grid</li>
          <li>Submit bug report</li>
          <li>Submit idea</li>
          <li>Submit feedback with rating</li>
        </ul>
      </div>
    </div>

    <FeedbackModal
      app="playground"
      lang="en"
      feedback-endpoint="https://nimiq-feedback.je-cf9.workers.dev/api/feedback?test=true"
      :tags="['testing', 'playground']"
    />
  </div>
</template>
