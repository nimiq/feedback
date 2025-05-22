export function ratingToEmoji(rating: number = 0): string {
  const filled = '🟡'
  const empty = '⚪'
  const filledStr = Array.from({ length: rating }).fill(filled).join('')
  const emptyStr = Array.from({ length: 5 - rating }).fill(empty).join('')
  return `${filledStr}${emptyStr} ${rating}/5`
}
