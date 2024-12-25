import { redirect } from "next/navigation"

import { getSession } from "@/src/lib/server/actions/sessions"
import getTypes from "@/src/lib/server/actions/types"

export async function generateStaticParams() {
  const session = await getSession()
  const types = await getTypes(session)

  return types.map((type) => ({
    slug: type.slug,
  }))
}

export default async function ObjectPage() {
  const session = getSession()
  const types = await getTypes(session)

  if (types.length > 0) {
    redirect(`/objects/${types[0].slug}`)
  }

  return <div>no types found</div>
}
