'use client'

import { type JSX } from 'react'

import { useGoogleLogin } from '@react-oauth/google'
import { FRONTEND_URL } from '@renderer/lib/constants/urls'
import { Button } from '../buttons/button'
import { Icon } from '@iconify/react'

const GoogleLogin = (): JSX.Element => {
  const LoginWithGoogle = useGoogleLogin({
    onError: () => {
      console.error('Google login failed')
    },
    flow: 'auth-code',
    ux_mode: 'redirect',
    redirect_uri: `${FRONTEND_URL}/auth/google`
  })

  return (
    <Button onClick={LoginWithGoogle}>
      <Icon icon="flat-color-icons:google" className="text-[14px]" />
      Continue with Google
    </Button>
  )
}

export default GoogleLogin
