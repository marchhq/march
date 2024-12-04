import { useCallback } from 'react'

import axios from 'axios'

import { BACKEND_URL } from '../lib/constants/urls'

export const useGitHubLogin = (session?: string) => {
  const handleLogin = useCallback(async () => {
    try {
      const GITHUB_CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID
      const GITHUB_SCOPE = 'user:email'

      if (!GITHUB_CLIENT_ID || !GITHUB_SCOPE) {
        throw new Error('github clientId not set')
      }

      const authUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&scope=${GITHUB_SCOPE}`

      window.location.href = authUrl
    } catch (error) {
      console.error('Failed to initiate GitHub login:', error)
    }
  }, [])

  const handleRevoke = useCallback(async () => {
    try {
      await axios.delete(`${BACKEND_URL}/github/revoke-access/`, {
        headers: {
          Authorization: `Bearer ${session}`
        }
      })
    } catch (error) {
      console.error('Failed to revoke Github Installation: ', error)
      throw error
    }
  }, [session])

  return { handleLogin, handleRevoke }
}
