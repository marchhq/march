import { processWebhookEvent, exchangeCodeForAccessToken } from "../../services/integration/github.service.js";

const handleGithubCallbackController = async (req, res, next) => {
    try {
        const { installation_id: installationId, code } = req.query;
        const user = req.user;
        const profile = await exchangeCodeForAccessToken(code);

        user.integration.github.installationId = installationId;
        user.integration.github.userName = profile.login;
        user.integration.github.connected = true
        user.save();

        res.status(200).send({
            message: 'GitHub App installed and user authenticated successfully'
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
    handleGithubCallbackController,
    handleGithubWebhook
};
