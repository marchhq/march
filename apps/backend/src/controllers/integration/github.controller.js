import { getGitHubAccessToken, getUserGithubIssuesAndPRs } from "../../services/integration/github.service.js";

const getUserGithubIssuesAndPRsController = async (req, res, next) => {
    try {
        const userId = req.auth.userId;
        const { token, username } = await getGitHubAccessToken(userId);
        const { issues, pullRequests } = await getUserGithubIssuesAndPRs(token, username);
        res.json({
            issues,
            pullRequests
        });
    } catch (err) {
        next(err);
    }
}

export {
    getUserGithubIssuesAndPRsController
}
