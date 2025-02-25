"use server"

import { apiClient } from "@/lib/api"
import { Objects, ObjectsResponse, TodayObjectResponse } from "@/types/objects"

export const getInboxObjects = async (): Promise<Objects[]> => {
  const data = await apiClient.get<ObjectsResponse>('/api/inbox')
  return data.response
}


export const getTodayObjects = async (): Promise<Objects[]> => {
  const data = await apiClient.get<TodayObjectResponse>('/api/today')
  return data.response.todayObjects
}