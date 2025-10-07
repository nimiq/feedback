# API Reference

## WidgetProps

Configuration options for the feedback widget.

```typescript
interface WidgetProps {
  app: string              // Required: Application identifier
  lang?: string            // Optional: Language code (en, es, de, fr, pt)
  feedbackEndpoint?: string // Optional: API endpoint URL
  tags?: string[]          // Optional: Custom tags for submissions
  initialForm?: FormType   // Optional: Initial form to display
  dark?: boolean           // Optional: Enable dark mode
}
```

## WidgetInstance

Methods available on the mounted widget instance.

```typescript
interface WidgetInstance {
  showFormGrid(): void     // Show form selection grid
  showForm(type: FormType): void  // Show specific form
  closeWidget(): void      // Close the widget
  goBack(): void           // Navigate back to grid
  destroy(): void          // Unmount and cleanup
  communication?: SimpleWidgetCommunication
}
```

## FormType

```typescript
type FormType = 'bug' | 'idea' | 'feedback'
```

## Events (Communication API)

### Event Types

```typescript
interface WidgetEvents {
  'form-selected': FormType
  'go-back': void
  'form-submitted': { success: true, data: any }
  'form-error': { success: false, error: string, details?: any }
  'before-submit': { formData: FormData, type: FormType, app: string }
}
```

### Usage

```javascript
widget.communication?.on('form-submitted', (data) => {
  console.log('Success:', data)
})

widget.communication?.on('form-error', (error) => {
  console.error('Error:', error)
})

widget.communication?.off('form-submitted')
```

## Testing Mode

Add `?test=true` to the feedback endpoint to test without creating real submissions:

```javascript
{
  feedbackEndpoint: 'https://api.example.com/feedback?test=true'
}
```

In test mode:
- ✅ Form validation runs
- ✅ Events are triggered
- ✅ Mock responses returned
- ❌ No database entries
- ❌ No GitHub issues
- ❌ No Slack messages
