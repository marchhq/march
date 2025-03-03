import { apiClient } from '@/lib/api'
import { useRouter } from 'next/navigation'
import { useCallback, useState } from 'react'
import { toast } from 'sonner'

interface UseLinearLoginReturn {
  handleLinearLogin: () => Promise<void>
  handleLinearRevoke: () => Promise<void>
  isLoading: boolean
  error: Error | null
}

export function useLinearLogin(
  redirectAfterAuth: string,
  redirectAfterRevoke: string = redirectAfterAuth
): UseLinearLoginReturn {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const router = useRouter()

  const handleLinearLogin = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const response = await fetch('/api/auth/linear')
      const data = await response.json()
      
      if (data.error) {
        throw new Error(data.error)
      }

      // Redirect to Linear's auth page
      window.location.href = data.authUrl
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to initialize Linear login'))
    } finally {
      setIsLoading(false)
    }
  }, [])

  const handleLinearRevoke = useCallback(async () => {

    try {
      const response = await apiClient.get('/linear/revoke-access/')

      if (!response) {
        throw new Error('failed to revoke linear access')
      }
      router.push(redirectAfterRevoke)
    } catch (error) {
      console.error('failed to revoke linear access', error)
      toast.error('Failed to revoke linear access')
    }

  }, [router, redirectAfterRevoke])

  return { handleLinearLogin, handleLinearRevoke, isLoading, error }
}