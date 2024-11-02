import { Octokit } from "@octokit/rest";
import { createAppAuth } from "@octokit/auth-app";
import { environment } from "../../loaders/environment.loader.js";
import { User } from "../../models/core/user.model.js";
import { Item } from "../../models/lib/item.model.js";
import { getOrCreateLabels } from "../../services/lib/label.service.js";

const fetchInstallationDetails = async (installationId, user) => {
    try {
        const appId = environment.GITHUB_APP_ID;
        const privateKey = environment.GITHUB_APP_PRIVATE_KEY.replace(/\\n/g, '\n');
        const auth = createAppAuth({
            appId,
            privateKey,
            webhooks: {
                secret: environment.GITHUB_WEBHOOK_SECRET
            },
            installationId
        });
        const installationAuthentication = await auth({ type: 'installation' });

        const octokit = new Octokit({ auth: installationAuthentication.token });

        await octokit.apps.listReposAccessibleToInstallation({
            installation_id: installationId
        });
        user.integration.github.installationId = installationId
        user.integration.github.connected = true
        user.save();
    } catch (error) {
        console.error('Error fetching installation details:', error);
        throw error;
    }
};
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const processWebhookEvent = async (event, payload) => {
    const installationId = payload.installation.id;
    const repository = payload.repository;

    if (payload.action === 'created' && payload.installation) {
        const githubUsername = payload.installation.account.login;

        await delay(1000);
        const user = await User.findOne({ 'integration.github.installationId': installationId });

        if (!user) {
            console.log(`No user found for installation ID: ${installationId}`);
            return
        }

        user.integration.github.userName = githubUsername;
        await user.save();

        console.log(`Linked GitHub installation to user: ${user._id}`);
        return;
    }

    const user = await User.findOne({ 'integration.github.installationId': installationId });
    if (!user) {
        return;
    }
    if (event === 'installation' && payload.action === 'deleted') {
        user.integration.github.connected = false;
        user.integration.github.installationId = null;
        await user.save();

        console.log(`GitHub App uninstalled for user ${user._id}`);
        return;
    }

    const issueOrPR = payload.issue || payload.pull_request;
    if (!issueOrPR) {
        console.log('No issue or pull request found in the payload.');
        return;
    }
    const githubUsername = user.integration.github.userName;

    // Check if the issue/PR is assigned to the user
    const isAssignedToUser = issueOrPR.assignees.some(assignee => assignee.login === githubUsername);

    // Check if the user is a reviewer for the PR
    const isReviewer = issueOrPR.requested_reviewers && issueOrPR.requested_reviewers.some(reviewer => reviewer.login === githubUsername);

    // Determine if we should process the PR
    const shouldProcessPR = isAssignedToUser || isReviewer;

    if (!shouldProcessPR) {
        console.log(`PR not assigned to or created by user: ${githubUsername}. Skipping.`);
        return; // Return if the PR is not relevant to the user
    }
    const userId = user._id;

    const labelIds = await getOrCreateLabels(issueOrPR.labels, userId);
    const existingItem = await Item.findOne({
        id: issueOrPR.id,
        source: event === 'issues' ? 'githubIssue' : 'githubPullRequest',
        user: userId
    });

    if (existingItem) {
        await Item.findByIdAndUpdate(existingItem._id, {
            title: issueOrPR.title,
            description: issueOrPR.body,
            labels: labelIds,
            'metadata.state': issueOrPR.state,
            'metadata.url': issueOrPR.html_url,
            'metadata.repo': repository.name,
            'metadata.owner': repository.owner.login,
            'metadata.assignees': issueOrPR.assignees,
            updatedAt: issueOrPR.updated_at
        }, { new: true });
    } else {
        // Create new item
        const newItem = new Item({
            title: issueOrPR.title,
            source: event === 'issues' ? 'githubIssue' : 'githubPullRequest',
            id: issueOrPR.id,
            description: issueOrPR.body,
            user: userId,
            labels: labelIds,
            metadata: {
                state: issueOrPR.state,
                url: issueOrPR.html_url,
                repo: repository.name,
                owner: repository.owner.login,
                assignees: issueOrPR.assignees,
                repository_url: issueOrPR.repository_url,
                number: issueOrPR.number
            },
            createdAt: issueOrPR.created_at,
            updatedAt: issueOrPR.updated_at
        });

        await newItem.save();
    }
};

export {
    fetchInstallationDetails,
    processWebhookEvent
};
