# Vue Integration

## Installation

```bash
pnpm add @nimiq/feedback-widget
```

## FeedbackModal Component

The `FeedbackModal` component provides a complete feedback solution with modal UI.

### Basic Usage

```vue
<script setup lang="ts">
import { FeedbackModal } from '@nimiq/feedback-widget'
import '@nimiq/feedback-widget/style.css'
import { ref } from 'vue'

const feedbackOpen = ref(false)
</script>

<template>
  <button @click="feedbackOpen = true">Feedback</button>

  <FeedbackModal
    v-model:open="feedbackOpen"
    app="my-app"
    lang="en"
    feedback-endpoint="https://api.example.com/feedback"
    :tags="['production']"
  />
</template>
```

### Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `app` | `string` | Yes | - | Application identifier |
| `open` | `boolean` | No | `false` | Modal open state (v-model) |
| `lang` | `string` | No | `'en'` | Language (`'en' \| 'es' \| 'de' \| 'fr' \| 'pt'`) |
| `feedbackEndpoint` | `string` | No | - | API endpoint for submissions |
| `tags` | `string[]` | No | `[]` | Custom tags |
| `initialForm` | `FormType` | No | - | Show specific form (`'bug' \| 'idea' \| 'feedback'`) |
| `dark` | `boolean` | No | `false` | Enable dark mode |

### TypeScript

```typescript
import type { FormType, WidgetProps } from '@nimiq/feedback-widget'

const props: WidgetProps = {
  app: 'my-app',
  lang: 'en'
}
```

## FeedbackWidget Component

For more control, use the base `FeedbackWidget` component without modal wrapper:

```vue
<script setup lang="ts">
import { FeedbackWidget } from '@nimiq/feedback-widget'
</script>

<template>
  <div class="feedback-container">
    <FeedbackWidget
      app="my-app"
      feedback-endpoint="/api/feedback"
    />
  </div>
</template>
```
