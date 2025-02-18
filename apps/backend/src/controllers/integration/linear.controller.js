import { environment } from "../../loaders/environment.loader.js";
import {
    getAccessToken,
    fetchUserInfo,
    handleWebhookEvent,
    revokeLinearAccess
} from "../../services/integration/linear.service.js";
import { linearQueue } from "../../loaders/bullmq.loader.js";
import * as crypto from "crypto";

/**
 * Controller to handle the retrieval of an access token from Linear.
 *
 * @param {Object} req - The request object, containing query parameters and user info.
 * @param {Object} res - The response object, used to send back the access token or error messages.
 * @param {Function} next - The next middleware function in the Express.js stack, used for error handling.
 * @returns {Promise<void>}
 * @throws Will pass an error to the next middleware if any step fails.
 */

const getAccessTokenController = async (req, res, next) => {
    const { code } = req.query;
    const user = req.user;
    if (!code || !user) {
        return res
            .status(400)
            .json({ error: "Authorization code or user information is missing." });
    }
    try {
        const accessToken = await getAccessToken(code, user);
        const userInfo = await fetchUserInfo(accessToken, user);

        await linearQueue.add(
            "fetchIssues",
            {
                type: "fetchIssues",
                accessToken,
                linearUserId: userInfo.id,
                userId: user._id
            },
            {
                attempts: 3,
                backoff: 1000,
                timeout: 30000
            }
        );

        res.status(200).json({
            accessToken
        });
    } catch (err) {
        next(err);
    }
};

const handleWebhook = async (req, res, next) => {
    const rawBody = req.body.toString();
    const payload = JSON.parse(rawBody);
    const signature = crypto
        .createHmac("sha256", environment.LINER_WEBHOOK_SECRET)
        .update(rawBody)
        .digest("hex");
    if (signature !== req.headers["linear-signature"]) {
        res.sendStatus(400);
        return;
    }

    try {
        await handleWebhookEvent(payload);
        res.status(200).send("Webhook event processed");
    } catch (err) {
        next(err);
    }
};

/**
 * Revokes a user's Linear access.
 *
 * @param {Object} req - Request with user info.
 * @param {Object} res - Response with success message.
 * @param {Function} next - Error handling middleware.
 */
const revokeLinearAccessController = async (req, res, next) => {
    const user = req.user;

    try {
        await revokeLinearAccess(user.integration.linear.accessToken);

        // Clear Linear integration data
        user.integration.linear = {
            accessToken: null,
            userId: null,
            connected: false
        };
        await user.save();

        res.status(200).json({ message: "Linear access revoked successfully" });
    } catch (err) {
        console.error("Error revoking Linear access:", err);
        next(err);
    }
};

export {
    getAccessTokenController,
    handleWebhook,
    revokeLinearAccessController
};
