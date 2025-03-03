import { OauthClient } from "../../loaders/google.loader.js";
import {
    getGmailAccessToken,
    createLabel
} from "../../services/integration/email.service.js";
import { google } from "googleapis";
import { environment } from "../../loaders/environment.loader.js";
import { User } from "../../models/core/user.model.js";
import { Object } from "../../models/lib/object.model.js";
import { saveContent } from "../../utils/helper.service.js";
import { broadcastToUser } from "../../loaders/websocket.loader.js";

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

// Webhook to handle incoming push notifications from Gmail
const handlePushNotification = async (req, res) => {
    // console.log("req.body: ", req.body);
    const message = Buffer.from(req.body.message.data, "base64").toString(
        "utf-8"
    );
    const parsedMessage = JSON.parse(message);
    const userEmail = parsedMessage.emailAddress;
    // console.log("userEmail: ", userEmail);

    const user = await User.findOne({ "integration.gmail.email": userEmail });
    if (!user) {
        console.error("User not found for the incoming Gmail push notification.");
        return res.status(404).send();
    }
    const accessToken = user.integration.gmail.accessToken;
    const refreshToken = user.integration.gmail.refreshToken;
    const historyId = user.integration.gmail.historyId;

    try {
        OauthClient.setCredentials({
            access_token: accessToken,
            refresh_token: refreshToken
        });
        const gmail = google.gmail({ version: "v1", auth: OauthClient });

        // Retrieve the email history since the last history ID
        const historyResponse = await gmail.users.history.list({
            userId: "me",
            startHistoryId: historyId,
            labelId: user.integration.gmail.labelId
        });

        if (historyResponse.data.history) {
            for (const historyRecord of historyResponse.data.history) {
                if (historyRecord.labelsAdded) {
                    for (const addedMessage of historyRecord.labelsAdded) {
                        const emailData = await gmail.users.messages.get({
                            userId: "me",
                            id: addedMessage.message.id
                        });
                        await createIssueFromEmail(emailData.data, user);
                    }
                }
            }
        }

        // Update the user's stored historyId
        user.integration.gmail.historyId = historyResponse.data.historyId;
        await user.save();
        res.status(200).send("Notification processed successfully");
    } catch (error) {
        console.error("Error processing Gmail notification:", error);
        res.status(500).send("Error processing notification");
    }
};

const createIssueFromEmail = async (email, user) => {
    let message = "";
    let action = null;
    let broadcastObject = null;
    const getEmailBody = (payload) => {
        let htmlContent = null;
        let plainTextContent = null;

        const extractText = (part) => {
            if (part.mimeType === "text/html" && part.body?.data) {
                htmlContent = Buffer.from(part.body.data, "base64").toString("utf-8");
            } else if (
                part.mimeType === "text/plain" &&
        part.body?.data &&
        !htmlContent
            ) {
                plainTextContent = Buffer.from(part.body.data, "base64").toString(
                    "utf-8"
                );
            }
            if (part.parts) {
                part.parts.forEach((subPart) => extractText(subPart));
            }
        };

        if (payload) {
            if (payload.mimeType === "multipart/alternative") {
                if (payload.parts) {
                    [...payload.parts].reverse().forEach((part) => extractText(part));
                }
            } else {
                extractText(payload);
            }
        }

        return (htmlContent || plainTextContent || "").trim();
    };

    try {
        const headers = email.payload.headers || [];
        const subject =
      headers.find((header) => header.name === "Subject")?.value ||
      "No Subject";
        const sender =
      headers.find((header) => header.name === "From")?.value ||
      "Unknown Sender";

        const emailBody = getEmailBody(email.payload);
        const emailUrl = `https://mail.google.com/mail/u/0/#inbox/${email.id}`;

        const metadata = {
            senderEmail: sender,
            url: emailUrl,
            receivedAt: new Date(parseInt(email.internalDate)).toISOString(),
            messageId: headers.find((header) => header.name === "Message-ID")?.value,
            references: headers.find((header) => header.name === "References")?.value
        };

        const existingIssue = await Object.findOne({
            id: email.id,
            source: "gmail",
            user: user._id
        });

        if (existingIssue) {
            Object.assign(existingIssue, {
                title: subject,
                description: emailBody,
                metadata,
                updatedAt: new Date()
            });
            await existingIssue.save();
            message = `Updated issue from email: ${subject}`;
            action = "update";
            broadcastObject = existingIssue;
            console.log("Updated existing issue:", existingIssue._id);
        } else {
            const newIssue = new Object({
                title: subject,
                source: "gmail",
                id: email.id,
                user: user._id,
                description: emailBody,
                metadata,
                createdAt: new Date(),
                updatedAt: new Date()
            });
            const savedIssue = await newIssue.save();
            await saveContent(savedIssue);
            message = `Created new issue from email: ${subject}`;
            action = "create";
            broadcastObject = savedIssue;
            console.log("Created new issue:", savedIssue._id);
        }
        if (user._id) {
            const broadcastData = {
                type: "gmail",
                message,
                action,
                item: broadcastObject
            };

            broadcastToUser(user._id.toString(), broadcastData, true);
        }

        return broadcastObject;
    } catch (error) {
        console.error("Error processing email:", error);
        throw error;
    }
};

// const setupPushNotificationsController = async (req, res) => {
//     const user = req.user;
//     const accessToken = user.integration.gmail.accessToken;
//     const refreshToken = user.integration.gmail.refreshToken;
//     const labelId = user.integration.gmail.labelId;

//     try {
//         OauthClient.setCredentials({ access_token: accessToken, refresh_token: refreshToken });

//         const gmail = google.gmail({ version: 'v1', auth: OauthClient });

//         const watchResponse = await gmail.users.watch({
//             userId: 'me',
//             requestBody: {
//                 topicName: environment.TOPIC_NAME,
//                 labelIds: [labelId],
//                 labelFilterBehavior: "INCLUDE"
//             }
//         });
//         user.integration.gmail.historyId = watchResponse.data.historyId;
//         await user.save();
//         console.log('Watch response:', watchResponse.data);
//         res.status(200).json({ message: 'Push notifications set up successfully', data: watchResponse.data });
//     } catch (error) {
//         console.error('Error setting up push notifications:', error);
//         res.status(500).json({ error: 'Failed to set up push notifications', details: error.message });
//     }
// };

// Controller to set up Gmail push notifications
const setupPushNotificationsController = async (req, res) => {
    const user = req.user;
    const accessToken = user.integration.gmail.accessToken;
    const refreshToken = user.integration.gmail.refreshToken;
    const labelId = user.integration.gmail.labelId;

    try {
        OauthClient.setCredentials({
            access_token: accessToken,
            refresh_token: refreshToken
        });
        const gmail = google.gmail({ version: "v1", auth: OauthClient });

        const watchResponse = await gmail.users.watch({
            userId: "me",
            requestBody: {
                topicName: environment.TOPIC_NAME,
                labelIds: [labelId],
                labelFilterBehavior: "INCLUDE"
            }
        });

        user.integration.gmail.historyId = watchResponse.data.historyId;
        await user.save();

        res
            .status(200)
            .json({
                message: "Push notifications set up successfully",
                data: watchResponse.data
            });
    } catch (error) {
        console.error("Error setting up push notifications:", error);
        res
            .status(500)
            .json({
                error: "Failed to set up push notifications",
                details: error.message
            });
    }
};

const redirectGmailOAuthLoginController = (req, res) => {
    const authUrl = OauthClient.generateAuthUrl({
        access_type: "offline",
        scope: ["https://www.googleapis.com/auth/gmail.modify"]
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

        OauthClient.setCredentials({
            access_token: tokenInfo.access_token,
            refresh_token: tokenInfo.refresh_token
        });

        const gmail = google.gmail({ version: "v1", auth: OauthClient });
        const profileResponse = await gmail.users.getProfile({ userId: "me" });
        const email = profileResponse.data.emailAddress;
        console.log("email: ", email);
        const labelId = await createLabel(OauthClient, "march_inbox");

        user.integration.gmail.email = email;
        user.integration.gmail.accessToken = tokenInfo.access_token;
        user.integration.gmail.refreshToken = tokenInfo.refresh_token;
        user.integration.gmail.labelId = labelId;
        user.integration.gmail.connected = true;

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
    handlePushNotification
};
