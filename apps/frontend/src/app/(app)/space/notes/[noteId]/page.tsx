import NotesPage from "@/src/components/Notes/NotesPage"
import generateMetadataHelper from "@/src/utils/seo"

export async function generateMetadata(props: {
  params: Promise<{ noteId: string }>
}) {
  const params = await props.params
  const id = params.noteId
  const path = `/space/notes/${id}`
  const title = `Notes`

  return generateMetadataHelper({
    path,
    title,
  })
}

export default async function Notes(props: {
  params: Promise<{ noteId?: string }>
}) {
  const params = await props.params
  if (!params.noteId) {
    console.log("noteId is undefined")
    return null
  }

  return <NotesPage noteId={params.noteId} />
}
