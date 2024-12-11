import { getSpaces } from "./spaces"

export async function getInitialData(session: string | null) {
  if (!session) return null

  try {
    const spaces = await getSpaces(session)
    return {
      spaces: JSON.parse(JSON.stringify(spaces)),
      session,
    }
  } catch (error) {
    console.error("Error fetching initial data:", error)
    return null
  }
}
