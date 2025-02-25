import { useQuery } from "@tanstack/react-query";
import { Objects } from "@/types/objects";
import { getInboxObjects, getTodayObjects } from "@/actions/objects";

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
