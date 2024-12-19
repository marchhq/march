import { useCallback, useMemo } from "react"

import { QueryClient, useQuery } from "@tanstack/react-query"
import { debounce } from "lodash"

import { queryClient } from "../contexts/QueryProvider"
import { searchItems } from "../lib/server/actions/search-items"

export const useSearch = (query: string, session: string) => {
  const debouncedPrefetch = useMemo(
    () =>
      debounce((searchTerm: string) => {
        queryClient.prefetchQuery({
          queryKey: ["search", searchTerm, session],
          queryFn: () => searchItems(searchTerm, session),
        })
      }, 300),
    [queryClient]
  )

  const searchQuery = useQuery({
    queryKey: ["search", query, session],
    queryFn: () => searchItems(query, session),
    enabled: Boolean(query),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
    select: (data) => data.response,
  })

  useCallback(() => {
    if (query) {
      debouncedPrefetch(query)
    }
  }, [query, debouncedPrefetch])

  return searchQuery
}
