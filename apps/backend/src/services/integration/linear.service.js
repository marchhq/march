import axios from 'axios';
import { environment } from '../../loaders/environment.loader.js';
import { Item } from '../../models/lib/item.model.js';
import { User } from '../../models/core/user.model.js';
import { getOrCreateLabels } from "../../services/lib/label.service.js";

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

const getMyLinearIssues = async (user) => {
    const linearToken = user.integration.linear.accessToken;
    const userId = user.integration.linear.userId
    if (!linearToken || !userId) {
        const error = new Error("linearToken or userId is missing")
        error.statusCode = 500
        throw error
    }

    const response = await axios.post('https://api.linear.app/graphql', {
        query: `
        query {
            issues(filter: { assignee: { id: { eq: "${userId}" } } }) {
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
                    cycle { 
                    id
                    name
                    startsAt
                    endsAt
                    number
                }
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

const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const getTodayLinearIssues = async (user) => {
    const linearToken = user.integration.linear.accessToken;
    const userId = user.integration.linear.userId;
    if (!linearToken || !userId) {
        const error = new Error("linearToken or userId is missing")
        error.statusCode = 500
        throw error
    }
    const today = new Date();
    const formattedToday = formatDate(today);

    const response = await axios.post('https://api.linear.app/graphql', {
        query: `
            query {
            issues(filter: { assignee: { id: { eq: "${userId}" } }, dueDate: { eq: "${formattedToday}" } }) {
                nodes {
                id
                title
                description
                state {
                    name
                }
                labels {
                    nodes {
                    name
                    }
                }
                dueDate
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
    return response.data.data.issues.nodes;
};

const getOverdueLinearIssues = async (user) => {
    const linearToken = user.integration.linear.accessToken;
    const userId = user.integration.linear.userId;
    if (!linearToken || !userId) {
        const error = new Error("linearToken or userId is missing")
        error.statusCode = 500
        throw error
    }
    const today = new Date();
    const formattedToday = formatDate(today);
    const response = await axios.post('https://api.linear.app/graphql', {
        query: `
          query {
            issues(filter: { assignee: { id: { eq: "${userId}" } }, dueDate: { lt: "${formattedToday}" }, completedAt: { null: true } }) {
              nodes {
                id
                title
                description
                state {
                  name
                }
                labels {
                  nodes {
                    name
                  }
                }
                dueDate
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
    return response.data.data.issues.nodes;
};

const getLinearIssuesByDate = async (user, date) => {
    const linearToken = user.integration.linear.accessToken;
    const userId = user.integration.linear.userId;
    if (!linearToken || !userId) {
        const error = new Error("linearToken or userId is missing")
        error.statusCode = 500
        throw error
    }
    const response = await axios.post('https://api.linear.app/graphql', {
        query: `
          query {
            issues(filter: { assignee: { id: { eq: "${userId}" } }, dueDate: { eq: "${date}" } }) {
              nodes {
                id
                title
                description
                state {
                  name
                }
                labels {
                  nodes {
                    name
                  }
                }
                dueDate
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
    return response.data.data.issues.nodes;
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
            'cycle.startsAt': issue.cycle.startsAt,
            'cycle.endsAt': issue.cycle.endsAt,
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
            'cycle.startsAt': issue.cycle.startsAt,
            'cycle.endsAt': issue.cycle.endsAt,
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

export {
    getAccessToken,
    fetchUserInfo,
    fetchAssignedIssues,
    saveIssuesToDatabase,
    getMyLinearIssues,
    getTodayLinearIssues,
    getOverdueLinearIssues,
    getLinearIssuesByDate,
    handleWebhookEvent
}
