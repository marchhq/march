import { useCallback } from "react"

import { useRouter } from "next/navigation"

import { FRONTEND_URL } from "../lib/constants/urls"

const useNotion = (redirectAfterAuth: string) => {
  const router = useRouter()

  const handleLogin = useCallback(async () => {
    try {
      const NOTION_CLIENT_ID = process.env.NEXT_PUBLIC_NOTION_CLIENT_ID
      const NOTION_REDIRECT_URI = `${FRONTEND_URL}/auth/notion`

      if (!NOTION_CLIENT_ID || !NOTION_REDIRECT_URI) {
        throw new Error("Notion Client ID or Redirect URI is not set")
      }

      const state = encodeURIComponent(
        JSON.stringify({ redirect: redirectAfterAuth })
      )

      const notionAuthUrl = `https://api.notion.com/v1/oauth/authorize?client_id=${NOTION_CLIENT_ID}&state=${state}&owner=user&response_type=code&redirect_uri=${NOTION_REDIRECT_URI}`
      console.log("Redirecting to Notion OAuth URL:")

      router.push(notionAuthUrl)
    } catch (err) {
      console.error("Failed to initiate Notion login:", err)
    }
  }, [router, redirectAfterAuth])

  return {
    handleLogin,
  }
}

export default useNotion
