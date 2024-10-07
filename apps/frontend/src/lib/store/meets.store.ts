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
   * Update a Meet in local
   * @param meet - The Meet to update
   */
  updateMeet: (meet: Meet, isUpcoming: boolean) => void
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
      const { data } = await axios.get(`${BACKEND_URL}/api/meetings/overview`, {
        headers: {
          Authorization: `Bearer ${session}`,
        },
      })
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
      const { data } = await axios.get(`${BACKEND_URL}/api/meetings/upcomings/`, {
        headers: {
          Authorization: `Bearer ${session}`,
        },
      });

      console.log('Full API response:', data); // Log full response to inspect structure

      const response = data; // Cast response to expected type
      console.log('Fetched upcoming meets:', response.upcomingMeetings); // Log the meetings field

      set((state: MeetsStoreType) => ({
        ...state,
        upcomingMeetings: response.upcomingMeetings, // Ensure this is correct
      }));
    } catch (error) {
      const e = error as AxiosError;
      console.error('API call failed with error:', e.message);
      if (e.response) {
        console.error('API response error:', e.response.data);
      } else {
        console.error('Error with request, no response received:', e);
      }
    }
  },

  updateMeet: (meet: Meet, isUpcoming: boolean) => {
    if (isUpcoming) {
      set((state: MeetsStoreType) => ({
        ...state,
        upcomingMeets: state.upcomingMeets.map((m) =>
          m.uuid === meet.uuid ? meet : m
        ),
      }))
    } else {
      set((state: MeetsStoreType) => ({
        ...state,
        meets: state.meets.map((m) => (m.uuid === meet.uuid ? meet : m)),
      }))
    }
  },
  saveMeet: async (meet: any, session: string) => {
    try {
      await axios.post(`${BACKEND_URL}/api/meetings/${meet.uuid}`, meet, {
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
          upcomingMeets: state.upcomingMeets.filter((m) => m.uuid !== uuid),
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
