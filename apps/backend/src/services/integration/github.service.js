import { Octokit } from "@octokit/rest";
import { clerk } from "../../middlewares/clerk.middleware.js";
import { clerkClient } from "@clerk/clerk-sdk-node"
import { Integration } from "../../models/integration/integration.model.js";

const getGitHubAccessToken = async (userId) => {
    const accessTokenResponse = await clerk.users.getUserOauthAccessToken(userId, 'github');
    const token = accessTokenResponse.data[0].token;
    const externalAccountId = accessTokenResponse.data[0].externalAccountId;
    const user = await clerkClient.users.getUser(userId);
    const externalAccount = user.externalAccounts.find(account => account.id === externalAccountId);

    const username = externalAccount.username

    return { token, username };
};

const getUserGithubIssuesAndPRs = async (accessToken, username, userId) => {
    const octokit = new Octokit({ auth: accessToken });

    const issuesdata = await octokit.search.issuesAndPullRequests({
        q: `assignee:${username} type:issue is:open`
    });

    // const pullRequestsData = await octokit.search.issuesAndPullRequests({
    //     q: `assignee:${username} type:pr is:open`
    // });
    const pullRequestsData = await octokit.search.issuesAndPullRequests({
        q: `author:${username} type:pr is:open`
    });

    const issues = issuesdata.data.items;
    const pullRequests = pullRequestsData.data.items;

    const extractRepoDetails = (url) => {
        const match = url.match(/repos\/([^/]+)\/([^/]+)/);
        return match ? { owner: match[1], repo: match[2] } : null;
    };

    for (const issue of issues) {
        const repoDetails = extractRepoDetails(issue.repository_url);
        if (repoDetails) {
            const integration = new Integration({
                title: issue.title,
                type: 'githubIssue',
                url: issue.html_url,
                id: issue.id,
                user: userId,
                metadata: {
                    org: repoDetails.owner,
                    repo: repoDetails.repo,
                    repository_url: issue.repository_url,
                    number: issue.number,
                    labels: issue.labels,
                    body: issue.body
                },
                createdAt: issue.created_at,
                updatedAt: issue.updated_at
            });
            await integration.save();
        }
    }

    for (const pr of pullRequests) {
        const repoDetails = extractRepoDetails(pr.repository_url);
        if (repoDetails) {
            const integration = new Integration({
                title: pr.title,
                type: 'githubPullRequest',
                url: pr.html_url,
                id: pr.id,
                user: userId,
                metadata: {
                    org: repoDetails.owner,
                    repo: repoDetails.repo,
                    repository_url: pr.repository_url,
                    number: pr.number,
                    labels: pr.labels,
                    body: pr.body
                },
                createdAt: pr.created_at,
                updatedAt: pr.updated_at
            });
            await integration.save();
        }
    }

    return {
        issues,
        pullRequests
    };
};

export {
    getGitHubAccessToken,
    getUserGithubIssuesAndPRs
};
