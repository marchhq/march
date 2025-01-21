import Block from "@/src/components/array/Block"
import { ACCESS_TOKEN } from "@/src/lib/constants/cookie"
import { cookies } from "next/headers"


interface PageProps {
  params: { [key: string]: string }
}

const Page: React.FC<PageProps> = async({ params }) => {
 
  const cookieStore = await cookies()
    
  const accessToken = cookieStore.get(ACCESS_TOKEN)?.value as string
  
  return (
    <div > <Block arrayId={params.array} token={accessToken} /> </div>
  )
}

export default Page
