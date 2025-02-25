"use server"

import { apiClient } from "@/lib/api"
import { CreateObject, Objects, ObjectsResponse, TodayObjectResponse } from "@/types/objects"

export const getInboxObjects = async (): Promise<Objects[]> => {
  const data = await apiClient.get<ObjectsResponse>('/api/inbox')
  return data.response
}

export const getTodayObjects = async (): Promise<Objects[]> => {
  const data = await apiClient.get<TodayObjectResponse>('/api/today')
  return data.response.todayObjects
}

export const createObject = async (object: CreateObject) => {
  const data = await apiClient.post<ObjectsResponse, CreateObject>('/api/inbox', object)
  return data.response
}
