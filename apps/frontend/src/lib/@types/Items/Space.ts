export interface Space {
  _id: string
  name: string
  icon: string
  users: string[]
  blocks: string[]
  isArchived: boolean
  isDeleted: boolean
  uuid: string
}

export interface Spaces {
  spaces: Space[]
}

export interface SpaceStoreTypes {
  spaces: Space[]
  space: Space | null
  loading: boolean
  error: string | null
  fetchSpaces: (session: string) => Promise<void>
  fetchSpaceById: (id: string, session: string) => Promise<void>
  createSpace: (data: Space, session: string) => Promise<void>
  updateSpace: (_id: string, data: Space, session: string) => Promise<void>
  setSelectedSpace: (page: Space | null) => void
}
