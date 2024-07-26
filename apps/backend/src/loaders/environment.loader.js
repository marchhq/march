import { config } from "dotenv";

config()

export const environment = {
    DB_USER: process.env.DB_USER,
    DB_PASS: process.env.DB_PASS,
    DB_NAME: process.env.DB_NAME,
    MONGO: process.env.MONGO,
    DB_HOST: process.env.DB_HOST,
    PORT: process.env.PORT || 8080,
    JWT_ISSUER: process.env.JWT_ISSUER,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_AUDIENCE: process.env.JWT_AUDIENCE,
    JWT_EXPIRY: '30d',
    SHOW_ADMIN: process.env.SHOW_ADMIN,
    WEB_HOST: process.env.WEB_HOST,
    SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    GOOGLE_REDIRECT_URL: process.env.GOOGLE_REDIRECT_URL,
    LINEAR_CLIENT_ID: process.env.LINEAR_CLIENT_ID,
    LINEAR_CLIENT_SECRET: process.env.LINEAR_CLIENT_SECRET,
    LINEAR_REDIRECT_URL: process.env.LINEAR_REDIRECT_URL,
    CLERK_PUBLISHABLE_KEY: process.env.CLERK_PUBLISHABLE_KEY,
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
    TOPIC_NAME: process.env.TOPIC_NAME,
    NGROK_AUTH_TOKEN: process.env.NGROK_AUTH_TOKEN
}
