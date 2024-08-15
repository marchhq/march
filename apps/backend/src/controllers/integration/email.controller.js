import { OauthClient } from "../../loaders/google.loader.js";
import { getGmailAccessToken, createLabel } from "../../services/integration/email.service.js"
import { google } from "googleapis";
import { environment } from "../../loaders/environment.loader.js";
import { createItem } from "../../services/lib/item.service.js";
import { User } from "../../models/core/user.model.js";

// async function processGmailNotification (req, res) {
//     const data = req.body
//     const decodedData = JSON.parse(Buffer.from(data.message.data, 'base64').toString());
//     // console.log("Decoded data:", decodedData);

//     const { historyId } = decodedData;
//     console.log("historyId: ", historyId);
//     try {
//         const user = await User.findOne({ 'integration.gmail.historyId': historyId });
//         if (!user) {
//             return res.status(404).json({ error: 'User not found' });
//         }
//         console.log("user: ", user);
//         // OauthClient.setCredentials({ access_token: accessToken, refresh_token: refreshToken });

//         const gmail = google.gmail({ version: 'v1', auth: OauthClient });

//         const response = await gmail.users.history.list({
//             userId: 'me',
//             startHistoryId: historyId,
//             historyTypes: ['labelAdded']
//         });
//         // console.log("response: ", response.data);

//         const history = response.data.history || [];
//         // console.log("history: ", history);
//         for (const record of history) {
//             if (record.labelsAdded) {
//                 for (const labelAdded of record.labelsAdded) {
//                     if (labelAdded.labelIds.includes('Label_10')) {
//                         await createIssueFromEmail(labelAdded.message.id, OauthClient);
//                     }
//                 }
//             }
//         }
//     } catch (error) {
//         console.error('Error processing Gmail notification:', error);
//     }
// }

// const handleGmailWebhook = async (req, res) => {

//     const data = req.body
//     const decodedData = JSON.parse(Buffer.from(data.message.data, 'base64').toString());
//     // console.log("Decoded data:", decodedData);

//     const { historyId } = decodedData;
//     console.log("historyId: ", historyId);
//     const user = await User.findOne({ 'integration.gmail.historyId': { $lte: historyId } });

//     if (!user) {
//         return res.status(404).json({ message: 'User not found' });
//     }
//     console.log("user: ", user);
//     const { accessToken, refreshToken, labelId } = user.integration.gmail;
//     OauthClient.setCredentials({ access_token: accessToken, refresh_token: refreshToken });

//     const gmail = google.gmail({ version: 'v1', auth: OauthClient });

//     try {
//         // Fetch history from Gmail starting from the stored historyId
//         const historyResponse = await gmail.users.history.list({
//             userId: 'me',
//             startHistoryId: user.integration.gmail.historyId,
//             labelId,
//         });

//         const messages = historyResponse.data.history.reduce((acc, hist) => {
//             if (hist.messagesAdded) {
//                 return acc.concat(hist.messagesAdded);
//             }
//             return acc;
//         }, []);

//         for (const message of messages) {
//             const emailData = await gmail.users.messages.get({
//                 userId: 'me',
//                 id: message.message.id,
//             });

//             // Process the email and create an issue
//             await createIssueFromEmail(emailData.data, user);
//         }

//         // Update the stored historyId to the latest value returned by the API
//         if (historyResponse.data.historyId) {
//             user.integration.gmail.historyId = historyResponse.data.historyId;
//             await user.save();
//         }

//         res.status(200).json({ message: 'Webhook processed successfully' });
//     } catch (error) {
//         console.error('Error processing Gmail webhook:', error);
//         res.status(500).json({ error: 'Failed to process webhook', details: error.message });
//     }
// };


async function createIssueFromEmail(email, user) {
    const subject = email.payload.headers.find(header => header.name === 'Subject').value;

    const issue = new Item({
        title: subject,
        type: 'gmailIssue',
        user: user._id,
        description: 'Issue created from Gmail label',
        createdAt: new Date(),
        updatedAt: new Date(),
    });

    await issue.save();
    console.log('Issue created from email:', issue);
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
        user.integration.gmail.historyId = watchResponse.data.historyId;
        await user.save();
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

// const getGmailAccessTokenController = async (req, res, next) => {
//     const { code } = req.query;
//     const user = req.user;
//     try {
//         const tokenInfo = await getGmailAccessToken(code, user);

//         OauthClient.setCredentials({ access_token: tokenInfo.access_token, refresh_token: tokenInfo.refresh_token });

//         // creating label
//         const labelId = await createLabel(OauthClient, 'march_inbox');

//         user.integration.gmail.accessToken = tokenInfo.access_token;
//         user.integration.gmail.refreshToken = tokenInfo.refresh_token;
//         user.integration.gmail.labelId = labelId;
//         await user.save();
//         res.status(200).json({
//             tokenInfo
//         });
//     } catch (err) {
//         next(err);
//     }
// };
const getGmailAccessTokenController = async (req, res, next) => {
    const { code } = req.query;
    const user = req.user;

    try {
        const tokenInfo = await getGmailAccessToken(code, user);

        OauthClient.setCredentials({ access_token: tokenInfo.access_token, refresh_token: tokenInfo.refresh_token });

        const gmail = google.gmail({ version: 'v1', auth: OauthClient });
        const profileResponse = await gmail.users.getProfile({ userId: 'me' });

        const email = profileResponse.data.emailAddress;

        const labelId = await createLabel(OauthClient, 'march_inbox');


        user.integration.gmail.email = email;
        user.integration.gmail.accessToken = tokenInfo.access_token;
        user.integration.gmail.refreshToken = tokenInfo.refresh_token;
        user.integration.gmail.labelId = labelId;

        await user.save();

        res.status(200).json({ tokenInfo });
    } catch (err) {
        next(err);
    }
};

export {
    redirectGmailOAuthLoginController,
    getGmailAccessTokenController,
    createLabel,
    setupPushNotificationsController,
    handleGmailWebhook
}
