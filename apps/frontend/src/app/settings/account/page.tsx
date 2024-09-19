"use client"
import { Heading } from "@/src/components/atoms/Heading"
import { ProfileBtn } from "@/src/components/atoms/ProfileBtn"
import { ProfilePicture } from "@/src/components/atoms/ProfilePicture"
import { UserInfo } from "@/src/components/atoms/UserInfo"
import { useUserInfo } from "@/src/hooks/useUserInfo"

const About = (): JSX.Element => {
  const user = useUserInfo()

  return (
    <div className="flex min-h-screen flex-col items-center justify-center text-gray-color">
      <div className="w-full max-w-4xl">
        <div className="ml-4">
          <Heading label="Account" />
        </div>
        <div className="mt-8 rounded-md p-8 shadow-md">
          <div className="flex flex-col items-center space-y-8">
            <div className="flex w-full flex-col items-start rounded-md bg-background-active p-6">
              <p className="mb-4 text-left text-lg font-medium">
                Profile Picture
              </p>
              <ProfilePicture />
            </div>
            <div className="w-full max-w-[800px] space-y-2">
              <UserInfo label="Email">
                <ProfileBtn
                  email={
                    user?.accounts.github.email || user?.accounts.google.email
                  }
                />
              </UserInfo>
              <UserInfo label="Full name">
                <ProfileBtn fullname={user?.fullName} />
              </UserInfo>
              <UserInfo label="Username">
                <ProfileBtn username={user?.userName} />
              </UserInfo>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About
