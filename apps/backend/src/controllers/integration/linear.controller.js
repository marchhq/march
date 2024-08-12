import { environment } from "../../loaders/environment.loader.js";
import { getAccessToken, getMyLinearIssues, fetchUserInfo, getTodayLinearIssues, getOverdueLinearIssues, getLinearIssuesByDate, handleWebhookEvent } from "../../services/integration/linear.service.js";
import { linearQueue } from "../../loaders/bullmq.loader.js";
import * as crypto from "crypto";

// const redirectLinearOAuthLoginController = (req, res, next) => {
//     try {
//         const authUrl = `https://linear.app/oauth/authorize?client_id=${environment.LINEAR_CLIENT_ID}&redirect_uri=${environment.LINEAR_REDIRECT_URL}&response_type=code`;
//         console.log("hey: ", authUrl);
//         res.redirect(authUrl);
//     } catch (err) {
//         console.error("Error in redirectLinearOAuthLoginController:", err);
//         next(err);
//     }
// };

const redirectLinearOAuthLoginController = (req, res, next) => {
    try {
        const scopes = "read write";
        const authUrl = `https://linear.app/oauth/authorize?client_id=${environment.LINEAR_CLIENT_ID}&redirect_uri=${environment.LINEAR_REDIRECT_URL}&response_type=code&scope=${encodeURIComponent(scopes)}`;
        console.log("Redirecting to Linear OAuth URL:", authUrl);
        res.redirect(authUrl);
    } catch (err) {
        console.error("Error in redirectLinearOAuthLoginController:", err);
        next(err);
    }
};

const getAccessTokenController = async (req, res, next) => {
    const { code } = req.query;
    const user = req.auth.userId
    try {
        const accessToken = await getAccessToken(code, user);
        const userInfo = await fetchUserInfo(accessToken, user);
        await linearQueue.add('linearQueue', {
            accessToken,
            linearUserId: userInfo.id,
            userId: user
        });
        res.status(200).json({
            accessToken
        });
    } catch (err) {
        next(err);
    }
};

const getMyLinearIssuesController = async (req, res, next) => {
    const user = req.auth.userId

    try {
        const issues = await getMyLinearIssues(user);

        res.status(200).json({
            issues
        });
    } catch (err) {
        next(err);
    }
};

const getTodayLinearIssuesController = async (req, res, next) => {
    const user = req.auth.userId

    try {
        const issues = await getTodayLinearIssues(user);

        res.status(200).json({
            issues
        });
    } catch (err) {
        next(err)
    }
};

const getOverdueLinearIssuesController = async (req, res, next) => {
    const user = req.auth.userId

    try {
        const issues = await getOverdueLinearIssues(user);

        res.status(200).json({
            issues
        });
    } catch (err) {
        next(err);
    }
};

const getLinearIssuesByDateController = async (req, res, next) => {
    const { date } = req.params;
    const user = req.auth.userId

    try {
        const issues = await getLinearIssuesByDate(user, date);

        res.status(200).json({
            issues
        });
    } catch (err) {
        next(err);
    }
};

const handleWebhook = async (req, res, next) => {
    const rawBody = req.body.toString();
    const payload = JSON.parse(rawBody);
    const signature = crypto.createHmac("sha256", environment.LINER_WEBHOOK_SECRET).update(rawBody).digest("hex");
    if (signature !== req.headers['linear-signature']) {
        res.sendStatus(400);
        return;
    }

    try {
        await handleWebhookEvent(payload);
        res.status(200).send('Webhook event processed');
    } catch (err) {
        next(err);
    }
}

export {
    redirectLinearOAuthLoginController,
    getAccessTokenController,
    getMyLinearIssuesController,
    getTodayLinearIssuesController,
    getOverdueLinearIssuesController,
    getLinearIssuesByDateController,
    handleWebhook
}
