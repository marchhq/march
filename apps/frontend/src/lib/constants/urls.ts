const LOCAL_BACKEND = "http://localhost:8080"

const LOCAL_FRONTEND = "http://localhost:3000"

const ENV_BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL

const ENV_FRONTEND_URL = process.env.NEXT_PUBLIC_FRONTEND_URL

export const BACKEND_URL = ENV_BACKEND_URL ?? LOCAL_BACKEND

export const FRONTEND_URL = ENV_FRONTEND_URL ?? LOCAL_FRONTEND

export const APP_ENV = process.env.NEXT_PUBLIC_APP_ENV
