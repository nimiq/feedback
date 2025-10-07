<h1 align="center">
  <img alt="Nimiq Feedback logo" loading="lazy" width="108" height="96" decoding="async" src="https://raw.githubusercontent.com/onmax/nimiq-feedback/refs/heads/main/.github/logo.svg" />
  <br/>
  Nimiq Feedback
</h1>

<p align="center">A customizable feedback widget for web apps that allows users to submit bug reports, ideas, and general feedback.</p>

<br/>

## Features

- 🎨 **Multiple Integration Options**: Vue 3 component library or vanilla JavaScript
- 📝 **Three Feedback Types**: Bug reports, ideas, and general feedback
- 🌍 **Internationalization**: Support for EN, ES, DE, FR, PT
- 🎯 **Customizable**: Tags, themes, and event hooks
- 📱 **Responsive**: Works on mobile and desktop
- 🌙 **Dark Mode**: Automatic or forced theme support

## Quick Start

### Vue 3

```bash
pnpm add @nimiq/feedback-widget
```

```vue
<script setup>
import { FeedbackModal } from '@nimiq/feedback-widget'
import '@nimiq/feedback-widget/style.css'
import { ref } from 'vue'

const open = ref(false)
</script>

<template>
  <button @click="open = true">Give Feedback</button>
  <FeedbackModal v-model:open="open" app="my-app" />
</template>
```

### Vanilla JavaScript

```html
<script src="https://nimiq-feedback.je-cf9.workers.dev/widget.js" defer></script>
<link rel="stylesheet" href="https://nimiq-feedback.je-cf9.workers.dev/widget.css" />

<div id="feedback-widget"></div>

<script>
  window.mountFeedbackWidget('#feedback-widget', {
    app: 'my-app'
  })
</script>
```

## Documentation

- 📚 [Getting Started](./docs/getting-started.md)
- 🎯 [Vue Integration](./docs/vue-integration.md)
- 🔧 [Vanilla JS Integration](./docs/vanilla-js-integration.md)
- 📖 [API Reference](./docs/api-reference.md)
- 🎪 [Event Handling](./docs/events.md)
- 🎨 [Theming](./docs/theming.md)

## Development

```bash
# Install dependencies
pnpm install

# Build widget library
pnpm -C widget build:lib

# Build UMD bundle
pnpm -C widget build:umd

# Run playground
pnpm -C playground dev

# Run tests
pnpm -C playground test:e2e
```

## License

MIT
