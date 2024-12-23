export interface Type {
  _id: string
  slug: string
  user: string
}

export interface TypeResponse {
  types: Type[]
}
