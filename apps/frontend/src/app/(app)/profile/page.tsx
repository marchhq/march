import React from "react"

import { Metadata } from "next"

import ProfilePage from "@/src/components/profile/Profile"
import generateMetadataHelper from "@/src/utils/seo"

export const metadata: Metadata = generateMetadataHelper({
  path: "/profile",
  title: "Profile",
  description: "engineered for makers",
})

const Profile: React.FC = () => {
  return <ProfilePage />
}

export default Profile
