"use client"
import { ProfileBtn } from "./ProfileBtn"
import { useUserInfo } from "@/src/hooks/useUserInfo"

export const InfoBox = (): JSX.Element => {
  const user = useUserInfo()

  return (
    <div>
      <div className=" text-xl font-medium text-white">Email</div>
      <div className="mt-2 text-white/80">
        <ProfileBtn
          email={user?.accounts.google?.email || user?.accounts.github?.email}
        />
      </div>
      <div className="mt-6 text-xl font-medium text-white">Full Name</div>{" "}
      <div className="mt-4 text-white/80">
        <ProfileBtn fullname={user?.fullName} />
      </div>
    </div>
  )
}
