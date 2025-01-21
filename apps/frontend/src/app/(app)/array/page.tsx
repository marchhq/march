import RedirectLastWorkingArray from "@/src/components/array/RedirectLastWorkingArray"
import { ACCESS_TOKEN } from "@/src/lib/constants/cookie"
import { cookies } from "next/headers"

const page = async() => {
  const cookieStore = await cookies()

  const accessToken = cookieStore.get(ACCESS_TOKEN)?.value as string

  return <RedirectLastWorkingArray token={accessToken}/>
}

export default page
