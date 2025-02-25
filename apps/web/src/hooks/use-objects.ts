"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createObject, getInboxObjects, getTodayObjects } from "@/actions/objects";
import { CreateObject, Objects } from "@/types/objects";

export function useInboxObjects() {
  return useQuery({
    queryKey: ["inbox-objects"],
    queryFn: getInboxObjects,
  });
}

export function useTodayObjects() {
  return useQuery({
    queryKey: ["today-objects"],
    queryFn: getTodayObjects,
  });
}

export function useCreateObject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["create-object"],
    mutationFn: (object: CreateObject) => createObject(object),
    onMutate: async (newObject) => {
      // Cancel any outgoing refetches to avoid overwriting our optimistic update
      await queryClient.cancelQueries({ queryKey: ["inbox-objects"] });
    },
    onSuccess: (data) => {
      // Force a refetch instead of just invalidating
      queryClient.refetchQueries({
        queryKey: ["inbox-objects"],
        exact: true,
        type: 'active'
      });
      queryClient.refetchQueries({
        queryKey: ["today-objects"],
        exact: true,
        type: 'active'
      });
    },
    onError: (error) => {
      // Optionally handle error (e.g., show toast notification)
      console.error('Failed to create object:', error);
    }
  });
}
