"use client"

import React, { useEffect, useState } from 'react'
import { MeetNotes } from "./MeetNotes"
import { Stack } from "./Stack"
import useMeetsStore from "@/src/lib/store/meets.store";
import { useAuth } from "@/src/contexts/AuthContext";
import { Meet } from '@/src/lib/@types/Items/Meet';

interface MeetingPageProps {
  meetId: string
}

const MeetingPage: React.FC<MeetingPageProps> = ({ meetId }) => {
  const { session } = useAuth();
  const fetchMeetById = useMeetsStore(state => state.fetchMeetByid);
  const [meetData, setMeetData] = useState<Meet | null>(null);

  useEffect(() => {
    const fetchMeet = async () => {
      const meet = await fetchMeetById(session, meetId);
      setMeetData(meet);
    };
    fetchMeet();
  }, [meetId, session, fetchMeetById]);

  if (!meetData) {
    return <div>Loading...</div>;
  }

  return (
    <main className="p-16 h-full text-gray-color flex justify-between">
      <section>
        <MeetNotes meetData={meetData} />
      </section>
      <section className="max-w-[200px] text-sm w-full text-secondary-foreground">
        <Stack meetId={meetId} />
      </section>
    </main>
  )
}

export default MeetingPage
