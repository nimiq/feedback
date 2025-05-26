export type App = 'nimiq-wallet' | 'nimiq-pay' | 'playground'
export type FormType = 'bug' | 'idea' | 'feedback'
// export type SubmissionStatus = 'pending' | 'approved' | 'rejected'

export interface FeedbackResponse {
  success: true
  github: GitHubIssue
  slack: boolean
  submission: {
    type: FormType
    app: App
    description: string
    email: string | null
    rating: number | null
    attachments: string[] | null
    id: string
    createdAt: string
    updatedAt: string
    githubIssue: string | null
  }
}

export interface FeedbackResponseError {
  success: false
  message: string
  issues?: string[]
  details?: any
}

export type Result<T> = Promise<[true, undefined, T] | [false, string, undefined]>
export type SyncResult<T> = Awaited<Result<T>>

// Widget instance that gets exposed to the host
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

// Events that the widget emits to the host
export interface WidgetEvents {
  'form-selected': FormType
  'go-back': void
  'form-submitted': { success: true, data: any }
  'form-error': { success: false, error: string, details?: any }
}

export interface WidgetProps2 {
  // Optional event listeners from the host
  onFormSelected?: (type: FormType) => void
  onGoBack?: () => void
  onFormSubmitted?: (data: { success: true, data: any }) => void
  onFormError?: (error: { success: false, error: string, details?: any }) => void
}

export interface WidgetProps {
  app: App
  lang?: string
}

export type MountFeedbackWidgetFn = (selector: string, props?: WidgetProps) => WidgetInstance
