import { getGitHubAccessToken, getUserGithubIssuesAndPRs, fetchInstallationDetails } from "../../services/integration/github.service.js";

const getUserGithubIssuesAndPRsController = async (req, res, next) => {
    try {
        const userId = req.auth.userId;
        const { token, username } = await getGitHubAccessToken(userId);
        const { issues, pullRequests } = await getUserGithubIssuesAndPRs(token, username, userId);
        res.json({
            issues,
            pullRequests
        });
    } catch (err) {
        next(err);
    }
}

const handleGithubCallbackController = async (req, res, next) => {
    try {
        const installationId = req.query.installation_id;
        // const userId = req.auth.userId;

        const username = await fetchInstallationDetails(installationId);
        console.log("saju: ", username);

        // await saveInstallation(userId, username, installationId);

        res.send('GitHub App installed successfully');
    } catch (err) {
        next(err);
    }
}

export {
    getUserGithubIssuesAndPRsController,
    handleGithubCallbackController
}
