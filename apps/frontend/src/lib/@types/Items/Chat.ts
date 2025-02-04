export interface Message {
  content: string
  isUser: boolean
}

export interface AIResponse {
  answer: string
  suggestion: string
  hasStoredContent: boolean
}
