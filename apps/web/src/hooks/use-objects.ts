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

interface Item {
  _id: string;
  [key: string]: any; // To allow additional properties
}

interface QueryData {
  items?: Item[];
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
    onMutate: async (newData: any) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.INBOX });
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.TODAY });
      
      // Snapshot previous values
      const previousData = {
        inbox: queryClient.getQueryData(QUERY_KEYS.INBOX),
        today: queryClient.getQueryData(QUERY_KEYS.TODAY)
      };
      
      // Apply optimistic updates to the queries
      const isCreate = mutationKey[0] === "create-object";
      
      [QUERY_KEYS.INBOX, QUERY_KEYS.TODAY].forEach(queryKey => {
        queryClient.setQueryData(queryKey, (oldData: QueryData) => {
          if (!oldData) return oldData;
          
          // Handle array data structure
          if (Array.isArray(oldData)) {
            if (isCreate) {
              // For creation, add new item
              return [...oldData, { ...newData, _id: newData._id || `temp-${Date.now()}` }];
            } else {
              // For updates, update existing item
              return oldData.map(item => 
                item._id === newData._id ? { ...item, ...newData } : item
              );
            }
          } 
          // Handle object with items array
          else if (oldData.items && Array.isArray(oldData.items)) {
            return {
              ...oldData,
              items: isCreate
                ? [...oldData.items, { ...newData, _id: newData._id || `temp-${Date.now()}` }]
                : oldData.items.map(item => 
                    item._id === newData._id ? { ...item, ...newData } : item
                  )
            };
          }
          
          return oldData;
        });
      });
      
      return previousData;
    },
    
    onError: (err, _, context: any) => {
      // Restore previous data on error
      if (context) {
        queryClient.setQueryData(QUERY_KEYS.INBOX, context.inbox);
        queryClient.setQueryData(QUERY_KEYS.TODAY, context.today);
      }
      
      toast.error(errorMessage);
      console.error(`${errorMessage}:`, err);
    },
    
    onSettled: () => {
      // Ensure data consistency after mutation settles
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.INBOX });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TODAY });
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