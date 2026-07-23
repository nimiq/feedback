<h1 align="center">
  <img alt="Nimiq Feedback logo" loading="lazy" width="108" height="96" decoding="async" data-nimg="1" style="color:transparent" src="https://raw.githubusercontent.com/onmax/nimiq-feedback/refs/heads/main/.github/logo.svg" />
  </br>
  Nimiq Feedback</h1>
<p align="center">
A customizable feedback widget for web apps that allows users to submit bug reports, ideas, and general feedback.
</p>
<br/>

## Quick Start

### 1. Import the JavaScript and CSS (not recommended for production)

Add the widget script to your HTML:

```html
<script src="https://nimiq-feedback.je-cf9.workers.dev/widget.js" defer></script>
```

Add the widget styles to your HTML:

```html
<link rel="stylesheet" href="https://nimiq-feedback.je-cf9.workers.dev/widget.css" />
```

### 2. Deferred Loading (Recommended)

For better performance, load both CSS and JS with deferred loading:

```html
<!-- Preload for better performance -->
<link
  rel="preload"
  href="https://nimiq-feedback.je-cf9.workers.dev/widget.css"
  as="style"
  onload="
    this.onload = null
    this.rel = 'stylesheet'
  "
/>
<noscript><link rel="stylesheet" href="https://nimiq-feedback.je-cf9.workers.dev/widget.css" /></noscript>

<!-- Load JavaScript deferred -->
<script src="https://nimiq-feedback.je-cf9.workers.dev/widget.js" defer></script>
```

### 3. Mount the Widget

Mount the widget to any DOM element:

```html
<div id="feedback-widget"></div>

<script>
  document.addEventListener('DOMContentLoaded', () => {
    const widget = window.mountFeedbackWidget('#feedback-widget', {
      app: 'nimiq-wallet', // 'nimiq-wallet' | 'nimiq-pay' | 'playground'
      lang: 'en', // 'en' | 'es' (optional, defaults to 'en')
      feedbackEndpoint: 'https://nimiq-feedback.je-cf9.workers.dev/api/feedback', // optional, defaults to '/api/feedback' on the current origin
      tags: ['beta', 'mobile'], // string[] (optional, defaults to []) - custom tags for submissions
      initialForm: 'bug', // optional - directly show a specific form: 'bug' | 'idea' | 'feedback'
      dark: false, // boolean (optional, defaults to false) - enables dark theme
    })

    // Use widget methods
    widget.showFormGrid() // Show the form selection grid
    // widget.showForm('bug'); // Show specific form: 'bug' | 'idea' | 'feedback'
    // widget.closeWidget(); // Close the widget
    // widget.goBack(); // Go back to form grid
    // widget.destroy(); // Cleanup and unmount
  })
</script>
```

### 4. TypeScript Support

Add these type declarations to your Vue 3 project (e.g., in `env.d.ts` or `types.d.ts`):

```typescript
// widget.types.d.ts

export type FormType = 'bug' | 'idea' | 'feedback'

export interface WidgetProps {
  app: string
  lang?: string
  feedbackEndpoint?: string
  tags?: string[]
  initialForm?: FormType
  dark?: boolean
}

export interface WidgetEvents {
  'form-selected': FormType
  'go-back': void
  'form-submitted': { success: true, data: any }
  'form-error': { success: false, error: string, details?: any }
  'before-submit': { formData: FormData, type: FormType, app: string }
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
    emit: <K extends keyof WidgetEvents>(event: K, data: WidgetEvents[K]) => void
  }
}

declare global {
  interface Window {
    mountFeedbackWidget: MountFeedbackWidgetFn
  }
}

export type MountFeedbackWidgetFn = (selector: string, props: WidgetProps) => WidgetInstance

export {}
```

> Make sure to include the type declarations in your TypeScript configuration so they are recognized globally.
>
> `feedbackEndpoint` defaults to `/api/feedback` on the current origin. If the widget is embedded from another domain, pass the full backend URL explicitly.

## Advanced Usage

### Event Handling

Listen to widget events using the communication API:

```typescript
const widget = window.mountFeedbackWidget('#feedback-widget', {
  app: 'nimiq-wallet'
})

// Listen to events
widget.communication?.on('form-selected', (formType) => {
  console.log('Form selected:', formType)
})

widget.communication?.on('form-submitted', (data) => {
  console.log('Form submitted successfully:', data)
})

widget.communication?.on('form-error', (error) => {
  console.error('Form submission error:', error)
})

widget.communication?.on('before-submit', ({ formData, type, app }) => {
  console.log('Before form submission:', { type, app })
  // You can modify formData here to add additional data like debug logs
  formData.append('debugInfo', JSON.stringify({ userAgent: navigator.userAgent }))
})
```

### Custom Metadata

Attach custom JSON metadata to submissions via the `meta` field. Metadata is stored in the database and included in GitHub issues.

```typescript
widget.communication?.on('before-submit', ({ formData }) => {
  formData.append('meta', JSON.stringify({
    path: window.location.href,
    screenSize: { width: window.innerWidth, height: window.innerHeight },
  }))
})
```

### Programmatic Control

```typescript
// Show specific form directly
widget.showForm('bug')

// Show form selection grid
widget.showFormGrid()

// Close the widget
widget.closeWidget()

// Navigate back to form grid
widget.goBack()

// Clean up when done
widget.destroy()
```

### Linear Issue Creation

The backend can also create Linear issues through the official [`@linear/sdk`](https://linear.app/docs/sdk/getting-started). The connector is opt-in and is controlled through query parameters on `feedbackEndpoint`.

Configure one or more Linear workspaces on the backend:

```bash
NUXT_LINEAR_DEFAULT_WORKSPACE=product
NUXT_LINEAR_WORKSPACES='{
  "product": {
    "apiKey": "lin_api_xxx",
    "team": "ENG",
    "labels": ["customer-feedback"]
  }
}'
```

Then point the widget at an endpoint that includes the Linear options you want:

```html
<script>
  window.mountFeedbackWidget('#feedback-widget', {
    app: 'nimiq-wallet',
    feedbackEndpoint:
      'https://nimiq-feedback.je-cf9.workers.dev/api/feedback?linearWorkspace=product&linearTeam=ENG&linearLabels=customer-feedback,triage&linearTitle=Wallet%20feedback',
  })
</script>
```

Supported query parameters:

- `linearWorkspace`: selects one configured backend workspace
- `linearTeam`: required unless the workspace config already defines a default team
- `linearProject`: optional project selector
- `linearState`: optional workflow state selector
- `linearAssignee`: optional assignee selector
- `linearLabels`: comma-separated list of labels
- `linearTitle`: custom issue title
- `linearPriority`: integer priority from `0` to `4`

Selectors can use IDs, and for most resources they can also use the human-readable values exposed by Linear such as team keys, label names, project names, state names, or assignee emails.

### Theming

The widget automatically adapts to the user's preferred color scheme (light/dark mode). In dark mode, the widget will use lighter colors for text and darker colors for input elements. This behavior is controlled by the `color-scheme` CSS property.

You can override the color scheme for a specific instance of the widget by setting the `color-scheme` CSS property on the widget's container:

```css
#feedback-widget {
  color-scheme: light; /* Force light mode */
  /* or */
  color-scheme: dark; /* Force dark mode */
}
```

By default, the widget will respect the user's system preferences and switch automatically between light and dark mode.

## Development

Use Node.js 22 and pnpm 10.34.5:

```bash
corepack enable
pnpm install --frozen-lockfile
pnpm validate
pnpm build
```

To update dependencies, run `pnpm outdated --compatible`, update the workspace catalogs, then regenerate and verify `pnpm-lock.yaml` with `pnpm install`. Major upgrades are handled separately.

Copy `backend/.env.example` to `backend/.env` for local Nuxt development. After a build, preview the Worker locally with:

```bash
pnpm -C backend worker:dev
```

The preview reads `backend/.env`. Production variables and secrets are configured in Cloudflare and are not copied into local files.

## Cloudflare deployment

Production runs on the existing `nimiq-feedback` Worker at `https://nimiq-feedback.je-cf9.workers.dev`. The checked-in [Wrangler configuration](backend/wrangler.json) preserves the current storage:

| Binding | Resource                                                    |
| ------- | ----------------------------------------------------------- |
| `DB`    | Existing D1 database `170f7e79-6cdb-43ac-8071-ad4432f57184` |
| `CACHE` | Existing KV namespace `0204cdae96eb471da05c251fbf8110bb`    |
| `BLOB`  | Existing R2 bucket `nimiq-feedback`                         |

Connect the existing Worker to `nimiq/feedback` in Workers Builds. Do not create a new Worker or storage resource. Use these build settings:

- Root directory: `backend`
- Production branch: `main`
- Non-production builds: disabled
- Build variable: `NODE_VERSION=22`
- Build command: `pnpm -C .. validate && pnpm -C .. build`
- Deploy command: `pnpm deploy`

Keep these runtime variables in the Worker settings:

- `NUXT_GITHUB_OWNER`
- `NUXT_GITHUB_REPO`
- `NUXT_PRODUCTION_URL`
- `NUXT_LINEAR_DEFAULT_WORKSPACE`, when used

Keep these secrets in the Worker settings:

- `NUXT_GITHUB_TOKEN`
- `NUXT_SLACK_WEBHOOK_URL`
- `NUXT_LINEAR_WORKSPACES`

`keep_vars` is enabled so Wrangler deploys retain dashboard-managed variables and secrets.

Before the first Cloudflare build, export the existing D1 database and record the current state:

```bash
pnpm -C backend exec wrangler d1 export DB --remote --output <backup-path>
pnpm -C backend exec wrangler d1 execute DB --remote --command "SELECT COUNT(*) AS submissions FROM submissions;"
pnpm -C backend exec wrangler d1 execute DB --remote --command "SELECT * FROM _hub_migrations ORDER BY id;"
pnpm -C backend exec wrangler d1 execute DB --remote --command "SELECT attachments FROM submissions WHERE attachments IS NOT NULL ORDER BY createdAt DESC LIMIT 1;"
```

Record the D1, KV, and R2 identifiers from `backend/wrangler.json`, plus one attachment URL from the last query. After deployment, verify `/`, `/widget.js`, and `/widget.css`; submit an invalid payload; confirm the submission count is unchanged; load the recorded attachment; and check Worker logs for binding, startup, or migration errors. Migration `0004_ancient_violations.sql` is additive and must apply only once.

If smoke tests fail, roll back to the previous Worker version in Cloudflare. The D1 migration remains compatible with the previous version.

## Other resources

- https://www.featurebase.app/
