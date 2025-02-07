export interface Array {
  _id: string
  name: string
  identifier: string
  icon: string
  users: string[]
  blocks: string[]
  isArchived: boolean
  isDeleted: boolean
  uuid: string
}

export interface Arrays {
  spaces: Array[]
}
