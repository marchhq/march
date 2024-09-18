"use server"

import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

export async function redirectNote(uuid: string) {
  revalidatePath("/space/notes")
  redirect(`/space/notes/${uuid}`)
}
