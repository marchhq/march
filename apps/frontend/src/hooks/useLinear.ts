import { useCallback, useState } from "react"
import axios from "axios"
import { useAuth } from "../contexts/AuthContext"
import { BACKEND_URL } from "../lib/constants/urls"

interface LinearIssue {}

const useLinear = () => {
  const { session } = useAuth()
  const [issues, setIssues] = useState<LinearIssue[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const makeRequest = useCallback(async (url: string, config: object = {}) => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await axios.get(url, config)
      return response.data
    } catch (error) {
      console.error(`Error fetching data from ${url}:`, error)
      setError("An error occurred while fetching data. Please try again later.")
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [])

  const handleLogin = useCallback(async () => {
    try {
      const data = await makeRequest(`${BACKEND_URL}/linear/connect`, {
        headers: { Authorization: `Bearer ${session}` },
      })
      if (data.redirectUrl) {
        window.location.href = data.redirectUrl
      } else {
        throw new Error("No redirect URL received from the server")
      }
    } catch (error) {
      setError("Failed to initiate Linear login")
    }
  }, [session, makeRequest])

  const getAccessToken = useCallback(
    async (code: string) => {
      try {
        const data = await makeRequest(`${BACKEND_URL}/linear/getAccessToken`, {
          params: { code },
        })
        return data.accessToken
      } catch (error) {
        setError("Failed to get Linear access token")
        throw error
      }
    },
    [makeRequest]
  )

  const fetchIssues = useCallback(
    async (endpoint: string) => {
      try {
        const data = await makeRequest(
          `${BACKEND_URL}/linear/issues/${endpoint}`,
          {
            headers: { Authorization: `Bearer ${session}` },
          }
        )
        setIssues(data.issues)
      } catch (error) {
        setError(`Failed to fetch Linear issues from ${endpoint}`)
      }
    },
    [session, makeRequest]
  )

  return {
    handleLogin,
    getAccessToken,
    fetchMyIssues: () => fetchIssues("my"),
    fetchTodayIssues: () => fetchIssues("today"),
    fetchOverdueIssues: () => fetchIssues("overdue"),
    fetchIssuesByDate: (date: string) => fetchIssues(date),
    issues,
    isLoading,
    error,
  }
}

export default useLinear
