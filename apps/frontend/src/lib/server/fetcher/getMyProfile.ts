import { User } from "../../@types/auth/user"
import { USER_PROFILE } from "../../constants/urls"

export const getUserProfile = async (
  accessToken: string
): Promise<User | null> => {
  try {
    const response = await fetch(USER_PROFILE, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!response.ok) {
      return null
    }

    const data = await response.json()

    const user: User = data

    return user
  } catch (error) {
    console.error("Error:", error)
    return null
  }
}
