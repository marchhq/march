"use client"

import React from "react"

import { Icon } from "@iconify-icon/react"

import { useGoogleLogin } from "@react-oauth/google"
import { FRONTEND_URL } from "@/src/lib/constants/urls"

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
      className="flex items-center justify-center gap-2 bg-transparent w-fit p-1 font-semibold text-secondary-foreground hover-text"
    >
      <Icon icon="ri:google-fill" className="text-[20px]" />
      continue with google
    </button>
  )
}

export default GoogleLogin
