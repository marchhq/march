export const isLink = (value: string): boolean => {
  const trimmedValue = value.trim()

  // Updated regex to allow "abc.com", "https://abc.com", and "http://abc.com"
  const urlPattern =
    /^(https?:\/\/)?(www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(\/[^\s]*)?$/

  // Match the pattern
  return urlPattern.test(trimmedValue)
}
