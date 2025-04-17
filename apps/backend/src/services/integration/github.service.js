import axios from 'axios';
import { createAppAuth } from "@octokit/auth-app";
import { environment } from '../../loaders/environment.loader.js';
import { User } from "../../models/core/user.model.js";
import { Object } from '../../models/lib/object.model.js';
import { getOrCreateLabels } from "../../services/lib/label.service.js";
import { broadcastToUser } from "../../loaders/websocket.loader.js";

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

const processWebhookEvent = async (payload) => {
    const issueOrPR = payload.issue || payload.pull_request;
    let message = "";
    let broadcastObject = null;
    let targetUserId = null;
    let action = null;

    if (!issueOrPR) {
        console.log("No issue or pull request found in the payload.");
        return;
    }

    const repository = payload.repository;

    // Handle deletion events
    if (payload.action === "deleted") {
        const deletedObject = await Object.findOneAndDelete({
            id: issueOrPR.id,
            source: "github"
        });

        if (deletedObject) {
            message = `Deleted object with ID: ${issueOrPR.id}`;
            action = "delete";
            broadcastObject = deletedObject;
            targetUserId = deletedObject.user;
        } else {
            console.log(`Object with ID: ${issueOrPR.id} not found in the database.`);
        }
    } else {
        // Handle creation or update events
        const installationId = payload.installation?.id;
        const user = await User.findOne({ "integration.github.installationId": installationId });
        if (!user) {
            console.log("No user found with the matching GitHub installation ID.");
            return;
        }

        const userId = user._id;
        targetUserId = userId;

        const existingObject = await Object.findOne({
            id: issueOrPR.id,
            source: "github",
            user: userId
        });

        const labelIds = await getOrCreateLabels(issueOrPR.labels, userId);

        if (existingObject) {
            const updatedObject = await Object.findByIdAndUpdate(existingObject._id, {
                title: issueOrPR.title,
                description: issueOrPR.body,
                labels: labelIds,
                "metadata.state": issueOrPR.state,
                "metadata.url": issueOrPR.html_url,
                "metadata.repo": repository.name,
                "metadata.owner": repository.owner.login,
                "metadata.assignees": issueOrPR.assignees,
                updatedAt: issueOrPR.updated_at
            }, { new: true });

            message = `Updated object with ID: ${issueOrPR.id}`;
            action = "update";
            broadcastObject = updatedObject;
        } else {
            const newObject = new Object({
                title: issueOrPR.title,
                source: "github",
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

            const savedObject = await newObject.save();
            message = `Created new item with ID: ${issueOrPR.id}`;
            action = "create";
            broadcastObject = savedObject;
        }
    }

    if (targetUserId) {
        const broadcastData = {
            type: "github",
            message,
            action,
            item: broadcastObject
        };

        broadcastToUser(targetUserId.toString(), broadcastData, true);
    }
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
