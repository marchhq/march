"use client"

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createObject, deleteObject, getInboxObjects, getTodayObjects, orderObject, updateObject } from "@/actions/objects";
import { CreateObject, Objects, OrderObject } from "@/types/objects";
import { toast } from "sonner";

// Query keys as constants to avoid typos and make refactoring easier
export const QUERY_KEYS = {
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
function CreateObjectMutation<T extends CreateObject | Partial<Objects>>(
  mutationKey: string[],
  mutationFn: (data: T) => Promise<Objects[]>,
  errorMessage: string
) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationKey,
    mutationFn,
    onMutate: async (newData: any) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.INBOX });
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.TODAY });
      
      const previousData = {
        inbox: queryClient.getQueryData(QUERY_KEYS.INBOX),
        today: queryClient.getQueryData(QUERY_KEYS.TODAY)
      };
      
      // Apply optimistic updates to the queries
      const isCreate = mutationKey[0] === "create-object";
      const isDelete = mutationKey[0] === "delete-object";
      
      [QUERY_KEYS.INBOX, QUERY_KEYS.TODAY].forEach(queryKey => {
        queryClient.setQueryData(queryKey, (oldData: QueryData) => {
          if (!oldData) return oldData;

          // Handle array data structure
          if (Array.isArray(oldData)) {
            if (isDelete) {
              // For deletion, filter out the item
              return oldData.filter(item => item._id !== newData._id);
            } else if (isCreate) {
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
              items: isDelete
                ? oldData.items.filter(item => item._id !== newData._id)
                : isCreate
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
    onError: (err, _: T, context: any) => {
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
  return CreateObjectMutation<CreateObject>(
    ["create-object"],
    (object) => createObject(object),
    "Failed to create object"
  );
}

export function useUpdateObject() {
  return CreateObjectMutation<Partial<Objects>>(
    ["update-object"],
    (object) => updateObject(object),
    "Failed to update object"
  );
}

export function useDeleteObject() {
  return CreateObjectMutation<Partial<Objects>>(
    ["delete-object"],
    async (object) => {
      const response = await deleteObject(object);
      if (!response) {
        throw new Error("Failed to delete object");
      }
      return [];
    },
    "Failed to delete object"
  );
}

export function useOrderObject() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationKey: ["order-object"],
    mutationFn: async (object: OrderObject) => {
      const result = await orderObject(object);
      return {
        success: result,
        message: result ? "Order updated" : "Failed to update order"
      };
    },
    onMutate: async (newOrder) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.INBOX });
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.TODAY });
      
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

      return { previousInboxItems, previousTodayItems };
    },
    onError: (err, _, context: any) => {
      if (context) {
        queryClient.setQueryData(QUERY_KEYS.INBOX, context.previousInboxItems);
        queryClient.setQueryData(QUERY_KEYS.TODAY, context.previousTodayItems);
      }
      toast.error("Failed to reorder items");
      console.error("Failed to reorder items:", err);
    },
    onSettled: () => {
      [QUERY_KEYS.INBOX, QUERY_KEYS.TODAY].forEach(key => {
        queryClient.invalidateQueries({ queryKey: key });
      });
    }
  });
}