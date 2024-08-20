import { fetchInstallationDetails, processWebhookEvent } from "../../services/integration/github.service.js";

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
    handleGithubCallbackController,
    handleGithubWebhook
};
