import axios from "axios"
import { create } from "zustand"

import { Arrays, ArrayStoreTypes, Array } from "../@types/Items/Array"
import { BACKEND_URL } from "../constants/urls"

// Utility function to create config with Authorization header
const getConfig = (session: string) => ({
  headers: {
    Authorization: `Bearer ${session}`,
  },
})

const useArrayStore = create<ArrayStoreTypes>((set, get) => ({
  arrays: [],
  array: null,
  arrayId: null,
  loading: false,
  error: null,
  rightSideArrayList: false,
  draggableArray: null,
  setDraggableArray: (array) => {
    set({ draggableArray: array })
  },
  toggleRightSidePopUp: () => {
    const { rightSideArrayList } = get() // Access current state
    set({ rightSideArrayList: !rightSideArrayList })
  },
  // Fetch all arrays
  fetchArrays: async (session: string) => {
    set({ loading: true, error: null })
    try {
      const config = getConfig(session)
      const response = await axios.get<{ arrays: Array[] }>(
        `${BACKEND_URL}/arrays/`,
        config
      )

      set({
        arrays: response.data.arrays,
        loading: false,
      })
    } catch (error: any) {
      set({
        error:
          error?.response?.data?.message || "Unknown: failed to fetch arrays",
        loading: false,
      })
    }
  },

  // Fetch a specific array by ID
  fetchArrayById: async (id: string, session: string) => {
    set({ loading: true, error: null })
    try {
      const config = getConfig(session)
      const response = await axios.get<{ array: Array }>(
        `${BACKEND_URL}/arrays/${id}`,
        config
      )
      set({ array: response.data.array, loading: false })
    } catch (error: any) {
      set({
        error: error?.response?.data?.message || "Error while fetching array",
        loading: false,
      })
    }
  },

  // Create an array
  // createArray: async (data: Arrays, session: string) => {
  //   const {arrays}=get()
  //   set({ loading: true, error: null })
  //   try {
  //     const config = getConfig(session)
  //     const response = await axios.post<{ array: Array }>(
  //       `${BACKEND_URL}/arrays/`,
  //       data,
  //       config
  //     )
  //     set((state) => ({
  //       arrays: [response.data.array,...arrays],
  //       loading: false,
  //     }))
  //   } catch (error: any) {
  //     set({
  //       error: error?.response?.data?.message || "Error while creating array",
  //       loading: false,
  //     })
  //   }
  // },

  // // Update & delete an existing array
  // updateArray: async (_id: string, data: Arrays, session: string) => {
  //   set({ loading: true, error: null })
  //   try {
  //     const config = getConfig(session)
  //     const response = await axios.put<{ array: Arrays }>(
  //       `${BACKEND_URL}/arrays/${_id}`,
  //       data,
  //       config
  //     )
  //     const updatedArray = response.data.array
  //     set({
  //       array: get().array.map((array) =>
  //         array._id === _id ? updatedArray : array
  //       ),
  //       loading: false,
  //     })
  //   } catch (error: any) {
  //     set({
  //       error: error?.message || "Error while updating array",
  //       loading: false,
  //     })
  //   }
  // },

  // // Set selected array in state
  // setSelectedArray: (array: Arrays | null) => {
  //   set({ array })
  // },
}))

export default useArrayStore
