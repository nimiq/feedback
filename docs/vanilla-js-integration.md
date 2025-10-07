# Vanilla JavaScript Integration

## CDN Installation

```html
<!-- CSS -->
<link rel="stylesheet" href="https://nimiq-feedback.je-cf9.workers.dev/widget.css" />

<!-- JavaScript -->
<script src="https://nimiq-feedback.je-cf9.workers.dev/widget.js" defer></script>
```

## Deferred Loading (Recommended)

```html
<!-- Preload CSS for better performance -->
<link
  rel="preload"
  href="https://nimiq-feedback.je-cf9.workers.dev/widget.css"
  as="style"
  onload="this.onload=null;this.rel='stylesheet'"
/>
<noscript><link rel="stylesheet" href="https://nimiq-feedback.je-cf9.workers.dev/widget.css" /></noscript>

<!-- Load JavaScript deferred -->
<script src="https://nimiq-feedback.je-cf9.workers.dev/widget.js" defer></script>
```

## Usage

```html
<div id="feedback-widget"></div>

<script>
  document.addEventListener('DOMContentLoaded', () => {
    const widget = window.mountFeedbackWidget('#feedback-widget', {
      app: 'my-app',
      lang: 'en',
      feedbackEndpoint: 'https://api.example.com/feedback',
      tags: ['production'],
      initialForm: 'bug', // Optional: show specific form
      dark: false // Optional: dark mode
    })

    // Widget methods
    widget.showFormGrid() // Show form selection
    widget.showForm('feedback') // Show specific form
    widget.closeWidget() // Close widget
    widget.goBack() // Navigate back
    widget.destroy() // Cleanup
  })
</script>
```

## TypeScript Declarations

```typescript
// env.d.ts
export type FormType = 'bug' | 'idea' | 'feedback'

export interface WidgetProps {
  app: string
  lang?: string
  feedbackEndpoint?: string
  tags?: string[]
  initialForm?: FormType
  dark?: boolean
}

export interface WidgetInstance {
  showFormGrid: () => void
  showForm: (type: FormType) => void
  closeWidget: () => void
  goBack: () => void
  destroy: () => void
  communication?: {
    on: <K extends keyof WidgetEvents>(event: K, callback: (data: WidgetEvents[K]) => void) => void
    off: <K extends keyof WidgetEvents>(event: K, callback?: (data: WidgetEvents[K]) => void) => void
  }
}

declare global {
  interface Window {
    mountFeedbackWidget: (selector: string, props: WidgetProps) => WidgetInstance
  }
}
```
