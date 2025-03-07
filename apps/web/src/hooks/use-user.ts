import { getUser } from "@/actions/user"
import { useQuery, useQueryClient } from "@tanstack/react-query"

export const useUser = () => {
  const queryClient = useQueryClient()
  const query = useQuery({
    queryKey: ["user"],
    queryFn: getUser,
    retry: false,
  })

  const refreshUser= () => {
    return queryClient.invalidateQueries({queryKey: ["user"]})
  }

  return {
    ...query,
    refreshUser
  }
}
