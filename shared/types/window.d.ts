export {}

declare global {
  interface Window {
    /** Mount the feedback widget into a container */
    mountFeedbackWidget?: (selector: string, props?: Record<string, any>) => void
  }
}
