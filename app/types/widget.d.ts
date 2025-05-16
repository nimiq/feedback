/// <reference types="vue/macros-global" />

declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: string
    VITE_APP_TITLE: string
  }
}

declare global {
  const __BUILD_TIME__: string

  interface Window {
    /** Mount the feedback widget into a container */
    mountFeedbackWidget: (selector: string, props?: Record<string, any>) => void
  }
}

export {}
