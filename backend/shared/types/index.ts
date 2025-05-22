export type App = 'nimiq-wallet' | 'nimiq-pay' | 'playground'
export type SubmissionType = 'bug' | 'idea' | 'feedback'
// export type SubmissionStatus = 'pending' | 'approved' | 'rejected'

export interface FeedbackResponse {
  success: true
  github: {
    issueUrl: string
    issueNumber: number
  }
}

export interface FeedbackResponseError {
  success: false
  message: string
  issues?: string[]
  details?: any
}
