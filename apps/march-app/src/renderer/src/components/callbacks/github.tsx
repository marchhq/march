import { ACCESS_TOKEN, REFRESH_TOKEN } from '@renderer/lib/constants/cookie'
import { BACKEND_URL } from '@renderer/lib/constants/urls'
import axios from 'axios'
import Cookies from 'js-cookie'
import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router'

export const GithubCallback = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  useEffect(() => {
    const code = searchParams.get('code')

    const handleCallback = async () => {
      if (!code) {
        console.error('No code received from GitHub')
        navigate('/login?error=no_code')
        return
      }

      try {
        const response = await axios.get(`${BACKEND_URL}/auth/github/login`, {
          params: { code }
        })

        const { accessToken, refreshToken, isNewUser } = response.data

        Cookies.set(ACCESS_TOKEN, accessToken, {
          secure: true,
          sameSite: 'lax',
          expires: 30, // 30 days
          path: '/'
        })

        Cookies.set(REFRESH_TOKEN, refreshToken, {
          secure: true,
          sameSite: 'lax',
          expires: 30, // 30 days
          path: '/'
        })

        navigate(isNewUser ? '/calendar' : '/today')
      } catch (error) {
        console.error('Error during GitHub authentication:', error)
        navigate('/login?error=authentication_failed')
      }
    }

    handleCallback()
  }, [searchParams, navigate])

  return (
    <div className="flex items-center justify-center min-h-screen">processing github login...</div>
  )
}
