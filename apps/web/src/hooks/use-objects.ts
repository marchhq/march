"use client"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createObject, getInboxObjects, getTodayObjects, orderObject, updateObject } from "@/actions/objects";
import { CreateObject, Objects, OrderObject } from "@/types/objects";
import { toast } from "sonner";

// Query keys as constants to avoid typos and make refactoring easier
const QUERY_KEYS = {
  INBOX: ["inbox-objects"],
  TODAY: ["today-objects"]
};

// Common queries
export function useInboxObjects() {
  return useQuery({
    queryKey: QUERY_KEYS.INBOX,
    queryFn: getInboxObjects,
  });
}

export function useTodayObjects() {
  return useQuery({
    queryKey: QUERY_KEYS.TODAY,
    queryFn: getTodayObjects,
  });
}

// Factory function for creating mutations with shared logic
function createObjectMutation<T>(
  mutationKey: string[],
  mutationFn: (data: T) => Promise<any>,
  errorMessage: string
) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationKey,
    mutationFn,
    onMutate: async () => {
      // Cancel any outgoing refetches to avoid overwriting our optimistic update
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.INBOX });
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.TODAY });
    },
    onSuccess: () => {
      // Force a refetch instead of just invalidating
      [QUERY_KEYS.INBOX, QUERY_KEYS.TODAY].forEach(key => {
        queryClient.refetchQueries({
          queryKey: key,
          exact: true,
          type: 'active'
        });
      });
    },
    onError: (error) => {
      toast.error(errorMessage);
      console.error(`${errorMessage}:`, error);
    }
  });
}

// Specialized mutation hooks using the factory
export function useCreateObject() {
  return createObjectMutation<CreateObject>(
    ["create-object"],
    (object) => createObject(object),
    "Failed to create object"
  );
}

export function useUpdateObject() {
  return createObjectMutation<Partial<Objects>>(
    ["update-object"],
    (object) => updateObject(object),
    "Failed to update object"
  );
}

export function useOrderObject() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationKey: ["order-object"],
    mutationFn: (object: OrderObject) => orderObject(object),
    onMutate: async (newOrder) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.INBOX });
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.TODAY });
      
      // Snapshot the previous value
      const previousInboxItems = queryClient.getQueryData(QUERY_KEYS.INBOX);
      const previousTodayItems = queryClient.getQueryData(QUERY_KEYS.TODAY);
      
      // Optimistically update to the new value
      [QUERY_KEYS.INBOX, QUERY_KEYS.TODAY].forEach(key => {
        queryClient.setQueryData(key, (old: Objects[] | undefined) => {
          if (!old) return old;
          
          // Create a copy of the items
          const updatedItems = [...old];
          
          // Update the order of each item based on the newOrder
          newOrder.orderedItems.forEach(({ id, order }) => {
            const itemIndex = updatedItems.findIndex(item => item._id === id);
            if (itemIndex !== -1) {
              updatedItems[itemIndex] = {
                ...updatedItems[itemIndex],
                order
              };
            }
          });
          
          return updatedItems;
        });
      });
      
      // Return a context object with the snapshotted value
      return { previousInboxItems, previousTodayItems };
    },
    onError: (err, newOrder, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context) {
        queryClient.setQueryData(QUERY_KEYS.INBOX, context.previousInboxItems);
        queryClient.setQueryData(QUERY_KEYS.TODAY, context.previousTodayItems);
      }
      toast.error("Failed to reorder items");
      console.error("Failed to reorder items:", err);
    },
    onSettled: () => {
      // Always refetch after error or success to ensure we have the correct data
      [QUERY_KEYS.INBOX, QUERY_KEYS.TODAY].forEach(key => {
        queryClient.invalidateQueries({ queryKey: key });
      });
    }
  });
}