# Theming

## Dark Mode

The widget automatically adapts to the user's preferred color scheme.

### Force Dark Mode

```html
<div id="feedback-widget" style="color-scheme: dark;"></div>
```

### Force Light Mode

```html
<div id="feedback-widget" style="color-scheme: light;"></div>
```

### Programmatic Control

```javascript
window.mountFeedbackWidget('#feedback-widget', {
  app: 'my-app',
  dark: true // Enable dark mode
})
```

## CSS Customization

The widget uses scoped CSS with the `#feedback-widget` selector. All styles are scoped to prevent conflicts.

### Custom Colors

Override CSS custom properties:

```css
#feedback-widget {
  --nq-blue: #0582ca;
  --nq-light-blue: #265dd7;
  /* Add other custom properties */
}
```

### Responsive Design

The widget is responsive by default:
- **Mobile (<1280px):** Bottom sheet modal
- **Desktop (≥1280px):** Centered modal

### Widget Wrapper

```css
#feedback-widget {
  /* Modal customization */
  --modal-max-width: 500px;
  --modal-max-height: 85dvh;
}
```

## Component-Level Theming (Vue)

```vue
<template>
  <FeedbackModal
    v-model:open="open"
    app="my-app"
    dark // Force dark mode
  />
</template>
```
