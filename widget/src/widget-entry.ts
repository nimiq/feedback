import type { FormType } from '#backend/types'
import type { ComponentPublicInstance } from 'vue'
import type { WidgetInstance } from './types/communication'
import type { SimpleWidgetCommunication } from './utils/communication'
import { createApp } from 'vue'
import FeedbackWidget from './components/FeedbackWidget.vue'

import 'virtual:uno.css'

// Define type for the component instance
interface FeedbackWidgetInstance extends ComponentPublicInstance {
  showFormGrid: () => void
  showForm: (type: FormType) => void
  closeWidget: () => void
  goBack: () => void
  communication: SimpleWidgetCommunication
}

// Assign the function to window
window.mountFeedbackWidget = (selector: string): WidgetInstance => {
  const el = document.querySelector(selector)
  if (!el)
    throw new Error(`Mount target ${selector} not found`)

  console.log('Mounting feedback widget', selector)

  try {
    const app = createApp(FeedbackWidget)
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
