import { useQuery } from "@tanstack/react-query"

import { Array } from "../lib/@types/Array"
import { getArrays } from "../lib/server/actions/array"
import { queryClient } from "@/src/contexts/QueryProvider"

export const ARRAY_QUERY_KEYS = {
  all: ["arrays"] as const,
  list: (session: string | null) => [...ARRAY_QUERY_KEYS.all, session] as const,
}

export function useSpaces(session: string | null) {
  return useQuery<Array[]>({
    queryKey: ["arrays", session],
    queryFn: () => getArrays(session!),
    enabled: !!session,
  })
}

export async function prefetchSpaces(session: string) {
  try {
    const spaces: Array[] = await getArrays(session)
    queryClient.setQueryData(ARRAY_QUERY_KEYS.list(session), spaces)
  } catch (error) {
    console.error("Error prefetching spaces:", error)
  }
}
