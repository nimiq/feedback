import type { InjectionKey, Ref } from 'vue'
import type { SimpleWidgetCommunication } from './utils/communication'

export const FilesInjectionKey: InjectionKey<{
  files: Ref<File[]>
  updateFiles: (files: File[]) => void
}> = Symbol('files')

export const CommunicationInjectionKey: InjectionKey<SimpleWidgetCommunication> = Symbol('communication')

export const FormValidationKey: InjectionKey<{
  description: Ref<string>
  rating: Ref<number>
}> = Symbol('form-validation')
