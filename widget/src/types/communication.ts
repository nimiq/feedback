import type { FormType } from '#backend/types'

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
  'formError': { success: false, error: string, details?: any }
}

export interface WidgetProps {
  // Optional event listeners from the host
  onFormSelected?: (type: FormType) => void
  onGoBack?: () => void
  onFormSubmitted?: (data: { success: true, data: any }) => void
  onFormError?: (error: { success: false, error: string, details?: any }) => void
}
