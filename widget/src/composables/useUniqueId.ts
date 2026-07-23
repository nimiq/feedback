let nextId = 0

export function useUniqueId(prefix: string): string {
  nextId += 1
  return `nimiq-feedback-${prefix}-${nextId}`
}
