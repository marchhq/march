import { useQuery } from "@tanstack/react-query"

import { Source } from "../lib/@types/Items/sources"
import getSources from "../lib/server/actions/sources"

export function useSources(session: string | null) {
  return useQuery<Source[]>({
    queryKey: ["sources", session],
    queryFn: () => getSources(session!),
    enabled: !!session,
  })
}
