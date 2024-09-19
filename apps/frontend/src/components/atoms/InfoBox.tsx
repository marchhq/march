"use client"
import { ProfileBtn } from "./ProfileBtn"
import { useUserInfo } from "@/src/hooks/useUserInfo"

export const InfoBox = (): JSX.Element => {
  const user = useUserInfo()

  return (
    <div>
      <label htmlFor="email">Email</label>
      <ProfileBtn
        email={user?.accounts.google.email || user?.accounts.github.email}
      />
      <label htmlFor="fullname">Full Name</label>
      <ProfileBtn fullname={user?.fullName} />
    </div>
  )
}
