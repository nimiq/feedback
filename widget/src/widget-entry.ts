import { createApp } from 'vue'
import Modal from './components/Modal.vue'

import 'virtual:uno.css'

window.mountFeedbackWidget = (selector: string, props = {}) => {
  const el = document.querySelector(selector)
  if (!el)
    throw new Error(`Mount target ${selector} not found`)
  // eslint-disable-next-line no-console
  console.log('Mounting feedback widget', selector, props)
  createApp(Modal, props).mount(el)
}
