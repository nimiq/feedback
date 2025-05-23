import type { FormType } from '#backend/types'
import type { ComponentPublicInstance } from 'vue'
import type { WidgetInstance } from './types/communication'
import type { SimpleWidgetCommunication } from './utils/communication'
import { createApp } from 'vue'
// i18n imports
import { createI18n } from 'vue-i18n'

import FeedbackWidget from './components/FeedbackWidget.vue'
import enMessages from './locales/en.json'
import esMessages from './locales/es.json'

import 'virtual:uno.css'

// Define type for the component instance
interface FeedbackWidgetInstance extends ComponentPublicInstance {
  showFormGrid: () => void
  showForm: (type: FormType) => void
  closeWidget: () => void
  goBack: () => void
  communication: SimpleWidgetCommunication
}

// MODIFIED: Updated function signature to accept options object
window.mountFeedbackWidget = (selector: string, options: { app: string, lang: string }): WidgetInstance => {
  const el = document.querySelector(selector)
  if (!el)
    throw new Error(`Mount target ${selector} not found`)

  // Use provided options or defaults
  const appName = options?.app || 'default_app' // Default app name if not provided
  const lang = options?.lang || 'en' // Default language if not provided

  console.log(`Mounting feedback widget for app: ${appName}, lang: ${lang}`, selector)

  try {
    // i18n initialization
    const i18n = createI18n({
      legacy: false, // Use Composition API
      locale: lang, // MODIFIED: Use lang from options
      fallbackLocale: 'en',
      messages: {
        en: enMessages,
        es: esMessages,
      },
    })

    // MODIFIED: Pass appName as a prop to FeedbackWidget
    const app = createApp(FeedbackWidget, { appName }).use(i18n)
    const instance = app.mount(el) as FeedbackWidgetInstance

    // Return the widget instance that the host can control
    return {
      showFormGrid() {
        instance.showFormGrid()
      },
      showForm(type: FormType) {
        console.log('showForm', type)
        instance.showForm(type)
      },
      closeWidget() {
        instance.closeWidget()
      },
      goBack() {
        instance.goBack()
      },
      communication: instance.communication,
      destroy() {
        try {
          app.unmount()
        }
        catch (error) {
          console.error('Error destroying widget:', error)
        }
      },
    }
  }
  catch (error) {
    console.error('Error mounting feedback widget:', error)
    // Return a no-op instance to prevent errors if the host tries to call methods
    return {
      showFormGrid() { },
      showForm() { },
      closeWidget() { },
      goBack() { },
      communication: {
        on() { },
        off() { },
        emit() { },
      },
      destroy() { },
    }
  }
}
