import axios, { type AxiosError } from "axios"
import { create } from "zustand"

import { type GetMeetResponse, type Meet } from "../@types/Items/Meet"
import { BACKEND_URL } from "../constants/urls"

export interface MeetsStoreType {
  /**
   * Meets array
   */
  meets: Meet[]
  /**
   * Upcoming Meets array
   */
  upcomingMeetings: Meet[]
  /**
   * Fetch Meets from the server
   * @param session - The session of the user
   */
  fetchMeets: (session: string) => Promise<void>
  /**
   * Fetch Upcoming Meets from the server
   * @param session - The session of the user
   */
  fetchUpcomingMeets: (session: string) => Promise<void>
  /**
   * Fetch meeting by id
   * @param session and meet _id
   */
  fetchMeetByid: (session: string, id: string) => Promise<Meet | null>
  /**
   * Fetch meeting by id
   * @param session and meet _id
   */
  fetchLatestMeet: (session: string) => Promise<Meet | null>
  createMeet: (meet: any, session: string) => Promise<void>
  /**
   * Update a Meet in local
   * @param meet - The Meet to update
   */
  updateMeet: (meet: Meet, session: string) => Promise<void>
  /**
   * Save a Meet to the server
   * @param meet - The Meet to save
   * @param session - The session of the user
   */
  saveMeet: (meet: any, session: string) => Promise<void>
  /**
   * Delete a Meet from the server and local state
   * @param uuid - The uuid of the Meet to delete
   * @param isUpcoming - Whether the Meet is upcoming or not
   * @param session - The session of the user
   */
  deleteMeet: (
    uuid: string,
    isUpcoming: boolean,
    session: string
  ) => Promise<void>
}

const useMeetsStore = create<MeetsStoreType>((set) => ({
  meets: [],
  upcomingMeetings: [],

  fetchMeets: async (session: string) => {
    try {
      const { data } = await axios.get(
        `${BACKEND_URL}/spaces/meetings/overview`,
        {
          headers: {
            Authorization: `Bearer ${session}`,
          },
        }
      )
      const response = data as GetMeetResponse
      set((state: MeetsStoreType) => ({
        ...state,
        meets: response.meetings,
      }))
    } catch (error) {
      const e = error as AxiosError
      console.error(e.response?.data)
    }
  },

  fetchUpcomingMeets: async (session: string) => {
    try {
      const { data } = await axios.get(
        `${BACKEND_URL}/spaces/meetings/upcoming/`,
        {
          headers: {
            Authorization: `Bearer ${session}`,
          },
        }
      )
      const response = data
      set((state: MeetsStoreType) => ({
        ...state,
        upcomingMeetings: response.meetings,
      }))
    } catch (error) {
      const e = error as AxiosError
      console.error(e.cause)
    }
  },

  fetchMeetByid: async (session: string, id: string) => {
    let meet: Meet | null = null
    try {
      const { data } = await axios.get(`${BACKEND_URL}/api/meetings/${id}`, {
        headers: {
          Authorization: `Bearer ${session}`,
        },
      })
      meet = data.meeting[0]
    } catch (error) {
      const e = error as AxiosError
      console.log(e.cause)
    }
    return meet
  },

  fetchLatestMeet: async (session: string): Promise<Meet | null> => {
    let meet: Meet | null = null
    try {
      const { data } = await axios.get(
        `${BACKEND_URL}/spaces/meetings/overview/`,
        {
          headers: {
            Authorization: `Bearer ${session}`,
          },
        }
      )
      meet = data.meetings[0]
    } catch (error) {
      const e = error as AxiosError
      console.error(e.cause)
    }
    return meet
  },
  updateMeet: async (meet: Meet, session: string) => {
    try {
      await axios.put(`${BACKEND_URL}/spaces/meetings/${meet._id}`, meet, {
        headers: {
          Authorization: `Bearer ${session}`,
        },
      })
      set((state: MeetsStoreType) => ({
        ...state,
        upcomingMeetings: state.upcomingMeetings.map((m) =>
          m.uuid === meet.uuid ? meet : m
        ),
        meets: state.meets.map((m) => (m.uuid === meet.uuid ? meet : m)),
      }))
    } catch (error) {
      const e = error as AxiosError
      console.error(e.response?.data)
    }
  },
  createMeet: async (meet: any, session: string) => {
    try {
      await axios.post(`${BACKEND_URL}/spaces/meetings/create/`, meet, {
        headers: {
          Authorization: `Bearer ${session}`,
        },
      })
    } catch (error) {
      const e = error as AxiosError
      console.error(e.response?.data)
    }
  },
  saveMeet: async (meet: Meet, session: string) => {
    try {
      await axios.put(`${BACKEND_URL}/spaces/meetings/${meet._id}`, meet, {
        headers: {
          Authorization: `Bearer ${session}`,
        },
      })
    } catch (error) {
      const e = error as AxiosError
      console.error(e.response?.data)
    }
  },
  deleteMeet: async (uuid: string, isUpcoming: boolean, session: string) => {
    try {
      if (isUpcoming) {
        set((state: MeetsStoreType) => ({
          ...state,
          upcomingMeets: state.upcomingMeetings.filter((m) => m.uuid !== uuid),
        }))
      } else {
        set((state: MeetsStoreType) => ({
          ...state,
          meets: state.meets.filter((m) => m.uuid !== uuid),
        }))
      }
      await axios.delete(`${BACKEND_URL}/api/meetings/${uuid}`, {
        headers: {
          Authorization: `Bearer ${session}`,
        },
      })
    } catch (error) {
      const e = error as AxiosError
      console.error(e.response?.data)
    }
  },
}))

export default useMeetsStore
