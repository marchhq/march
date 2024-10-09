export interface Space {
  _id: string
  name: string
  blocks: string[]
}

export interface Spaces {
  spaces: Space[]
}

export interface SpaceStoreTypes {
  pages: Space[]
  page: Space | null
  loading: boolean
  error: string | null
  fetchPages: (session: string) => Promise<void>
  fetchPageById: (id: string, session: string) => Promise<void>
  createPage: (data: Space, session: string) => Promise<void>
  updatePage: (_id: string, data: Space, session: string) => Promise<void>
  setSelectedPage: (page: Space | null) => void
}
