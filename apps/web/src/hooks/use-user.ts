"use client";

import { getUser } from "@/actions/user";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export const useUser = () => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["user"],
    queryFn: getUser,
    retry: false,
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    initialData: () => {
      const cachedData = queryClient.getQueryData(["user"]);
      if (cachedData) return cachedData;

      const savedData = localStorage.getItem("userData");
      if (savedData) {
        const parsed = JSON.parse(savedData);
        queryClient.setQueryData(["user"], parsed);
        return parsed;
      }
      return undefined;
    },
  });

  if (query.data) {
    localStorage.setItem("userData", JSON.stringify(query.data));
  }

  const refreshUser = () => {
    localStorage.removeItem("userData"); 
    return queryClient.invalidateQueries({ queryKey: ["user"] });
  };

  return {
    ...query,
    refreshUser,
  };
};
