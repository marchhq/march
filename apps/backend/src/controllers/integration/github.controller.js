// import { getGitHubAccessToken, getUserGithubIssuesAndPRs, fetchInstallationDetails } from "../../services/integration/github.service.js";

// const getUserGithubIssuesAndPRsController = async (req, res, next) => {
//     try {
//         const userId = req.auth.userId;
//         const { token, username } = await getGitHubAccessToken(userId);
//         const { issues, pullRequests } = await getUserGithubIssuesAndPRs(token, username, userId);
//         res.json({
//             issues,
//             pullRequests
//         });
//     } catch (err) {
//         next(err);
//     }
// }

// const handleGithubCallbackController = async (req, res, next) => {
//     try {
//         const installationId = req.query.installation_id;
//         const user = req.user;

//         await fetchInstallationDetails(installationId, user);

//         // await saveInstallation(userId, username, installationId);

//         res.send('GitHub App installed successfully');
//     } catch (err) {
//         next(err);
//     }
// }

// export {
//     getUserGithubIssuesAndPRsController,
//     handleGithubCallbackController
// }


// testing...

// controllers/githubController.js

import { fetchInstallationDetails, fetchIssuesAndPullRequests, processWebhookEvent } from "../../services/integration/github.service.js";

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

        // Handle the webhook event using the service
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
