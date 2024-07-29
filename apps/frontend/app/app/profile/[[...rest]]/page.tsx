import * as React from "react"

import { SignedIn, UserProfile } from "@clerk/nextjs"

const ProfilePage: React.FC = () => {
  return (
    <section className="h-full overflow-y-auto rounded-xl border border-white/10 bg-white/10 px-6 pt-16 shadow-lg backdrop-blur-lg">
      <SignedIn>
        <UserProfile />
      </SignedIn>
    </section>
  )
}

export default ProfilePage
