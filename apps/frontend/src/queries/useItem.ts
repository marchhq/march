import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { Item, MutateItem } from "../lib/@types/Items/Items"
import {
  createItem,
  getItemById,
  getItemsByType,
  updateItem,
} from "../lib/server/actions/item"

export const useItems = (session: string | null, type: string) => {
  return useQuery({
    queryKey: ["items", type, session],
    queryFn: () => getItemsByType(session, type),
    enabled: !!session && !!type,
  })
}

export const useItem = (session: string | null, id: string) => {
  return useQuery({
    queryKey: ["item", id, session],
    queryFn: () => getItemById(session, id),
    enabled: !!session && !!id,
  })
}

export const useCreateItem = (session: string | null) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Partial<Item>) => createItem(session, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["items", variables.type],
      })
    },
  })
}

export const useUpdateItem = (session: string | null) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ data, id }: MutateItem) => updateItem(session, data, id),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["items"],
      }),
  })
}
