export type App = 'nimiq-wallet' | 'nimiq-pay' | 'playground'
export type SubmissionType = 'bug' | 'idea' | 'feedback'
// export type SubmissionStatus = 'pending' | 'approved' | 'rejected'

export interface FeedbackResponse {
  success: true
  github: {
    issueUrl: string
    issueNumber: number
  }
  submission: {
    type: SubmissionType
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
