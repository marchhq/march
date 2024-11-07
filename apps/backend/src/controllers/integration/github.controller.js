import { processWebhookEvent, exchangeCodeForAccessToken } from "../../services/integration/github.service.js";

// const handleGithubCallbackController = async (req, res, next) => {
//     try {
//         const installationId = req.query.installation_id;
//         const user = req.user;
//         await fetchInstallationDetails(installationId, user);
//         res.status(200).send({
//             message: 'GitHub App installed successfully'
//         });
//     } catch (err) {
//         next(err);
//     }
// };

const handleGithubCallbackController = async (req, res, next) => {
    try {
        console.log("hey");
        const { installation_id: installationId, code } = req.query;
        const user = req.user;
        console.log("codeL: ", code);
        const profile = await exchangeCodeForAccessToken(code);
        console.log("profile: ", profile);

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
