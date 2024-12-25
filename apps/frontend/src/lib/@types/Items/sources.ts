export interface Source {
  _id: string
  slug: string
  user: string
}

export interface SourceResponse {
  sources: Source[]
}
