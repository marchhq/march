export const isLink = (value: string): boolean => {

    const trimmedValue = value.trim()
    // Enhanced regex to check for URLs with or without protocol
    // This will return true if the given text is a link
    // will return true if the value has https:// or www. or only contains domain without protocol like abc.com
    // Will return false if any spaces are present
    const urlPattern = /^(https?:\/\/)?(www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(\/[^\s]*)?$/
    
    return urlPattern.test(trimmedValue)
}
