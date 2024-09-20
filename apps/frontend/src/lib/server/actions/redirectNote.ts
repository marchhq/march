"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function redirectNote(uuid: string) {
  revalidatePath("/space/notes")
  redirect(`/space/notes/${uuid}`)
}
