import { OauthClient } from "../../loaders/google.loader.js";
import { google } from "googleapis";

const getGmailAccessToken = async (code, user) => {
    const { tokens } = await OauthClient.getToken(code);
    OauthClient.setCredentials(tokens);
    return tokens;
};

const createLabel = async (OauthClient, labelName) => {
    try {
        const gmail = google.gmail({ version: 'v1', auth: OauthClient });

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

export {
    getGmailAccessToken,
    createLabel
}
