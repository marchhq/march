import { Octokit } from "@octokit/rest";
import { clerk } from "../../middlewares/clerk.middleware.js";
import { clerkClient } from "@clerk/clerk-sdk-node"

const getGitHubAccessToken = async (userId) => {
    const accessTokenResponse = await clerk.users.getUserOauthAccessToken(userId, 'github');
    const token = accessTokenResponse.data[0].token;
    const externalAccountId = accessTokenResponse.data[0].externalAccountId;
    const user = await clerkClient.users.getUser(userId);
    const externalAccount = user.externalAccounts.find(account => account.id === externalAccountId);

    const username = externalAccount.username

    return { token, username };
};

const getUserGithubIssuesAndPRs = async (accessToken, username) => {
    const octokit = new Octokit({ auth: accessToken });

    const issues = await octokit.search.issuesAndPullRequests({
        q: `assignee:${username} type:issue is:open`
    });

    const pullRequests = await octokit.search.issuesAndPullRequests({
        q: `assignee:${username} type:pr is:open`
    });

    return {
        issues: issues.data.items,
        pullRequests: pullRequests.data.items
    };
};

export {
    getGitHubAccessToken,
    getUserGithubIssuesAndPRs
};
