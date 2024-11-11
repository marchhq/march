import NotesPage from "@/src/components/Notes/NotesPage"
import generateMetadataHelper from "@/src/utils/seo"

export async function generateMetadata({
  params,
}: {
  params: { noteId: string }
}) {
  const id = params.noteId
  const path = `/space/notes/${id}`
  const title = `Notes`

  return generateMetadataHelper({
    path,
    title,
  })
}

export default function Notes({ params }: { params: { noteId?: string } }) {
  if (!params.noteId) {
    console.log("noteId is undefined")
    return null
  }

  return <NotesPage noteId={params.noteId} />
}
