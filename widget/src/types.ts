import type { InjectionKey, Ref } from 'vue'

export const FilesInjectionKey: InjectionKey<{
  files: Ref<File[]>
  updateFiles: (files: File[]) => void
}> = Symbol('files')
