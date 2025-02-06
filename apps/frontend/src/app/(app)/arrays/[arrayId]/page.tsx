import { getArrayById } from "@/src/lib/server/actions/array"
import { getSession } from "@/src/lib/server/actions/sessions"

type Params = Promise<{ arrayId: string }>
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

export default async function ArrayPage(props: {
  params: Params
  searchParams: SearchParams
}) {
  const params = await props.params
  const session = await getSession()
  const array = await getArrayById(session, params.arrayId)

  return <h1>{array[0].name} Array</h1>
}
