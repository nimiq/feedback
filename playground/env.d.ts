/// <reference types="vite/client" />

// This specifically handles Vue component import declarations
declare module '*.vue' {
  import type { DefineComponent } from 'vue'

  const component: DefineComponent<Record<string, unknown>, Record<string, unknown>, any>
  export default component
}
