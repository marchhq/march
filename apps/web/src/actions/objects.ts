"use server"

import { apiClient } from "@/lib/api"
import { Objects, ObjectsResponse } from "@/types/objects"

export const getInboxObjects = async (): Promise<Objects[]> => {
  const data = await apiClient.get<ObjectsResponse>('/api/inbox')
  return data.response
}

interface TodayObjectResponse {
  response: {
    todayObjects: Objects[],
    overdueObjects: Objects[]
  }
}
export const getTodayObjects = async (): Promise<Objects[]> => {
  const data = await apiClient.get<TodayObjectResponse>('/api/today')
  return data.response.todayObjects
}
