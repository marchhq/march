"use client"

import React from "react"

import { useGoogleLogin } from "@react-oauth/google"

import { FRONTEND_URL } from "@/src/lib/constants/urls"
import { GoogleColored } from "@/src/lib/icons/GoogleColored"

const GoogleLogin = (): JSX.Element => {
  const LoginWithGoogle = useGoogleLogin({
    onError: () => {
      console.error("Google login failed")
    },
    flow: "auth-code",
    ux_mode: "redirect",
    redirect_uri: `${FRONTEND_URL}/auth/google`,
  })

  return (
    <button
      onClick={LoginWithGoogle}
<<<<<<< HEAD
<<<<<<< HEAD
      className="flex w-96 items-center justify-center gap-x-6 rounded-2xl border border-button-stroke bg-transparent p-3 font-semibold text-black"
    >
      <GoogleColored />
      Continue with google
=======
      className="flex w-96 items-center justify-center gap-x-6 rounded-2xl border border-button-stroke bg-transparent p-3.5 font-semibold text-black"
    >
      <GoogleColored />
      Continue with Google
>>>>>>> 1cbb6a1 (added onboarding ui)
=======
      className="flex w-96 items-center justify-center gap-x-6 rounded-2xl border border-button-stroke bg-transparent p-3.5 font-semibold text-black"
    >
      <GoogleColored />
      Continue with Google
>>>>>>> 1cbb6a173a688ea32842d4f7155a8cfa45f8c94a
    </button>
  )
}

export default GoogleLogin
