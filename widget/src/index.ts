// Main entry point for nimiq-feedback-widget library
export { default as FeedbackWidget } from './components/FeedbackWidget.vue'
export { default as FeedbackModal } from './components/FeedbackModal.vue'

// Re-export types from shared backend types
export type {
  FormType,
  WidgetProps,
  WidgetInstance,
  WidgetEvents,
  FeedbackResponse,
  FeedbackResponseError,
  MountFeedbackWidgetFn,
} from '#backend/types'
