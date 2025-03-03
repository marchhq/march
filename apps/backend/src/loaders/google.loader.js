import { OAuth2Client } from "google-auth-library";
import { environment } from "./environment.loader.js";

const client = new OAuth2Client(
    environment.GOOGLE_CLIENT_ID,
    environment.GOOGLE_CLIENT_SECRET,
    environment.GOOGLE_REDIRECT_URL
);

const OauthCalClient = new OAuth2Client(
    environment.GOOGLE_CLIENT_ID,
    environment.GOOGLE_CLIENT_SECRET,
    environment.GOOGLE_CALENDAR_REDIRECT_URL
);

const OauthEmailClient = new OAuth2Client(
    environment.GOOGLE_CLIENT_ID,
    environment.GOOGLE_CLIENT_SECRET,
    environment.GOOGLE_EMAIL_REDIRECT_URL
);

const OauthClient = client;

export { OauthClient, OauthCalClient, OauthEmailClient };
