"use client"
import * as React from "react"

import { SignIn, useAuth } from "@clerk/nextjs"
import { redirect } from "next/navigation"

const Auth: React.FC = () => {
  const { isSignedIn } = useAuth()

  if (isSignedIn === true) {
    redirect("/app/today")
  } else {
    return (
      <main className="grid min-h-screen place-content-center">
        <section className="flex min-h-screen items-center">
          <SignIn forceRedirectUrl={"/app/today/"} />
        </section>
      </main>
    )
  }
}

export default Auth
