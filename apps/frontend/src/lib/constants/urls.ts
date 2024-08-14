const LOCAL_URL = "http://localhost:8000"

const ENV_BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL

export const BACKEND_URL = ENV_BACKEND_URL ?? LOCAL_URL
