"use client"

import { useEffect, useState } from "react"

import { AxiosError } from "axios"
import { useRouter } from "next/navigation"

import { useAuth } from "@/src/contexts/AuthContext"
import { Meet } from "@/src/lib/@types/Items/Meet"
import useMeetsStore, { MeetsStoreType } from "@/src/lib/store/meets.store"

export default function Meetings() {
  const { session } = useAuth()
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const fetchLatestMeet = useMeetsStore(
    (state: MeetsStoreType) => state.fetchLatestMeet
  )

  useEffect(() => {
    const getMeetId = async () => {
      try {
        const meet: Meet | null = await fetchLatestMeet(session)
        if (meet && meet._id) {
          router.push(`/space/meetings/${meet._id}`)
        } else {
          setLoading(false)
          console.log("no meetings")
        }
      } catch (error) {
        const e = error as AxiosError
        console.error(e.cause)
        setLoading(false)
      }
    }

    getMeetId()
  }, [fetchLatestMeet, session, router])

  return (
    <>
      {loading && <p>loading...</p>}
      {!loading && <p>No meetings found.</p>}
    </>
  )
}
