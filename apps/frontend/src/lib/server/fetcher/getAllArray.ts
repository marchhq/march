import { User } from "../../@types/auth/user"
import {  Arrays } from "../../@types/Items/Array"
import { USER_ARRAYS, USER_PROFILE } from "../../constants/urls"

export const getAllArray = async (
  accessToken: string
): Promise<Arrays | null> => {
  try {
    const response = await fetch(USER_ARRAYS, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!response.ok) {
      return null
    }

    const data = await response.json()

    const arrays: Arrays = data.arrays

    return arrays
  } catch (error) {
    console.error("Error:", error)
    return null
  }
}
