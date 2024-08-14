import { OauthClient } from "../../loaders/google.loader.js";
import { getGmailAccessToken, createLabel } from "../../services/integration/email.service.js"
import { google } from "googleapis";
import { environment } from "../../loaders/environment.loader.js";
import { createItem } from "../../services/lib/item.service.js";

async function processGmailNotification (req, res) {
    const data = req.body
    const decodedData = JSON.parse(Buffer.from(data.message.data, 'base64').toString());
    console.log("Decoded data:", decodedData);

    const { historyId } = decodedData;
    try {
        // OauthClient.setCredentials({ access_token: accessToken, refresh_token: refreshToken });

        const gmail = google.gmail({ version: 'v1', auth: OauthClient });

        const response = await gmail.users.history.list({
            userId: 'me',
            startHistoryId: historyId,
            historyTypes: ['labelAdded']
        });
        // console.log("response: ", response.data);

        const history = response.data.history || [];
        // console.log("history: ", history);
        for (const record of history) {
            if (record.labelsAdded) {
                for (const labelAdded of record.labelsAdded) {
                    if (labelAdded.labelIds.includes('Label_10')) {
                        await createIssueFromEmail(labelAdded.message.id, OauthClient);
                    }
                }
            }
        }
    } catch (error) {
        console.error('Error processing Gmail notification:', error);
    }
}

async function createIssueFromEmail (messageId, auth) {
    console.log("i am crrate from issee");

    const gmail = google.gmail({ version: 'v1', auth });

    try {
        const message = await gmail.users.messages.get({
            userId: 'me',
            id: messageId
        });
        // console.log("mes: ", message.data.payload);

        const subject = message.data.payload.headers.find(header => header.name === 'Subject').value;
        const from = message.data.payload.headers.find(header => header.name === 'From').value;
        const snippet = message.data.snippet;

        console.log("subject1: ", subject);
        console.log("from: ", from);
        console.log("snippet: ", snippet);
        // Create an issue in your system
        const issue = await createItem('sajda@march.cat', {
            title: subject,
            description: snippet
            // Add other relevant fields
        });

        console.log('Created issue:', issue);
    } catch (error) {
        console.error('Error creating issue from email:', error);
    }
}

const setupPushNotificationsController = async (req, res) => {
    const user = req.user;
    const accessToken = user.integration.gmail.accessToken;
    const refreshToken = user.integration.gmail.refreshToken;
    const labelId = user.integration.gmail.labelId;

    try {
        OauthClient.setCredentials({ access_token: accessToken, refresh_token: refreshToken });

        const gmail = google.gmail({ version: 'v1', auth: OauthClient });

        const watchResponse = await gmail.users.watch({
            userId: 'me',
            requestBody: {
                topicName: environment.TOPIC_NAME,
                labelIds: [labelId],
                labelFilterBehavior: "INCLUDE"
            }
        });

        console.log('Watch response:', watchResponse.data);
        res.status(200).json({ message: 'Push notifications set up successfully', data: watchResponse.data });
    } catch (error) {
        console.error('Error setting up push notifications:', error);
        res.status(500).json({ error: 'Failed to set up push notifications', details: error.message });
    }
};

const redirectGmailOAuthLoginController = (req, res) => {
    const authUrl = OauthClient.generateAuthUrl({
        access_type: 'offline',
        scope: ['https://www.googleapis.com/auth/gmail.modify']
    });
    console.log("auth: ", authUrl);
    res.redirect(authUrl);
};

const getGmailAccessTokenController = async (req, res, next) => {
    const { code } = req.query;
    const user = req.user;
    try {
        const tokenInfo = await getGmailAccessToken(code, user);

        OauthClient.setCredentials({ access_token: tokenInfo.access_token, refresh_token: tokenInfo.refresh_token });

        // creating label
        const labelId = await createLabel(OauthClient, 'march_inbox');

        user.integration.gmail.accessToken = tokenInfo.access_token;
        user.integration.gmail.refreshToken = tokenInfo.refresh_token;
        user.integration.gmail.labelId = labelId;
        await user.save();
        res.status(200).json({
            tokenInfo
        });
    } catch (err) {
        next(err);
    }
};

export {
    redirectGmailOAuthLoginController,
    getGmailAccessTokenController,
    createLabel,
    setupPushNotificationsController,
    processGmailNotification
}
