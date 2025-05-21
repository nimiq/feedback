/// <reference types="vite/client" />

// This specifically handles Vue component import declarations
declare module '*.vue' {
  import type { DefineComponent } from 'vue'

  const component: DefineComponent<Record<string, unknown>, Record<string, unknown>, any>
  export default component
}

declare global {
  interface Window {
    /** Mount the feedback widget into a container */
    mountFeedbackWidget: (selector: string, props?: Record<string, any>) => void
  }
}

export {} // Add this to ensure it's a module
