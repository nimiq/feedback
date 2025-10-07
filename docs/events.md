# Event Handling

## Communication API

Listen to widget events using the communication API:

```typescript
const widget = window.mountFeedbackWidget('#feedback-widget', {
  app: 'my-app'
})

// Listen to events
widget.communication?.on('form-selected', (formType) => {
  console.log('Form selected:', formType)
})

widget.communication?.on('form-submitted', (data) => {
  console.log('Success:', data)
})

widget.communication?.on('form-error', (error) => {
  console.error('Error:', error)
})

widget.communication?.on('before-submit', ({ formData, type, app }) => {
  // Modify formData before submission
  formData.append('debugInfo', JSON.stringify({ userAgent: navigator.userAgent }))
})
```

## Available Events

### `form-selected`

Emitted when user selects a form type.

**Data:** `FormType` (`'bug' | 'idea' | 'feedback'`)

### `go-back`

Emitted when user navigates back to form grid.

**Data:** `void`

### `form-submitted`

Emitted when form submission succeeds.

**Data:** `{ success: true, data: any }`

### `form-error`

Emitted when form submission fails.

**Data:** `{ success: false, error: string, details?: any }`

### `before-submit`

Emitted before form submission. Use to modify FormData.

**Data:** `{ formData: FormData, type: FormType, app: string }`

## Custom Metadata

Attach custom JSON metadata via the `meta` field:

```typescript
widget.communication?.on('before-submit', ({ formData }) => {
  formData.append('meta', JSON.stringify({
    path: window.location.href,
    screenSize: { width: window.innerWidth, height: window.innerHeight }
  }))
})
```

Metadata is stored in the database and included in GitHub issues.

## Removing Listeners

```typescript
const handler = (data) => console.log(data)

// Add listener
widget.communication?.on('form-submitted', handler)

// Remove specific listener
widget.communication?.off('form-submitted', handler)

// Remove all listeners for an event
widget.communication?.off('form-submitted')
```
