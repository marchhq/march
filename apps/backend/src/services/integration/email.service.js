import { OauthClient } from "../../loaders/google.loader.js";
import { clerk } from "../../middlewares/clerk.middleware.js";

const getGmailAccessToken = async (code, user) => {
    const { tokens } = await OauthClient.getToken(code);
    OauthClient.setCredentials(tokens);

    // user.integration.gmail.accessToken = tokens.access_token;
    // user.integration.gmail.refreshToken = tokens.refresh_token;

    await clerk.users.updateUserMetadata(user, {
        privateMetadata: {
            integration: {
                gmail: {
                    accessToken: tokens.access_token,
                    refreshToken: tokens.refresh_token
                }
            }
        }
    });

    // await user.save();
    return tokens;
};

export {
    getGmailAccessToken
}
