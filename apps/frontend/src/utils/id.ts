export function extractNumericId(idString: string) {
  const match = idString.match(/\d+/) // Extract numeric part
  return match ? parseInt(match[0], 10) : null
}
