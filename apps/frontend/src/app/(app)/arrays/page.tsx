import { redirect } from "next/navigation"

import { getArrays } from "@/src/lib/server/actions/array"
import { getSession } from "@/src/lib/server/actions/sessions"

export default async function ArraysPage() {
  const session = await getSession()

  const arrays = await getArrays(session)

  if (arrays.length === 0) {
    redirect("/today")
  }

  redirect(`/arrays/${arrays[0]._id}`)
}
