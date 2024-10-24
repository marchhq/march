import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const BACKEND_URL=  "http://localhost:8080"


export const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImE5YmMwNDQ0LTc4MTQtNGJlMC04NmZmLTFiNzRkNzRkZDAyOSIsImVtYWlsIjoibWFkaGF2c2luZ2gucmVsaXNoQGdtYWlsLmNvbSIsIm5hbWUiOiJNYWRoYXYgU2luZ2giLCJ0eXBlIjoiYWNjZXNzIiwicm9sZXMiOlsidXNlciJdLCJpYXQiOjE3MjkzOTkxOTQsImV4cCI6MTczMTk5MTE5NCwiYXVkIjoiaHR0cHM6Ly9tYXJjaC5jYXQiLCJpc3MiOiJNeUFwcFNlcnZpY2UifQ.OIER2QrFFh22lHu_lVHx1xhh2zb70vuHeawKOwkwX-s"
