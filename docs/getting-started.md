# Getting Started

## Installation

### For Vue 3 Applications

```bash
npm install @nimiq/feedback-widget
# or
pnpm add @nimiq/feedback-widget
# or
yarn add @nimiq/feedback-widget
```

### For Vanilla JavaScript / HTML

Include the widget via CDN:

```html
<script src="https://nimiq-feedback.je-cf9.workers.dev/widget.js" defer></script>
<link rel="stylesheet" href="https://nimiq-feedback.je-cf9.workers.dev/widget.css" />
```

## Quick Start

### Vue 3

```vue
<script setup>
import { FeedbackModal } from '@nimiq/feedback-widget'
import '@nimiq/feedback-widget/style.css'
import { ref } from 'vue'

const open = ref(false)
</script>

<template>
  <button @click="open = true">Give Feedback</button>

  <FeedbackModal
    v-model:open="open"
    app="my-app"
    feedback-endpoint="https://your-api.com/feedback"
  />
</template>
```

### Vanilla JavaScript

```html
<div id="feedback-widget"></div>

<script>
  document.addEventListener('DOMContentLoaded', () => {
    const widget = window.mountFeedbackWidget('#feedback-widget', {
      app: 'my-app',
      feedbackEndpoint: 'https://your-api.com/feedback'
    })
  })
</script>
```

## Next Steps

- [Vue Integration Guide](./vue-integration.md)
- [Vanilla JS Integration Guide](./vanilla-js-integration.md)
- [API Reference](./api-reference.md)
