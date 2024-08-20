// import { Octokit } from "@octokit/rest";
// import { createAppAuth } from "@octokit/auth-app";
// // import { Integration } from "../../models/integration/integration.model.js";
// import { environment } from "../../loaders/environment.loader.js";
// import { Item } from "../../models/lib/item.model.js";
// import fs from "fs";

// const getGitHubAccessToken = async (userId) => {
//     // const accessTokenResponse = await clerk.users.getUserOauthAccessToken(userId, 'github');
//     // const token = accessTokenResponse.data[0].token;
//     // const externalAccountId = accessTokenResponse.data[0].externalAccountId;
//     // const user = await clerkClient.users.getUser(userId);
//     // const externalAccount = user.externalAccounts.find(account => account.id === externalAccountId);

//     // const username = externalAccount.username

//     // return { token, username };
// };

// const fetchInstallationDetails = async (installationId, user) => {
//     try {
//         // const accessToken = await generateInstallationAccessToken(installationId, user);
//         const accessToken = user.integration.github.token;
//         console.log("accessToken: ", accessToken);

//         const octokit = new Octokit({ auth: accessToken });

//         const { data } = await octokit.apps.getInstallation({
//             installation_id: installationId
//         });

//         console.log('data: ', data);
//         console.log('Installation Account: ', data.account.login);
//         return data.account.login;
//         // return "";
//     } catch (error) {
//         console.error('Error fetching installation details:', error);
//         throw error;
//     }
// };

// // const generateInstallationAccessToken = async (installationId) => {
// //     console.log("installationId: ", installationId);
// //     // const privateKey = environment.GITHUB_APP_PRIVATE_KEY;
// //     const privateKey = environment.GITHUB_APP_PRIVATE_KEY.replace(/\\n/g, '\n');
// //     console.log("privateKey: ", privateKey);
// //     const auth = createAppAuth({
// //         appId: environment.GITHUB_APP_ID,
// //         privateKey,
// //         installationId
// //     });
// //     console.log("hey");
// //     const installationAuthentication = await auth({ type: 'installation' });
// //     console.log("Generated Token: ", installationAuthentication);
// //     return installationAuthentication.token;
// // };

// // const generateInstallationAccessToken = async (installationId) => {
// //     try {
// //         const privateKey = environment.GITHUB_APP_PRIVATE_KEY.replace(/\\n/g, '\n');
// //         const appId = environment.GITHUB_APP_ID;

// //         console.log("App ID:", appId);
// //         console.log("Installation ID:", installationId);
// //         console.log("Private Key (first line):", privateKey.split('\n')[0]);

// //         const auth = createAppAuth({
// //             appId: appId,
// //             privateKey: privateKey,
// //             installationId: installationId
// //         });

// //         const installationAuthentication = await auth({ type: 'installation' });
// //         return installationAuthentication.token;
// //     } catch (error) {
// //         console.error('Error generating installation access token:', error);
// //         if (error.response) {
// //             console.error('Response status:', error.response.status);
// //             console.error('Response data:', error.response.data);
// //         }
// //         throw error;
// //     }
// // };

// const generateInstallationAccessToken = async (installationId, user) => {
//     try {
//         const privateKey = environment.GITHUB_APP_PRIVATE_KEY.replace(/\\n/g, '\n');
//         // const privateKeyPath = environment.GITHUB_APP_PRIVATE_KEY.replace(/\\n/g, '\n');
//         const appId = environment.GITHUB_APP_ID;

//         // const privateKey = fs.readFileSync(privateKeyPath, "utf8");

//         const auth = createAppAuth({
//             appId: appId,
//             privateKey: privateKey,
//             webhooks: {
//                 secret: environment.GITHUB_WEBHOOK_SECRET
//             },
//             installationId: installationId
//         });

//         const installationAuthentication = await auth({ type: 'installation' });
//         user.integration.github.token = installationAuthentication.token;
//         user.save();
//         return installationAuthentication.token;
//     } catch (error) {
//         console.error('Error generating installation access token:', error);
//         throw error;
//     }
// };

// const getUserGithubIssuesAndPRs = async (accessToken, username, userId) => {
//     const octokit = new Octokit({ auth: accessToken });

//     const issuesdata = await octokit.search.issuesAndPullRequests({
//         q: `assignee:${username} type:issue is:open`
//     });

//     const pullRequestsData = await octokit.search.issuesAndPullRequests({
//         q: `author:${username} type:pr is:open`
//     });

//     const issues = issuesdata.data.items;
//     const pullRequests = pullRequestsData.data.items;

//     const extractRepoDetails = (url) => {
//         const match = url.match(/repos\/([^/]+)\/([^/]+)/);
//         return match ? { owner: match[1], repo: match[2] } : null;
//     };

//     for (const issue of issues) {
//         const repoDetails = extractRepoDetails(issue.repository_url);
//         if (repoDetails) {
//             const integration = new Item({
//                 title: issue.title,
//                 type: 'githubIssue',
//                 id: issue.id,
//                 user: userId,
//                 metadata: {
//                     org: repoDetails.owner,
//                     url: issue.html_url,
//                     repo: repoDetails.repo,
//                     repository_url: issue.repository_url,
//                     number: issue.number,
//                     labels: issue.labels,
//                     body: issue.body
//                 },
//                 createdAt: issue.created_at,
//                 updatedAt: issue.updated_at
//             });
//             await integration.save();
//         }
//     }

//     for (const pr of pullRequests) {
//         const repoDetails = extractRepoDetails(pr.repository_url);
//         if (repoDetails) {
//             const integration = new Item({
//                 title: pr.title,
//                 type: 'githubPullRequest',
//                 id: pr.id,
//                 user: userId,
//                 metadata: {
//                     org: repoDetails.owner,
//                     url: pr.html_url,
//                     repo: repoDetails.repo,
//                     repository_url: pr.repository_url,
//                     number: pr.number,
//                     labels: pr.labels,
//                     body: pr.body
//                 },
//                 createdAt: pr.created_at,
//                 updatedAt: pr.updated_at
//             });
//             await integration.save();
//         }
//     }

//     return {
//         issues,
//         pullRequests
//     };
// };

// export {
//     getGitHubAccessToken,
//     getUserGithubIssuesAndPRs,
//     fetchInstallationDetails
// };
import { Octokit } from "@octokit/rest";
import { createAppAuth } from "@octokit/auth-app";
import { environment } from "../../loaders/environment.loader.js";

const fetchInstallationDetails = async (installationId, user) => {
    try {
        const appId = environment.GITHUB_APP_ID;
        const privateKey = environment.GITHUB_APP_PRIVATE_KEY.replace(/\\n/g, '\n');
        // const privateKeyPath = environment.GITHUB_APP_PRIVATE_KEY.replace(/\\n/g, '\n');
        // const privateKey = fs.readFileSync(privateKeyPath, "utf8");
        const auth = createAppAuth({
            appId: appId,
            privateKey: privateKey,
            webhooks: {
                secret: environment.GITHUB_WEBHOOK_SECRET
            },
            installationId: installationId
        });
        const installationAuthentication = await auth({ type: 'installation' });

        const octokit = new Octokit({ auth: installationAuthentication.token });

        await octokit.apps.listReposAccessibleToInstallation({
            installation_id: installationId
        });
        user.integration.github.installationId = installationId
        user.save();
    } catch (error) {
        console.error('Error fetching installation details:', error);
        throw error;
    }
};

const fetchIssuesAndPullRequests = async (accessToken, owner, repoName) => {
    try {
        const octokit = new Octokit({ auth: accessToken });

        // Fetch issues
        const issues = await octokit.issues.listForRepo({
            owner,
            repo: repoName
        });

        // Fetch pull requests
        const pullRequests = await octokit.pulls.list({
            owner,
            repo: repoName
        });

        return { issues: issues.data, pullRequests: pullRequests.data };
    } catch (error) {
        console.error('Error fetching issues or pull requests:', error);
        throw error;
    }
};

const processWebhookEvent = async (event, payload) => {
    console.log("payload: ", payload);
    try {
        if (event === 'issues' || event === 'pull_request') {
        // Handle issue or pull request event
            console.log(`Received ${event} event`, payload);
        // Add logic to process the event (e.g., save to database)
        }
    } catch (error) {
        console.error('Error processing webhook event:', error);
        throw error;
    }
};

export {
    fetchInstallationDetails,
    fetchIssuesAndPullRequests,
    processWebhookEvent
};
