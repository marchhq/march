import { TwitterApi } from "twitter-api-v2";
import { XQueue } from "../../loaders/bullmq.loader.js";

const twitterClient = new TwitterApi({
    clientId: process.env.X_CLIENT_ID,
    clientSecret: process.env.X_CLIENT_SECRET
});

const CALLBACK_URL = process.env.X_CALLBACK_URL;

const tempOAuthStore = new Map();

export const redirectXOAuthLoginController = async (req, res) => {
    try {
        const { url, codeVerifier, state } = twitterClient.generateOAuth2AuthLink(CALLBACK_URL, {
            scope: ["tweet.read", "users.read", "bookmark.read", "offline.access"]
        });

        tempOAuthStore.set(state, {
            codeVerifier,
            timestamp: Date.now()
        });

        console.log("Redirect URL:", url);

        // Clean up expired entries
        cleanupTempStore();

        res.json({
            url
        });
    } catch (error) {
        console.error("Twitter OAuth Error:", error);
        res.status(500).json({
            message: "Error initiating Twitter OAuth",
            error: error.message
        });
    }
};

export const getXAccessTokenController = async (req, res) => {
    try {
        const { state, code } = req.query;
        const user = req.user;
        const storedData = tempOAuthStore.get(state);

        if (!storedData) {
            console.error("No stored data found for state:", state);
            throw new Error("Invalid or expired state parameter");
        }

        // Clean up stored data immediately after retrieving it
        tempOAuthStore.delete(state);

        const { client: loggedClient, accessToken, refreshToken } = await twitterClient.loginWithOAuth2({
            code,
            codeVerifier: storedData.codeVerifier,
            redirectUri: CALLBACK_URL
        });
        user.integration.x.accessToken = accessToken;
        user.integration.x.refreshToken = refreshToken;
        user.integration.x.connected = true;
        await user.save()

        await XQueue.add(
            "XQueue",
            {
                accessToken,
                userId: user._id
            }
        );

        res.json({
            message: "Twitter authentication successful",
            accessToken,
            refreshToken
        });
    } catch (error) {
        console.error("Error exchanging Twitter OAuth token:", error);
        res.status(500).json({
            message: "Error getting access token",
            error: error.message
        });
    }
};

// cleanup function to remove expired entries (older than 5 minutes)
function cleanupTempStore () {
    const fiveMinutes = 5 * 60 * 1000;
    const now = Date.now();

    for (const [state, data] of tempOAuthStore.entries()) {
        if (now - data.timestamp > fiveMinutes) {
            console.log("Removing expired state:", state);
            tempOAuthStore.delete(state);
        }
    }
}
