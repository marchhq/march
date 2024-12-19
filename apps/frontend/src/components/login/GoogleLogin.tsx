"use client"

import React from "react"

import { Icon } from "@iconify-icon/react"
import { useGoogleLogin } from "@react-oauth/google"

import { Button } from "../button/Button"
import { FRONTEND_URL } from "@/src/lib/constants/urls"

// const GoogleLogin = (): JSX.Element => {
//   const LoginWithGoogle = useGoogleLogin({
//     onError: () => {
//       console.error("Google login failed")
//     },
//     flow: "auth-code",
//     ux_mode: "redirect",
//     redirect_uri: `${FRONTEND_URL}/auth/google`,
//   })

//   return (
//     <Button onClick={LoginWithGoogle}>
//       <Icon icon="flat-color-icons:google" className="text-[14px]" />
//       Continue with Google
//     </Button>
//   )
// }

const GoogleLogin = (): JSX.Element => {
  const isTauriApp = (): boolean => navigator.userAgent.includes("Tauri")

  const LoginWithGoogle = useGoogleLogin({
    onError: () => {
      console.error("Google login failed")
    },
    flow: "auth-code",
    ux_mode: "redirect",
    redirect_uri: isTauriApp()
      ? "myapp://auth/google"
      : `${FRONTEND_URL}/auth/google`,
  })

  return (
    <Button onClick={LoginWithGoogle}>
      <Icon icon="flat-color-icons:google" className="text-[14px]" />
      Continue with Google
    </Button>
  )
}

export default GoogleLogin
