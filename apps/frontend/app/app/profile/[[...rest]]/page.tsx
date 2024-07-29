import * as React from "react"

import { SignedIn, UserProfile } from "@clerk/nextjs"

const ProfilePage: React.FC = () => {
  return (
    <section className="grid h-full place-content-center overflow-y-auto rounded-xl border border-white/10 bg-white/10 shadow-lg backdrop-blur-lg">
      <SignedIn>
        <UserProfile
          appearance={{
            variables: {
              colorBackground: "transparent",
              colorInputBackground: "transparent",
              fontFamilyButtons: "var(--sans-font)",
            },
          }}
        />
      </SignedIn>
    </section>
  )
}

export default ProfilePage
