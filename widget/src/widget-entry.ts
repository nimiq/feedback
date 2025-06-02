import type { FormType, WidgetInstance, WidgetProps } from '#backend/types'
import type { ComponentPublicInstance } from 'vue'
import type { I18nContext } from './locales/types'
import type { SimpleWidgetCommunication } from './utils/communication'

import { createApp } from 'vue'
import FeedbackWidget from './components/FeedbackWidget.vue'
import enMessages from './locales/en.json'

import esMessages from './locales/es.json'
import { I18nInjectionKey } from './locales/types'
import { createTranslationFunction } from './utils/i18n'
import 'virtual:uno.css'

// Define type for the component instance
interface FeedbackWidgetInstance extends ComponentPublicInstance {
  showFormGrid: () => void
  showForm: (type: FormType) => void
  closeWidget: () => void
  goBack: () => void
  communication: SimpleWidgetCommunication
}

window.mountFeedbackWidget = (selector: string, { app, lang = 'en', feedbackEndpoint }: WidgetProps): WidgetInstance => {
  const el = document.querySelector(selector)
  if (!el)
    throw new Error(`Mount target ${selector} not found`)

  // eslint-disable-next-line no-console
  console.log(`Mounting feedback widget for app: ${app}, lang: ${lang}`, selector)

  try {
    // Default locale setup
    const defaultLocale = 'en'
    const localeMessages = {
      en: enMessages,
      es: esMessages,
    }

    const currentMessages = localeMessages[defaultLocale]
    const i18nContext: I18nContext = {
      locale: defaultLocale,
      messages: currentMessages,
      t: createTranslationFunction(currentMessages),
    }

    const vueApp = createApp(FeedbackWidget, { app, feedbackEndpoint })
    vueApp.provide(I18nInjectionKey, i18nContext).mount('#app')
    const instance = vueApp.mount(el) as FeedbackWidgetInstance

    // Return the widget instance that the host can control
    return {
      showFormGrid() {
        instance.showFormGrid()
      },
      showForm(type: FormType) {
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
          vueApp.unmount()
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
