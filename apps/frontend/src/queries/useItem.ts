import { useMutation, useQuery } from "@tanstack/react-query"

import { queryClient } from "../contexts/QueryProvider"
import { Item, MutateItem } from "../lib/@types/Items/Items"
import {
  createItem,
  getItemsByType,
  mutateItem,
} from "../lib/server/actions/item"

export const useItems = (session: string | null, type: string) => {
  return useQuery({
    queryKey: ["items", type, session],
    queryFn: () => getItemsByType(session, type),
    enabled: !!type,
  })
}

export const useCreateItem = (session: string | null) => {
  return useMutation({
    mutationFn: (data: Partial<Item>) => createItem(session, data),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["items"],
      }),
  })
}

export const useMutateItem = (session: string | null) => {
  return useMutation({
    mutationFn: ({ data, id }: MutateItem) => mutateItem(session, data, id),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["items"],
      }),
  })
}
