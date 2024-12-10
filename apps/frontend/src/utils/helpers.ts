export const isLink = (value: string): boolean => {
  const trimmedValue = value.trim()

  // Updated regex to allow "abc.com", "https://abc.com", and "http://abc.com"
  const urlPattern =
    /^(https?:\/\/)?(www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(\/[^\s]*)?$/

  // Match the pattern
  return urlPattern.test(trimmedValue)
}

// Function to truncate a string to a given lengtht and add ... if string is bigger then givven length
export function truncateString(input: string, maxLength: number): string {
  if (input?.length > maxLength) {
    return input.slice(0, maxLength) + "..."
  }
  return input
}

export const extractParagraphs = (htmlString) => {
  const parser = new DOMParser()
  const doc = parser.parseFromString(htmlString, "text/html")

  // Get all <p> tags
  const paragraphs = doc.querySelectorAll("p")

  // Join the text content of all <p> tags
  return Array.from(paragraphs)
    .map((p) => p.textContent) // Extract text content of each <p> tag
    .join(" ") // Join paragraphs into a single string
}
