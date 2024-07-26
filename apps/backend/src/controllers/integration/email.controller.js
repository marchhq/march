import { OauthClient } from "../../loaders/google.loader.js";
import { getGmailAccessToken } from "../../services/integration/email.service.js"
import { google } from "googleapis";
import { clerk } from "../../middlewares/clerk.middleware.js";
import { environment } from "../../loaders/environment.loader.js";
import { createItem } from "../../services/lib/item.service.js";

const accessToken = ""
const refreshToken = ""

async function processGmailNotification (req, res) {
    const data = req.body
    const decodedData = JSON.parse(Buffer.from(data.message.data, 'base64').toString());
    console.log("Decoded data:", decodedData);

    const { historyId } = decodedData;
    try {
        OauthClient.setCredentials({ access_token: accessToken, refresh_token: refreshToken });

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
    const user = await clerk.users.getUser(req.auth.userId);
    const accessToken = user.privateMetadata.integration.gmail.accessToken;
    const refreshToken = user.privateMetadata.integration.gmail.refreshToken

    try {
        OauthClient.setCredentials({ access_token: accessToken, refresh_token: refreshToken });

        const gmail = google.gmail({ version: 'v1', auth: OauthClient });

        const watchResponse = await gmail.users.watch({
            userId: 'me',
            requestBody: {
                topicName: environment.TOPIC_NAME,
                labelIds: ['Label_10']
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
    const user = req.auth.userId
    try {
        const tokenInfo = await getGmailAccessToken(code, user);

        OauthClient.setCredentials({ access_token: tokenInfo.access_token, refresh_token: tokenInfo.refresh_token });

        // creating label
        labelId = await createLabel(OauthClient, 'march_inbox');
        // await createLabel(OauthClient, 'march_today');
        res.status(200).json({
            statusCode: 200,
            response: tokenInfo
        });
    } catch (err) {
        next(err);
    }
};

const createLabel = async (OauthClient, labelName) => {
    try {
        // Check if label exists
        const gmail = google.gmail({ version: 'v1', auth: OauthClient });

        const existingLabels = await gmail.users.labels.list({ userId: 'me' });
        // console.log("existingLabels: ", existingLabels.data.labels);
        const labelExists = existingLabels.data.labels.some(label => label.name === labelName);
        console.log("labelExists: ", existingLabels.data.labels);
        let label;
        if (!labelExists) {
            label = await gmail.users.labels.create({
                userId: 'me',
                requestBody: {
                    labelListVisibility: 'labelShow',
                    messageListVisibility: 'show',
                    name: labelName
                }
            });
        } else {
            console.log(`Label '${labelName}' already exists.`);
        }
        console.log("label: ", label);
        return label.data.id;
    } catch (error) {
        console.error(`Error creating/checking label ${labelName}:`, error);
    }
};

// const createLabel = async (labelName) => {
//     try {
//         const response = await gmail.users.labels.create({
//             userId: 'me',
//             requestBody: {
//                 name: labelName,
//                 labelListVisibility: 'labelShow',
//                 messageListVisibility: 'show'
//             }
//         });
//         // console.log('Label created:', response.data);
//         return response.data.id;
//     } catch (error) {
//         if (error.code === 409) {
//             console.log('Label already exists');
//         } else {
//             console.error('Error creating label:', error);
//         }
//     }
// }

// console.log("labelId: ", labelId);

const createGmailLabelsController = async (req, res) => {
    const user = req.auth.userId;
    const { accessToken, refreshToken } = user.integration.gmail;
    OauthClient.setCredentials({ access_token: accessToken, refresh_token: refreshToken });
    await createLabel(OauthClient, 'cat_inbox');
    // await createLabel(OauthClient, 'cat_today');

    res.send('Labels created or already existed');
};

export {
    redirectGmailOAuthLoginController,
    getGmailAccessTokenController,
    createLabel,
    createGmailLabelsController,
    setupPushNotificationsController,
    processGmailNotification
}
