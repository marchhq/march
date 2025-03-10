"use client";

import { getUser } from "@/actions/user";
import { User } from "@/types/user";
import { useQuery, useQueryClient, UseQueryResult } from "@tanstack/react-query";

export const useUser = () => {
  const queryClient = useQueryClient();

  const query: UseQueryResult<User> = useQuery({
    queryKey: ["user"],
    queryFn: getUser,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    initialData: () => {
      const cachedData = queryClient.getQueryData(["user"]);
      if (cachedData) return cachedData;

      const savedName = localStorage.getItem("userName");
      if (savedName) {
        return undefined
      }
      return undefined;
    },
  });

  if (query.data && query?.data?.fullName && query?.data?.avatar) {
    localStorage.setItem("userName", query.data.fullName);
    localStorage.setItem("userAvatar", query.data.avatar);
  }

  const refreshUser = () => {
    localStorage.removeItem("userName");
    return queryClient.invalidateQueries({ queryKey: ["user"] });
  };

  return {
    ...query,
    refreshUser,
  };
};
