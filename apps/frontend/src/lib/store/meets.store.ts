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
  currentMeeting: Meet | null
  setCurrentMeeting: (meet: Meet | null) => void
  isFetched: boolean
  setIsFetched: (status: boolean) => void
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
  fetchMeetByid: (session: string, id: string) => Promise<void>
  /**
   * Fetch meeting by id
   * @param session and meet _id
   */
  fetchLatestMeet: (session: string) => Promise<Meet | null>
  createMeet: (session: string, meet: any) => Promise<void>
  /**
   * Update a Meet in local
   * @param meet - The Meet to update
   */
  updateMeet: (session: string, meet: any, id: string) => Promise<void>
  /**
   * Save a Meet to the server
   * @param meet - The Meet to save
   * @param session - The session of the user
   */
  saveMeet: (session: string, meet: any) => Promise<void>
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

export const useMeetsStore = create<MeetsStoreType>((set) => ({
  meets: [],
  upcomingMeetings: [],

  currentMeeting: null,
  setCurrentMeeting: (event: Meet | null) => {
    set((state: any) => ({
      ...state,
      currentMeeting: event,
    }))
  },
  isFetched: false,
  setIsFetched: (status: boolean) => {
    set((state: any) => ({
      ...state,
      isFetched: status,
    }))
  },
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
    try {
      const { data } = await axios.get(`${BACKEND_URL}/spaces/meetings/${id}`, {
        headers: {
          Authorization: `Bearer ${session}`,
        },
      })
      const meet = data.meeting[0]
      set((state: any) => ({
        ...state,
        currentMeeting: meet,
        isFetched: true,
      }))
    } catch (error) {
      const e = error as AxiosError
      console.log(e.cause)
    }
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

  updateMeet: async (session: string, meet: any, id: string) => {
    try {
      const { data } = await axios.put(
        `${BACKEND_URL}/spaces/meetings/${id}`,
        meet,
        {
          headers: {
            Authorization: `Bearer ${session}`,
          },
        }
      )
      set((state: any) => ({
        ...state,
        currentMeeting: data.meeting,
      }))
      set((state: MeetsStoreType) => ({
        ...state,
        upcomingMeetings: state.upcomingMeetings.map((m) =>
          m._id === meet._id ? meet : m
        ),
        meets: state.meets.map((m) => (m._id === meet._id ? meet : m)),
      }))
    } catch (error) {
      const e = error as AxiosError
      console.error(e.response?.data)
    }
  },
  createMeet: async (session: string, meet: any) => {
    try {
      const { data } = await axios.post(
        `${BACKEND_URL}/spaces/meetings/create/`,
        meet.meetData,
        {
          headers: {
            Authorization: `Bearer ${session}`,
          },
        }
      )
      meet = data.meetings
      set((state: any) => ({
        ...state,
        currentMeeting: meet,
      }))
    } catch (error) {
      const e = error as AxiosError
      console.error(e.response?.data)
    }
  },

  saveMeet: async (session: string, meet: any) => {
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
