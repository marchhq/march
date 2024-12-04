import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios, { AxiosError } from 'axios'
import Cookies from 'js-cookie'
import { BACKEND_URL } from '../../lib/constants/urls'
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../../lib/constants/cookie'
import { GoogleAuthResponse } from '../../lib/@types/auth/response'
import { IpcRendererEvent } from 'electron'

const GoogleCallback = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const handleCallback = (_: IpcRendererEvent, url: string) => {
      try {
        const urlObj = new URL(url)
        const code = urlObj.searchParams.get('code')

        if (!code) {
          navigate('/')
          return
        }

        handleGoogleAuth(code)
      } catch (error) {
        console.error('Invalid URL received:', url, error)
        navigate('/')
      }
    }

    window.electron.ipcRenderer.on('oauth-callback', handleCallback)

    return () => {
      window.electron.ipcRenderer.removeAllListeners('oauth-callback')
    }
  }, [navigate])

  const handleGoogleAuth = async (code: string) => {
    try {
      const { data } = await axios.post<GoogleAuthResponse>(
        `${BACKEND_URL}/auth/google/login`,
        null,
        {
          headers: {
            'x-google-auth': code
          }
        }
      )

      if (!data.accessToken) {
        console.error('Access token is missing from the response')
        navigate('/')
        return
      }

      // Set cookies
      Cookies.set(ACCESS_TOKEN, data.accessToken, {
        expires: 30, // 30 days
        secure: true,
        sameSite: 'lax',
        path: '/'
      })

      Cookies.set(REFRESH_TOKEN, data.refreshToken, {
        expires: 30, // 30 days
        secure: true,
        sameSite: 'lax',
        path: '/'
      })

      console.log('cookie was set')
      navigate(data.isNewUser ? '/calendar' : '/today')
    } catch (error) {
      const e = error as AxiosError
      if (e.response?.status === 401) {
        console.error('Google auth error: ', e.response.data)
      } else {
        console.error('Google auth error: ', e.cause)
      }
      navigate('/')
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>processing Google login...</p>
    </div>
  )
}

export default GoogleCallback
