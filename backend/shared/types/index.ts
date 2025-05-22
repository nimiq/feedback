export type App = 'nimiq-wallet' | 'nimiq-pay'
export type SubmissionType = 'bug' | 'idea' | 'feedback'
export type SubmissionStatus = 'pending' | 'approved' | 'rejected'

export interface FeedbackResponse {
  success: true
  issueUrl?: string
  issueNumber?: number
}

export interface FeedbackResponseError {
  success: false
  message: string
  issues?: string[]
  details?: any
}
