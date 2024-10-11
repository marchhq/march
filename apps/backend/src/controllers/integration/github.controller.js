import { fetchInstallationDetails, processWebhookEvent } from "../../services/integration/github.service.js";

import { createAppAuth } from "@octokit/auth-app";
import { environment } from "../../loaders/environment.loader.js";

const handleGithubIntegrationController = async (req, res, next) => {
    try {
        const appId = environment.GITHUB_APP_ID;
        const privateKey = environment.GITHUB_APP_PRIVATE_KEY.replace(/\\n/g, '\n');

        const auth = createAppAuth({
            appId: appId,
            privateKey: privateKey,
        });

        // Redirect the user to GitHub's authorization URL
        const authUrl = await auth({ type: "installation" });

        res.status(200).json({ url: authUrl });
    } catch (error) {
        console.error("Error initiating GitHub integration:", error);
        res.status(500).json({ error: "Failed to initiate GitHub integration" });
    }
};

const handleGithubCallbackController = async (req, res, next) => {
    try {
        const installationId = req.query.installation_id;
        const user = req.user;
        await fetchInstallationDetails(installationId, user);
        
        res.status(200).send({
            message: 'GitHub App installed successfully'
        });
    } catch (err) {
        next(err);
    }
};


const handleGithubWebhook = async (req, res, next) => {
    try {
        const event = req.headers['x-github-event'];
        const payload = req.body;
        await processWebhookEvent(event, payload);

        res.status(200).send({ message: 'Webhook received and processed' });
    } catch (err) {
        next(err);
    }
};

export {
    handleGithubIntegrationController,
    handleGithubCallbackController,
    handleGithubWebhook
};
