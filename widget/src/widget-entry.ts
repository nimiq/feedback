import type { FormType, WidgetInstance, WidgetProps } from '#backend/types'
import type { ComponentPublicInstance } from 'vue'
import type { I18nContext } from './locales/types'
import type { SimpleWidgetCommunication } from './utils/communication'

import { createApp } from 'vue'
import FeedbackWidget from './components/FeedbackWidget.vue'
import { useFilesState } from './composables/useFilesState'
import { localeMessages } from './locales'
import { I18nInjectionKey } from './locales/types'
import { FilesInjectionKey } from './types'
import { createTranslationFunction } from './utils/i18n'
import './styles/widget.css'

const DEFAULT_FEEDBACK_ENDPOINT = '/api/feedback'

interface FeedbackWidgetInstance extends ComponentPublicInstance {
  showFormGrid: () => void
  showForm: (type: FormType) => void
  closeWidget: () => void
  goBack: () => void
  communication: SimpleWidgetCommunication
}

function createNoopWidgetInstance(): WidgetInstance {
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

window.mountFeedbackWidget = (selector: string, props?: WidgetProps): WidgetInstance => {
  const {
    app,
    lang = 'en',
    feedbackEndpoint = DEFAULT_FEEDBACK_ENDPOINT,
    tags = [],
    initialForm,
    dark = false,
  } = props ?? {}

  if (!app) {
    console.error('Error mounting feedback widget: missing required "app" option')
    return createNoopWidgetInstance()
  }

  const el = document.querySelector(selector)
  if (!el)
    throw new Error(`Mount target ${selector} not found`)

  // eslint-disable-next-line no-console
  console.log(`Mounting feedback widget for app: ${app}, lang: ${lang}, tags: ${tags}`, selector)

  try {
    const localeKey = lang in localeMessages ? lang as keyof typeof localeMessages : 'en'
    const currentMessages = localeMessages[localeKey]
    const i18nContext: I18nContext = {
      locale: localeKey,
      messages: currentMessages,
      t: createTranslationFunction(currentMessages),
    }

    const filesState = useFilesState()
    const vueApp = createApp(FeedbackWidget, { app, feedbackEndpoint, tags, initialForm, dark })
      .provide(I18nInjectionKey, i18nContext)
      .provide(FilesInjectionKey, filesState)
    const instance = vueApp.mount(el) as FeedbackWidgetInstance

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
    return createNoopWidgetInstance()
  }
}
