"use client"

import React, { useState } from "react"

import { useGoogleLogin } from "@react-oauth/google"

import { useAuth } from "@/src/contexts/AuthContext"
import Google from "@/src/lib/icons/Google"
import Loader from "@/src/lib/icons/Loader"

const GoogleLogin = (): JSX.Element => {
  const { googleLogin } = useAuth()
  const [loading, setLoading] = useState<boolean>(false)

  const LoginWithGoogle = useGoogleLogin({
    onSuccess: async (response) => {
      setLoading(true)
      await googleLogin(response.code)
      setLoading(false)
    },
    onError: () => {
      console.error("Google login failed")
    },
    flow: "auth-code",
    // ux_mode: "redirect",
    // redirect_uri: `${BACKEND_URL}/api/auth/callback/google`,
  })

  return (
    <button
      onClick={LoginWithGoogle}
      disabled={loading}
      className="flex w-80 items-center justify-center gap-x-6 rounded-2xl border border-button-stroke bg-transparent p-2 text-black"
    >
      <Google />
      Continue with google
      {loading && (
        <div className="animate-spin">
          <Loader />
        </div>
      )}
    </button>
  )
}

export default GoogleLogin
