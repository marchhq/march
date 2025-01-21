export interface Array {
  _id: string
  name: string
  icon: string
  users: string[]
  blocks: string[]
  isArchived: boolean
  isDeleted: boolean
  uuid: string
}

export interface Arrays {
  arrays: Array[]
}

export interface ArrayStoreTypes {
  arrays: Array[]
  array: Array | null
  arrayId: string | null
  loading: boolean
  rightSideArrayList: boolean
  error: string | null
  toggleRightSidePopUp: () => void
  draggableArray: null | string
  setDraggableArray: (array: string | null) => void
  fetchArrays: (session: string | Promise<string>) => Promise<void>
  fetchArrayById: (id: string, session: string) => Promise<void>
  // createArray: (data: Array, session: string) => Promise<void>
  // updateArray: (_id: string, data: Array, session: string) => Promise<void>
  // setSelectedArray: (array: Array | null) => void
}
