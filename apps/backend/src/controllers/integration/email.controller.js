import { OauthEmailClient } from "../../loaders/google.loader.js";
import { getGmailAccessToken, createLabel, revokeGmailAccess, getValidGmailAccessToken } from "../../services/integration/email.service.js"
import { google } from "googleapis";
import { environment } from "../../loaders/environment.loader.js";
import { User } from "../../models/core/user.model.js";
import { Object } from "../../models/lib/object.model.js";
import { saveContent } from "../../utils/helper.service.js";
import { broadcastToUser } from "../../loaders/websocket.loader.js";

// Webhook to handle incoming push notifications from Gmail
const handlePushNotification = async (req, res) => {
    try {
        const message = Buffer.from(req.body.message.data, "base64").toString("utf-8");
        const parsedMessage = JSON.parse(message);
        const userEmail = parsedMessage.emailAddress;

        const user = await User.findOne({ "integration.gmail.email": userEmail });
        if (!user) {
            console.error("User not found for the incoming Gmail push notification.");
            return res.status(404).send();
        }

        // Ensure we have a valid access token
        const accessToken = await getValidGmailAccessToken(user);

        const OauthEmailClient = new google.auth.OAuth2();
        OauthEmailClient.setCredentials({ access_token: accessToken });

        const gmail = google.gmail({ version: 'v1', auth: OauthEmailClient });

        // Retrieve the email history since the last history ID
        const historyResponse = await gmail.users.history.list({
            userId: "me",
            startHistoryId: user.integration.gmail.historyId,
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

const setupPushNotificationsController = async (req, res) => {
    const user = req.user;
    const accessToken = user.integration.gmail.accessToken;
    const refreshToken = user.integration.gmail.refreshToken;
    const labelId = user.integration.gmail.labelId;

    try {
        OauthEmailClient.setCredentials({ access_token: accessToken, refresh_token: refreshToken });
        const gmail = google.gmail({ version: 'v1', auth: OauthEmailClient });

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
    const authUrl = OauthEmailClient.generateAuthUrl({
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

        OauthEmailClient.setCredentials({ access_token: tokenInfo.access_token, refresh_token: tokenInfo.refresh_token });

        const gmail = google.gmail({ version: 'v1', auth: OauthEmailClient });
        const profileResponse = await gmail.users.getProfile({ userId: 'me' });
        const email = profileResponse.data.emailAddress;
        console.log("email: ", email);
        const labelId = await createLabel(OauthEmailClient, 'march_inbox');

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

const revokeGmailAccessController = async (req, res, next) => {
    const user = req.user;
    try {
        await revokeGmailAccess(user);

        res.status(200).json({
            message: 'Gmail access revoked successfully.'
        });
    } catch (err) {
        console.error('Error revoking Gmail access:', err);
        next(err);
    }
};

export {
    redirectGmailOAuthLoginController,
    getGmailAccessTokenController,
    createLabel,
    setupPushNotificationsController,
    handlePushNotification,
    revokeGmailAccessController
};
