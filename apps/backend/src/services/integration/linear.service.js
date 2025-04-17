import axios from 'axios';
import { environment } from '../../loaders/environment.loader.js';
import { Object } from '../../models/lib/object.model.js';
import { User } from '../../models/core/user.model.js';
import { getOrCreateLabels } from "../../services/lib/label.service.js";
import { broadcastToUser } from "../../loaders/websocket.loader.js";
import { Source } from '../../models/lib/source.model.js';
import { saveContent } from "../../utils/helper.service.js";

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
        const teams = await getUserTeamId(linearToken);
        user.integration.linear.userId = userInfo.id;
        user.integration.linear.linearTeam = {
            teamName: teams[0].name,
            teamId: teams[0].id
        }
        user.integration.linear.connected = true;
        await user.save();
        if (user.integration.linear.connected) {
            const existingSource = await Source.findOne({ slug: "linear", user: user._id });
            if (!existingSource) {
                const source = new Source({
                    slug: "linear",
                    user: user._id
                });
                await source.save();
            }
        }

        return userInfo;
    } catch (error) {
        console.error('Error fetching user info:', error);
        throw error;
    }
};

export const getUserTeamId = async (accessToken) => {
    try {
        const response = await axios.post(
            "https://api.linear.app/graphql",
            {
                query: `
                    query {
                        viewer {
                            id
                            name
                            teamMemberships {
                                nodes {
                                    team {
                                        id
                                        name
                                    }
                                }
                            }
                        }
                    }
                `
            },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json"
                }
            }
        );

        return response.data.data.viewer.teamMemberships.nodes.map((membership) => membership.team);
    } catch (error) {
        console.error("Error fetching user's team:", error.response ? error.response.data : error.message);
        throw error;
    }
};

/**
 * Saves issues to the database, updating existing ones or creating new entries.
 *
 * @param {Array} issues - An array of issue objects to be saved.
 * @param {string} userId - The ID of the user associated with the issues.
 * @returns {Promise<void>}
 * @throws Will throw an error if saving issues to the database fails.
 */
const saveIssuesToDatabase = async (issues, userId) => {
    try {
        const filteredIssues = issues.filter(issue => issue.state.name !== 'Done');

        for (const issue of filteredIssues) {
            const labelIds = await getOrCreateLabels(issue.labels.nodes, userId);

            const existingIssue = await Object.findOne({ id: issue.id, source: 'linear', user: userId });

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
                const newIssue = new Object({
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

/**
 * Handles webhook events from Linear, updating or deleting issues in the database.
 *
 * @param {Object} payload - The webhook payload containing issue data and action type.
 * @returns {Promise<void>}
 * @throws Will log an error if the operation fails.
 */
// TODO: need to improve it base so webhook type
// const handleWebhookEvent = async (payload) => {
//     const issue = payload.data;
//     let message = '';
//     let broadcastItem = null;

//     if (payload.action === 'remove') {
//         const deletedIssue = await Item.findOneAndDelete({ id: issue.id, source: 'linear' });
//         if (deletedIssue) {
//             console.log(`Deleted issue with ID: ${issue.id}`);
//             message = `Deleted issue with ID: ${issue.id}`;
//             broadcastItem = deletedIssue;
//         } else {
//             console.log(`Issue with ID: ${issue.id} not found in the database.`);
//         }
//     } else {
//         if (!issue.assignee || !issue.assignee.id) {
//             const deletedIssue = await Item.findOneAndDelete({ id: issue.id, source: 'linear' });
//             if (deletedIssue) {
//                 console.log(`Unassigned issue with ID: ${issue.id} deleted from the database.`);
//                 message = `Unassigned issue with ID: ${issue.id} deleted from the database.`;
//                 broadcastItem = deletedIssue;
//             } else {
//                 console.log(`Unassigned issue with ID: ${issue.id} not found in the database.`);
//             }
//         } else {
//             const user = await User.findOne({ 'integration.linear.userId': issue.assignee.id });
//             if (!user) {
//                 console.log('No user found with the matching Linear userId.');
//                 return;
//             }
//             const userId = user._id;

//             // Check if the issue already exists
//             const existingIssue = await Item.findOne({ id: issue.id, source: 'linear', user: userId });
//             if (existingIssue) {
//                 const updatedIssue = await Item.findByIdAndUpdate(existingIssue._id, {
//                     title: issue.title,
//                     description: issue.description,
//                     'metadata.labels': issue.labels,
//                     'metadata.state': issue.state,
//                     'metadata.priority': issue.priority,
//                     'metadata.project': issue.project,
//                     dueDate: issue.dueDate,
//                     'cycle.startsAt': issue.cycle?.startsAt,
//                     'cycle.endsAt': issue.cycle?.endsAt,
//                     updatedAt: issue.updatedAt
//                 }, { new: true });

//                 message = `Updated issue with ID: ${issue.id}`;
//                 broadcastItem = updatedIssue;
//                 console.log("message: ", message);
//             } else {
//                 const newIssue = new Item({
//                     title: issue.title,
//                     source: 'linear',
//                     id: issue.id,
//                     user: userId,
//                     description: issue.description,
//                     dueDate: issue.dueDate,
//                     'cycle.startsAt': issue.cycle?.startsAt,
//                     'cycle.endsAt': issue.cycle?.endsAt,
//                     metadata: {
//                         labels: issue.labels,
//                         state: issue.state,
//                         priority: issue.priority,
//                         project: issue.project,
//                         url: issue.url
//                     },
//                     createdAt: issue.createdAt,
//                     updatedAt: issue.updatedAt
//                 });

//                 const savedIssue = await newIssue.save();
//                 message = `Created new issue with ID: ${issue.id}`;
//                 broadcastItem = savedIssue;
//                 console.log("message: ", message);
//             }
//         }
//     }

//     // Broadcast the message and the item from the database
//     const broadcastData = {
//         type: 'linear',
//         message,
//         item: broadcastItem
//     };

//     broadcastUpdate(broadcastData, true);
// };
const handleWebhookEvent = async (payload) => {
    const issue = payload.data;
    let message = "";
    let action = null;
    let broadcastObject = null;
    let targetUserId = null;

    if (payload.action === "remove") {
        const deletedIssue = await Object.findOneAndDelete({ id: issue.id, source: "linear" });
        if (deletedIssue) {
            message = `Deleted issue with ID: ${issue.id}`;
            action = "delete";
            broadcastObject = deletedIssue;
            targetUserId = deletedIssue.user;
        } else {
            console.log(`Issue with ID: ${issue.id} not found in the database.`);
        }
    } else {
        if (!issue.assignee || !issue.assignee.id) {
            const deletedIssue = await Object.findOneAndDelete({ id: issue.id, source: "linear" });
            if (deletedIssue) {
                message = `Unassigned issue with ID: ${issue.id} deleted from the database.`;
                action = "unassigned";
                broadcastObject = deletedIssue;
                targetUserId = deletedIssue.user;
            } else {
                console.log(`Unassigned issue with ID: ${issue.id} not found in the database.`);
            }
        } else {
            const user = await User.findOne({ "integration.linear.userId": issue.assignee.id });
            if (!user) {
                console.log("No user found with the matching Linear userId.");
                return;
            }
            const userId = user._id;
            targetUserId = userId;

            const existingIssue = await Object.findOne({ id: issue.id, source: "linear", user: userId });
            if (existingIssue) {
                const dueDate = issue.dueDate ? issue.dueDate : null;
                const startsAt = issue.cycle?.startsAt ? issue.cycle?.startsAt : null;
                const endsAt = issue.cycle?.endsAt ? issue.cycle?.endsAt : null;
                const updatedIssue = await Object.findByIdAndUpdate(existingIssue._id, {
                    title: issue.title,
                    description: issue.description,
                    "metadata.labels": issue.labels,
                    "metadata.state": issue.state,
                    "metadata.priority": issue.priority,
                    "metadata.project": issue.project,
                    dueDate,
                    "cycle.startsAt": startsAt,
                    "cycle.endsAt": endsAt,
                    updatedAt: issue.updatedAt
                }, { new: true });
                await saveContent(updatedIssue);
                message = `Updated issue with ID: ${issue.id}`;
                action = "update"
                broadcastObject = updatedIssue;
            } else {
                const newIssue = new Object({
                    title: issue.title,
                    source: "linear",
                    id: issue.id,
                    user: userId,
                    description: issue.description,
                    dueDate: issue.dueDate,
                    "cycle.startsAt": issue.cycle?.startsAt,
                    "cycle.endsAt": issue.cycle?.endsAt,
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

                const savedIssue = await newIssue.save();
                await saveContent(savedIssue);
                message = `Created new issue with ID: ${issue.id}`;
                action = "create"
                broadcastObject = savedIssue;
            }
        }
    }

    if (targetUserId) {
        const broadcastData = {
            type: "linear",
            message,
            action,
            item: broadcastObject
        };

        broadcastToUser(targetUserId.toString(), broadcastData, true);
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

const createLinearIssue = async (accessToken, teamId, title, description) => {
    try {
        const response = await axios.post(
            "https://api.linear.app/graphql",
            {
                query: `
                    mutation CreateIssue($input: IssueCreateInput!) {
                        issueCreate(input: $input) {
                            success
                            issue {
                                id
                                title
                                url
                            }
                        }
                    }
                `,
                variables: {
                    input: {
                        teamId,
                        title,
                        description
                    }
                }
            },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json"
                }
            }
        );

        if (response.data.data.issueCreate.success) {
            return response.data.data.issueCreate.issue;
        } else {
            throw new Error("Failed to create issue in Linear");
        }
    } catch (error) {
        console.error("Error creating issue in Linear:", error.response ? error.response.data : error.message);
        throw error;
    }
};

export {
    getAccessToken,
    fetchUserInfo,
    fetchAssignedIssues,
    saveIssuesToDatabase,
    handleWebhookEvent,
    revokeLinearAccess,
    createLinearIssue
}
