import type { WidgetEvents } from '#backend/types'

export class SimpleWidgetCommunication {
  private listeners: Partial<{
    [K in keyof WidgetEvents]: ((data: WidgetEvents[K]) => void)[]
  }> = {}

  emit<K extends keyof WidgetEvents>(event: K, data: WidgetEvents[K]): void {
    this.listeners[event]?.forEach(listener => listener(data))
  }

  on<K extends keyof WidgetEvents>(event: K, callback: (data: WidgetEvents[K]) => void): void {
    if (!this.listeners[event]) {
      this.listeners[event] = []
    }
    this.listeners[event]!.push(callback)
  }

  off<K extends keyof WidgetEvents>(event: K, callback?: (data: WidgetEvents[K]) => void): void {
    if (!callback) {
      delete this.listeners[event]
      return
    }

    const listeners = this.listeners[event]
    if (listeners) {
      const index = listeners.indexOf(callback)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }
}

export function createWidgetCommunication(): SimpleWidgetCommunication {
  return new SimpleWidgetCommunication()
}
