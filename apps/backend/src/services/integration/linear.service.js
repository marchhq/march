import axios from 'axios';
import { environment } from '../../loaders/environment.loader.js';
import { Item } from '../../models/lib/item.model.js';
import { User } from '../../models/core/user.model.js';
import { getOrCreateLabels } from "../../services/lib/label.service.js";

/**
 * Retrieves an access token from Linear using the provided authorization code.
 *
 * @param {string} code - The authorization code received from Linear.
 * @param {Object} user - The user object to update with the access token.
 * @returns {Promise<string>} - The access token.
 * @throws Will throw an error if the token retrieval fails.
 */
const getAccessToken = async (code, user) => {
    try {
        const requestBody = {
            grant_type: 'authorization_code',
            code,
            redirect_uri: environment.LINEAR_REDIRECT_URL,
            client_id: environment.LINEAR_CLIENT_ID,
            client_secret: environment.LINEAR_CLIENT_SECRET
        };

        const tokenResponse = await axios.post('https://api.linear.app/oauth/token', requestBody, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        const accessToken = tokenResponse.data.access_token;

        user.integration.linear.accessToken = accessToken;
        await user.save();

        return accessToken;
    } catch (error) {
        console.error('Error fetching Linear token:', error.response ? error.response.data : error.message);
        throw error;
    }
};

/**
 * Fetches user information from Linear using the access token.
 *
 * @param {string} linearToken - The access token for Linear API.
 * @param {Object} user - The user object to update with Linear user info.
 * @returns {Promise<Object>} - The user information from Linear.
 * @throws Will throw an error if fetching user info fails.
 */
const fetchUserInfo = async (linearToken, user) => {
    try {
        const response = await axios.post('https://api.linear.app/graphql', {
            query: `
                query {
                    viewer {
                        id
                        email
                        name
                    }
        }
        `
        }, {
            headers: {
                Authorization: `Bearer ${linearToken}`,
                'Content-Type': 'application/json'
            }
        });
        const userInfo = response.data.data.viewer
        user.integration.linear.userId = userInfo.id;
        user.integration.linear.connected = true;
        await user.save();

        return userInfo;
    } catch (error) {
        console.error('Error fetching user info:', error);
        throw error;
    }
};

const saveIssuesToDatabase = async (issues, userId) => {
    try {
        const filteredIssues = issues.filter(issue => issue.state.name !== 'Done');

        for (const issue of filteredIssues) {
            const labelIds = await getOrCreateLabels(issue.labels.nodes, userId);

            const existingIssue = await Item.findOne({ id: issue.id, source: 'linear', user: userId });

            if (existingIssue) {
                existingIssue.title = issue.title;
                existingIssue.description = issue.description;
                existingIssue.labels = labelIds;
                existingIssue.metadata.state = issue.state.name;
                existingIssue.metadata.priority = issue.priority;
                existingIssue.metadata.project = issue.project;
                existingIssue.dueDate = issue.dueDate;
                existingIssue.updatedAt = issue.updatedAt;

                await existingIssue.save();
            } else {
                const newIssue = new Item({
                    title: issue.title,
                    source: 'linear',
                    description: issue.description,
                    id: issue.id,
                    user: userId,
                    dueDate: issue.dueDate,
                    labels: labelIds,
                    metadata: {
                        state: issue.state,
                        priority: issue.priority,
                        url: issue.url,
                        project: issue.project
                    },
                    createdAt: issue.createdAt,
                    updatedAt: issue.updatedAt
                });

                await newIssue.save();
            }
        }
    } catch (error) {
        console.error('Error saving issues to database:', error);
        throw error;
    }
};

/**
 * Fetches issues assigned to a specific user from Linear.
 *
 * @param {string} linearToken - The access token for Linear API.
 * @param {string} linearUserId - The Linear user ID to filter issues by assignee.
 * @returns {Promise<Array>} - A promise that resolves to an array of issues assigned to the user.
 * @throws Will throw an error if the request to Linear fails.
 */
const fetchAssignedIssues = async (linearToken, linearUserId) => {
    const response = await axios.post('https://api.linear.app/graphql', {
        query: `
        query {
            issues(filter: { assignee: { id: { eq: "${linearUserId}" } } }) {
                nodes {
                    id
                    title
                    description
                    state {
                        id
                        name
                    }
                    labels {
                        nodes {
                            id
                            name
                        }
                    }
                    dueDate
                    createdAt
                    updatedAt
                    priority
                    project {
                        id
                        name
                    }
                    assignee {
                        id
                        name
                    }
                    url
                }
            }
        }
    `
    }, {
        headers: {
            Authorization: `Bearer ${linearToken}`,
            'Content-Type': 'application/json'
        }
    });

    const issues = response.data.data.issues.nodes;
    return issues;
};

// need to improve it base so webhook type
const handleWebhookEvent = async (payload) => {
    const issue = payload.data;
    if (payload.action === 'remove') {
        const deletedIssue = await Item.findOneAndDelete({ id: issue.id, source: 'linear' });
        if (deletedIssue) {
            console.log(`Deleted issue with ID: ${issue.id}`);
        } else {
            console.log(`Issue with ID: ${issue.id} not found in the database.`);
        }
        return;
    }

    if (!issue.assignee || !issue.assignee.id) {
        const deletedIssue = await Item.findOneAndDelete({ id: issue.id, source: 'linear' });
        if (deletedIssue) {
            console.log(`Unassigned issue with ID: ${issue.id} deleted from the database.`);
        } else {
            console.log(`Unassigned issue with ID: ${issue.id} not found in the database.`);
        }
        return;
    }

    const user = await User.findOne({
        'integration.linear.userId': issue.assignee.id
    })
    if (!user) {
        console.log('No user found with the matching Linear userId.');
        return;
    }
    const userId = user._id;

    // Check if the issue already exists
    const existingIssue = await Item.findOne({ id: issue.id, source: 'linear', user: userId });
    if (existingIssue) {
        await Item.findByIdAndUpdate(existingIssue._id, {
            title: issue.title,
            description: issue.description,
            'metadata.labels': issue.labels,
            'metadata.state': issue.state,
            'metadata.priority': issue.priority,
            'metadata.project': issue.project,
            dueDate: issue.dueDate,
            'cycle.startsAt': issue.cycle?.startsAt,
            'cycle.endsAt': issue.cycle?.endsAt,
            updatedAt: issue.updatedAt
        }, { new: true });
    } else {
        const newIssue = new Item({
            title: issue.title,
            source: 'linear',
            id: issue.id,
            user: userId,
            description: issue.description,
            dueDate: issue.dueDate,
            'cycle.startsAt': issue.cycle?.startsAt,
            'cycle.endsAt': issue.cycle?.endsAt,
            metadata: {
                labels: issue.labels,
                state: issue.state,
                priority: issue.priority,
                project: issue.project,
                url: issue.url
            },
            createdAt: issue.createdAt,
            updatedAt: issue.updatedAt
        });

        await newIssue.save();
        console.log("newIssue: ", newIssue);
    }
};

/**
 * Revokes a Linear access token.
 *
 * @param {string} accessToken - The access token to be revoked.
 * @returns {Promise<void>}
 * @throws Will throw an error if the revocation fails.
 */
const revokeLinearAccess = async (accessToken) => {
    try {
        // Send a POST request to revoke the Linear access token
        await axios.post('https://api.linear.app/oauth/revoke', {
            token: accessToken
        }, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        console.log('Linear access revoked successfully');
    } catch (error) {
        // Log the error and rethrow it
        console.error('Error revoking Linear token:', error.response ? error.response.data : error.message);
        throw error;
    }
};

export {
    getAccessToken,
    fetchUserInfo,
    fetchAssignedIssues,
    saveIssuesToDatabase,
    handleWebhookEvent,
    revokeLinearAccess
}
