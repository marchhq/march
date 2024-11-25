import axios, { type AxiosError } from "axios"
import { create } from "zustand"

import {
  MeetsStoreType,
  type GetMeetResponse,
  type Meet,
} from "../@types/Items/Meet"
import { BACKEND_URL } from "../constants/urls"

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
        meets: state.meets.map((m) => (m._id === meet._id ? meet : m)),
      }))
    } catch (error) {
      const e = error as AxiosError
      console.error(e.response?.data)
    }
  },
  createMeet: async (
    session: string,
    spaceId: string,
    blockId: string,
    meet: any
  ) => {
    try {
      const response = await axios.post(
        `${BACKEND_URL}/spaces/${spaceId}/blocks/${blockId}/items`,
        meet.meetData,
        {
          headers: {
            Authorization: `Bearer ${session}`,
          },
        }
      )
      meet = response.data.item
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
}))
