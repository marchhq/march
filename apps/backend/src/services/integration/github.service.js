import axios from 'axios';
import { createAppAuth } from "@octokit/auth-app";
import { environment } from '../../loaders/environment.loader.js';
import { User } from "../../models/core/user.model.js";
import { Item } from "../../models/lib/item.model.js";
import { getOrCreateLabels } from "../../services/lib/label.service.js";
import { broadcastUpdate } from "../../loaders/websocket.loader.js";

const exchangeCodeForAccessToken = async (code) => {
    const tokenResponse = await axios.post('https://github.com/login/oauth/access_token', {
        client_id: environment.GITHUB_APP_CLIENT_ID,
        client_secret: environment.GITHUB_APP_CLIENT_SECRET,
        code
    }, {
        headers: { accept: 'application/json' }
    });
    const accessToken = tokenResponse.data.access_token;

    if (!accessToken) {
        throw new Error('GitHub access token not received');
    }
    const profileResponse = await axios.get('https://api.github.com/user', {
        headers: { Authorization: `Bearer ${accessToken}` }
    })

    const profile = profileResponse.data;
    return profile;
};

const processWebhookEvent = async (event, payload) => {
    const installationId = payload.installation.id;
    const repository = payload.repository;

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
    const userId = user._id;

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
    const existingLinearItem = await Item.findOne({
        title: issueOrPR.title,
        source: 'linear',
        user: userId
    });

    if (existingLinearItem) {
        console.log('An item with the same title already exists. Skipping creation.');
        return;
    }

    const labelIds = await getOrCreateLabels(issueOrPR.labels, userId);
    const existingItem = await Item.findOne({
        id: issueOrPR.id,
        source: event === 'issues' ? 'githubIssue' : 'githubPullRequest',
        user: userId
    });

    let message = '';
    let broadcastItem = null;

    if (existingItem) {
        const updatedItem = await Item.findByIdAndUpdate(existingItem._id, {
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

        message = `Updated item with ID: ${issueOrPR.id}`;
        console.log("message", message)
        broadcastItem = updatedItem;
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

        const savedItem = await newItem.save();
        message = `Created new item with ID: ${issueOrPR.id}`;
        console.log("message", message)
        broadcastItem = savedItem;
    }

    // Broadcast the message and the item from the database
    const broadcastData = {
        type: 'github',
        message,
        item: broadcastItem
    };

    broadcastUpdate(broadcastData);
};

const uninstallGithubApp = async (user) => {
    const appId = environment.GITHUB_APP_ID;
    const privateKey = environment.GITHUB_APP_PRIVATE_KEY.replace(/\\n/g, '\n');
    const installationId = user.integration.github.installationId;

    const auth = createAppAuth({
        appId,
        privateKey
    });

    const { token: appToken } = await auth({ type: "app" });

    const response = await axios.delete(`https://api.github.com/app/installations/${installationId}`, {
        headers: {
            Authorization: `Bearer ${appToken}`,
            Accept: 'application/vnd.github.v3+json'
        }
    });
    user.integration.github = {
        installationId: null,
        userName: null,
        connected: false
    };

    await user.save();

    return response.data;
};

export {
    exchangeCodeForAccessToken,
    processWebhookEvent,
    uninstallGithubApp
};
