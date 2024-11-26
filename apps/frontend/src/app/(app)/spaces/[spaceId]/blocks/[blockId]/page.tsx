import { redirect } from "next/navigation"

interface BlocksPageProps {
  params: {
    spaceId: string
    blockId: string
  }
}

export async function BlocksPage({ params }: BlocksPageProps) {
  redirect(`/spaces/${params.spaceId}/blocks/${params.blockId}/items`)
}
