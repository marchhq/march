import { config } from "dotenv";

config()

export const environment = {
    DB_USER: process.env.DB_USER,
    DB_PASS: process.env.DB_PASS,
    DB_NAME: process.env.DB_NAME,
    DB_HOST: process.env.DB_HOST,
    PORT: process.env.PORT || 8080,
    JWT_ISSUER: process.env.JWT_ISSUER,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_AUDIENCE: process.env.JWT_AUDIENCE,
    JWT_EXPIRY: '30d',
    WEB_HOST: process.env.WEB_HOST,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    GOOGLE_REDIRECT_URL: process.env.GOOGLE_REDIRECT_URL,
    LINEAR_CLIENT_ID: process.env.LINEAR_CLIENT_ID,
    LINEAR_CLIENT_SECRET: process.env.LINEAR_CLIENT_SECRET,
    LINEAR_REDIRECT_URL: process.env.LINEAR_REDIRECT_URL,
    TOPIC_NAME: process.env.TOPIC_NAME,
    LINER_WEBHOOK_SECRET: process.env.LINER_WEBHOOK_SECRET,
    CALENDAR_WEBHOOK_SECRET: process.env.CALENDAR_WEBHOOK_SECRET,
    CALENDAR_WEBHOOK_URL: process.env.CALENDAR_WEBHOOK_URL,
    GITHUB_APP_PRIVATE_KEY: process.env.GITHUB_APP_PRIVATE_KEY,
    GITHUB_APP_ID: process.env.GITHUB_APP_ID,
    NGROK_AUTH_TOKEN: process.env.NGROK_AUTH_TOKEN,
    REDIS_DB_NAME: process.env.REDIS_HOST,
    REDIS_HOST: process.env.REDIS_HOST,
    REDIS_PORT: process.env.REDIS_PORT,
    REDIS_DB_USER: process.env.REDIS_DB_USER,
    REDIS_DB_PASS: process.env.REDIS_DB_PASS
}
