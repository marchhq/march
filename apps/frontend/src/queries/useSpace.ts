import { useQuery } from "@tanstack/react-query"

import { Space } from "../lib/@types/Items/Space"
import { getSpaces } from "../lib/server/actions/spaces"

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
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  })
}
