import * as React from "react"

import { SignedIn, UserProfile } from "@clerk/nextjs"

const ProfilePage: React.FC = () => {
  return (
    <main className="grid min-h-screen place-content-center">
      <section className="flex min-h-screen items-center">
        <SignedIn>
          <UserProfile />
        </SignedIn>
      </section>
    </main>
  )
}

export default ProfilePage
