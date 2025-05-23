/// <reference types="vite/client" />

// This specifically handles Vue component import declarations
declare module '*.vue' {
  import type { DefineComponent } from 'vue'

  const component: DefineComponent<Record<string, unknown>, Record<string, unknown>, any>
  export default component
}

// Widget types
export type FormType = 'bug' | 'idea' | 'feedback'

export interface WidgetInstance {
  showFormGrid: () => void
  showForm: (type: FormType) => void
  closeWidget: () => void
  goBack: () => void
  destroy: () => void
  communication?: {
    on: <K extends string>(event: K, callback: (data: any) => void) => void
    off: <K extends string>(event: K, callback?: (data: any) => void) => void
    emit: <K extends string>(event: K, data: any) => void
  }
}

declare global {
  interface Window {
    /** Mount the feedback widget into a container */
    mountFeedbackWidget: (
      selector: string,
      options: { app: string, lang: string }
    ) => WidgetInstance
  }
}

export { } // Add this to ensure it's a module
