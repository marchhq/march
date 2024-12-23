import { useQuery } from "@tanstack/react-query"

import { Type } from "../lib/@types/Items/type"
import getTypes from "../lib/server/actions/types"

export function useTypes(session: string | null) {
  return useQuery<Type[]>({
    queryKey: ["types", session],
    queryFn: () => getTypes(session!),
    enabled: !!session,
  })
}
