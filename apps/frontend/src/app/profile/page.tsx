import * as React from "react"

import { InfoBox } from "@/src/components/atoms/InfoBox"
import { IntegrationList } from "@/src/components/atoms/IntegrationList"
import { ProfilePicture } from "@/src/components/atoms/ProfilePicture"

const ProfilePage: React.FC = () => {
  return (
    <section className="text-gray-color">
      <div className="mx-auto flex flex-col items-start">
        <div className="max-w-4xl">
          <div>
            <h1>Profile</h1>
            <p>manage your profile and integrations.</p>
          </div>
        </div>

        <div>
          <h1>Photo</h1>
          <ProfilePicture />
          <p>update photo. recommended size is 256x256 px.</p>
        </div>

        <InfoBox />

        <div>
          <IntegrationList />
        </div>
      </div>
    </section>
  )
}

export default ProfilePage
