import axios, { AxiosError } from "axios";
import { create } from "zustand";
import { BACKEND_URL } from "../constants/urls";
import { InboxItem, InboxStoreType, OverdueInboxItem, TodayInboxItem } from "../@types/Items/Inbox";

const useInboxStore = create<InboxStoreType>((set) => ({
    inboxItems: [],
    todayInboxItems: [],
    overdueInboxItems: [],
    isFetched: false,
    setIsFetched: (isFetched: boolean) => {
        set({ isFetched });
    },
    fetchInboxData: async (session: string) => {
        let inboxItems_: InboxItem[] = [];
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${session}`,
                },
            };
            const { data } = await axios.get(`${BACKEND_URL}/api/my`, config);
            inboxItems_ = data.response as InboxItem[];
        } catch (error) {
            const e = error as AxiosError;
            console.error("Error while fetching my::", e.message);
        }
        set({ inboxItems: inboxItems_ });
        return inboxItems_;
    },
    setInboxItems: (inboxItems: InboxItem[]) => { // setState for inboxItems
        set({ inboxItems });
    },
    fetchTodayInboxData: async (session: string) => {
        let todayItems_: TodayInboxItem[] = [];
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${session}`,
                },
            };
            const { data } = await axios.get(`${BACKEND_URL}/api/my/today`, config);
            todayItems_ = data.response.items as TodayInboxItem[];
        } catch (error) {
            const e = error as AxiosError;
            console.error("Error while fetching my-today::", e.message);
        }
        set({ todayInboxItems: todayItems_ });
        return todayItems_
    },
    setTodayInboxItems: (todayInboxItems: TodayInboxItem[]) => { // setState for todayInboxItems
        set({ todayInboxItems });
    },
    fetchOverdueInboxData: async (session: string) => {
        let overdueItems_: OverdueInboxItem[] = [];
        try {
          const config = {
            headers: {
              Authorization: `Bearer ${session}`,
            },
          };
          const { data } = await axios.get(`${BACKEND_URL}/api/my/overdue`, config); // Fetch overdue items
          overdueItems_ = data.response.items as OverdueInboxItem[];
        } catch (error) {
          const e = error as AxiosError;
          console.error("Error while fetching my-overdue::", e.message);
        }
        set({ overdueInboxItems: overdueItems_ });
        return overdueItems_;
      },
      setOverdueInboxItems: (overdueInboxItems: OverdueInboxItem[]) => {
        set({ overdueInboxItems });
      },
    }));

export default useInboxStore;
