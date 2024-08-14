import { OauthClient } from "../../loaders/google.loader.js";

const getGmailAccessToken = async (code, user) => {
    const { tokens } = await OauthClient.getToken(code);
    OauthClient.setCredentials(tokens);
    return tokens;
};

export {
    getGmailAccessToken
}
