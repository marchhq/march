import { useQuery } from "@tanstack/react-query"

import { Space } from "../lib/@types/Items/Space"
import { getSpaces } from "../lib/server/actions/spaces"
import { queryClient } from "@/src/contexts/QueryProvider"

export const SPACES_QUERY_KEYS = {
  all: ["spaces"] as const,
  list: (session: string | null) =>
    [...SPACES_QUERY_KEYS.all, session] as const,
}

export function useSpaces(session: string | null) {
  return useQuery<Space[]>({
    queryKey: ["spaces", session],
    queryFn: () => getSpaces(session!),
    enabled: !!session,
  })
}

export async function prefetchSpaces(session: string) {
  try {
    const spaces: Space[] = await getSpaces(session)
    queryClient.setQueryData(SPACES_QUERY_KEYS.list(session), spaces)
  } catch (error) {
    console.error("Error prefetching spaces:", error)
  }
}
