import { readonly, ref } from 'vue'

export function useFilesState() {
  const files = ref<File[]>([])

  function setFiles(nextFiles: File[]) {
    files.value = nextFiles
  }

  function removeFile(index: number) {
    files.value = files.value.filter((_, currentIndex) => currentIndex !== index)
  }

  function resetFiles() {
    files.value = []
  }

  return {
    files: readonly(files),
    removeFile,
    resetFiles,
    setFiles,
  }
}
