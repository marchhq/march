import * as React from "react"

import { InfoBox } from "@/src/components/atoms/InfoBox"
import { IntegrationList } from "@/src/components/atoms/IntegrationList"
import { ProfilePicture } from "@/src/components/atoms/ProfilePicture"

const ProfilePage: React.FC = () => {
  const [isGithubConnected, setIsGithubConnected] = React.useState(false)

  const handleConnectGithub = async () => {
    try {
      const response = await fetch("/integrate/github", { method: "POST" })
      if (response.ok) {
        const data = await response.json()
        window.location.href = data.url 
      } else {
        console.error("Failed to initiate GitHub integration")
      }
    } catch (error) {
      console.error("Error connecting to GitHub:", error)
    }
  }

  return (
    <section className="ml-48 mt-20 bg-background text-gray-color">
      <div className="flex flex-col items-start">
        <div className="max-w-6xl">
          <div className="space-y-2">
            <h1 className="text-[30px] font-medium text-white">Profile</h1>
            <p className="font-medium">manage your profile and integrations.</p>
            <div
              style={{ borderBottomColor: "rgba(38, 38, 38, 0.8)" }}
              className=" w-full border-b"
            ></div>
          </div>
          <div className="space-y-4 ">
            <h1 className="mt-8 text-xl font-medium text-white">Photo</h1>
            <ProfilePicture />
            <p className="font-medium">
              update photo. recommended size is 256x256 px.
            </p>
            <div
              style={{ borderBottomColor: "rgba(38, 38, 38, 0.8)" }}
              className=" w-full border-b border-gray-color "
            ></div>
          </div>
          <div className="space-y-4">
            <div className="my-8">
              <InfoBox />
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <div
            style={{ borderBottomColor: "rgba(38, 38, 38, 0.8)" }}
            className="border-b border-gray-color"
          ></div>
          <h1 className="mt-8 text-xl font-medium text-white">
            Personal Integrations
          </h1>
          <div className="flex flex-col items-start space-y-2">
            <h2 className="text-lg font-medium text-white">GitHub Integration</h2>
            {isGithubConnected ? (
              <p className="text-green-400">GitHub account connected successfully!</p>
            ) : (
              <button
                onClick={handleConnectGithub}
                className="mt-2 bg-blue-600 text-white py-2 px-4 rounded"
              >
                Connect GitHub
              </button>
            )}
          </div>
          <IntegrationList />
        </div>
      </div>
    </section>
  )
}

export default ProfilePage
