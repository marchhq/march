"use client"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createObject, getInboxObjects, getTodayObjects, orderObject, updateObject } from "@/actions/objects";
import { CreateObject, Objects, ObjectsResponse, OrderObject, OrderResponse, TodayObjectResponse } from "@/types/objects";
import { toast } from "sonner";
import { updateOrderInArray } from "@/lib/utils";

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

// Add the MutationContext interface
interface MutationContext {
  inbox: ObjectsResponse | undefined;
  today: TodayObjectResponse | undefined;
}

// Factory function for creating mutations with shared logic
function CreateObjectMutation<T extends CreateObject | Partial<Objects>>(
  mutationKey: string[],
  mutationFn: (data: T) => Promise<Objects[]>,
  errorMessage: string
) {
  const queryClient = useQueryClient();
  
  return useMutation<Objects[], Error, T, MutationContext>({
    mutationKey,
    mutationFn,
    onMutate: async (newData) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.INBOX });
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.TODAY });
      
      const previousData: MutationContext = {
        inbox: queryClient.getQueryData<ObjectsResponse>(QUERY_KEYS.INBOX),
        today: queryClient.getQueryData<TodayObjectResponse>(QUERY_KEYS.TODAY)
      };
      
      // Apply optimistic updates to the queries
      const isCreate = mutationKey[0] === "create-object";
      
      [QUERY_KEYS.INBOX, QUERY_KEYS.TODAY].forEach(queryKey => {
        queryClient.setQueryData<ObjectsResponse>(queryKey, (oldData): ObjectsResponse => {
          if (!oldData) {
            return { response: [] };
          }

          return {
            response: isCreate
              ? [...oldData.response, { ...(newData as Partial<Objects>), _id: 'temp-' + Date.now() } as Objects]
              : oldData.response.map(item => 
                  item._id === (newData as Partial<Objects>)._id ? { ...item, ...newData } : item
                )
          };
        });
      });
      
      return previousData;
    },
    
    onError: (err: Error, _: T, context: MutationContext | undefined) => {
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


export function useOrderObject() {
  const queryClient = useQueryClient();
  
  return useMutation<OrderResponse, Error, OrderObject, MutationContext>({
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
      
      const previousData: MutationContext = {
        inbox: queryClient.getQueryData(QUERY_KEYS.INBOX),
        today: queryClient.getQueryData(QUERY_KEYS.TODAY)
      };

      // Handle Inbox data
      queryClient.setQueryData<Objects[]>(QUERY_KEYS.INBOX, (oldData) => {
        if (!oldData) {
          return [];
        }
        return updateOrderInArray(oldData, newOrder);
      });

      // Handle Today data
      queryClient.setQueryData<Objects[]>(QUERY_KEYS.TODAY, (oldData) => {
        if (!oldData) {
          return [];
        }
        return updateOrderInArray(oldData, newOrder);
      });
      
      return previousData;
    },
    onError: (err: Error, _, context: MutationContext | undefined) => {
      if (context) {
        queryClient.setQueryData(QUERY_KEYS.INBOX, context.inbox);
        queryClient.setQueryData(QUERY_KEYS.TODAY, context.today);
      }
      toast.error("Failed to reorder items");
      console.error("Failed to reorder items:", err);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.INBOX });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TODAY });
    }
  });
}