import { OauthEmailClient } from "../../loaders/google.loader.js";
import { google } from "googleapis";
import axios from "axios";

const getGmailAccessToken = async (code, user) => {
    const { tokens } = await OauthEmailClient.getToken(code);
    OauthEmailClient.setCredentials(tokens);
    return tokens;
};

const createLabel = async (OauthEmailClient, labelName) => {
    try {
        const gmail = google.gmail({ version: 'v1', auth: OauthEmailClient });

        const existingLabels = await gmail.users.labels.list({ userId: 'me' });
        const label = existingLabels.data.labels.find(label => label.name === labelName);
        if (label) {
            return label.id;
        }

        const newLabel = await gmail.users.labels.create({
            userId: 'me',
            requestBody: {
                labelListVisibility: 'labelShow',
                messageListVisibility: 'show',
                name: labelName
            }
        });

        return newLabel.data.id;
    } catch (error) {
        console.error(`Error creating/checking label ${labelName}:`, error);
    }
};

const refreshGmailAccessToken = async (user) => {
    OauthEmailClient.setCredentials({
        refresh_token: user.integration.gmail.refreshToken
    });

    const { credentials } = await OauthEmailClient.refreshAccessToken();

    user.integration.gmail.accessToken = credentials.access_token;
    if (credentials.refresh_token) {
        user.integration.gmail.refreshToken = credentials.refresh_token;
    }

    await user.save();

    return credentials.access_token;
};

const checkGmailAccessTokenValidity = async (accessToken) => {
    try {
        const response = await axios.get('https://www.googleapis.com/gmail/v1/users/me/profile', {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        if (response.status === 200) {
            return true;
        }
    } catch (error) {
        console.error("Error checking Gmail access token validity:", error);
    }
    return false;
};

const getValidGmailAccessToken = async (user) => {
    try {
        const isValid = await checkGmailAccessTokenValidity(user.integration.gmail.accessToken);

        if (!isValid) {
            console.log("Gmail access token expired, refreshing...");
            return await refreshGmailAccessToken(user);
        }
        return user.integration.gmail.accessToken;
    } catch (error) {
        console.error("Error checking Gmail access token validity:", error);
        throw error;
    }
};

const revokeGmailAccess = async (user) => {
    await fetch(`https://accounts.google.com/o/oauth2/revoke?token=${user.integration.gmail.accessToken}`, {
        method: "POST"
    });

    user.integration.gmail = undefined;
    await user.save();
};

export {
    getGmailAccessToken,
    createLabel,
    refreshGmailAccessToken,
    checkGmailAccessTokenValidity,
    getValidGmailAccessToken,
    revokeGmailAccess
}
