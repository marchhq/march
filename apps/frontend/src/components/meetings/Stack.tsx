"use client";

import { useAuth } from "@/src/contexts/AuthContext";
import { Meet } from "@/src/lib/@types/Items/Meet";
import useMeetsStore, { MeetsStoreType } from "@/src/lib/store/meets.store";
import classNames from "@/src/utils/classNames"
import { getCurrentWeekMeets } from "@/src/utils/meet";
import { useEffect, useState } from "react"

export const Stack = (): JSX.Element => {

  const { session } = useAuth();
  const fetchUpcomingMeets = useMeetsStore((state: MeetsStoreType) => state.fetchUpcomingMeets);
  const upcomingMeets = useMeetsStore((state: MeetsStoreType) => state.upcomingMeetings);
  const [currentWeekMeets, setCurrentWeekMeets] = useState<Meet[]>([]);
  const [closeToggle, setCloseToggle] = useState(false)
  const handleClose = () => setCloseToggle(!closeToggle)

  useEffect(() => {
    fetchUpcomingMeets(session)
  }, [fetchUpcomingMeets])

  useEffect(() => {
    const meets = getCurrentWeekMeets(upcomingMeets);
    setCurrentWeekMeets(meets)
  }, [upcomingMeets])

  console.log('upcoming week meets: ', upcomingMeets)
  console.log('current week meets: ', currentWeekMeets)

  return (
    <>
      <span
        onClick={handleClose}
        className="hover:text-foreground cursor-pointer">stack</span>
      {currentWeekMeets.map((meet: Meet) => (
        <div key={meet._id} className={classNames(
          closeToggle ? "hidden" : "visible", "mt-4 cursor-pointer hover:text-foreground"
        )}>
          {meet.title}
        </div>
      ))}
    </>

  )
}
