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
      className="flex w-96 items-center justify-center gap-x-6 rounded-2xl border border-button-stroke bg-transparent p-3.5 font-semibold text-black"
    >
      <GoogleColored />
      Continue with Google
    </button>
  )
}

export default GoogleLogin
