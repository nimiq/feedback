<script setup lang="ts">
import { FeedbackModal } from 'nimiq-feedback-widget'
import 'nimiq-feedback-widget/style.css'

const { lang = 'en', feedbackEndpoint = '/api/feedback', tags = [] } = defineProps<{
  lang?: string
  feedbackEndpoint?: string
  tags?: string[]
}>()
</script>

<template>
  <FeedbackModal
    app="playground"
    :lang
    :feedback-endpoint
    :tags
  />
</template>
