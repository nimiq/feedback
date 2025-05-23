export type App = 'nimiq-wallet' | 'nimiq-pay' | 'playground'
export type FormType = 'bug' | 'idea' | 'feedback'
// export type SubmissionStatus = 'pending' | 'approved' | 'rejected'

export interface FeedbackResponse {
  success: true
  github: {
    issueUrl: string
    issueNumber: number
  }
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
