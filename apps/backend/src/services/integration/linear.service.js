import axios from 'axios';
import { environment } from '../../loaders/environment.loader.js';
import { clerk } from "../../middlewares/clerk.middleware.js";
import { Integration } from '../../models/integration/integration.model.js';

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
        console.log("saj: ", accessToken);
        await clerk.users.updateUserMetadata(user, {
            privateMetadata: {
                integration: {
                    linear: {
                        accessToken: accessToken
                    }
                }
            }
        });
        // user.integration.linear.accessToken = accessToken;
        // await user.save();

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
        // console.log("sajda: ", userInfo);
        await clerk.users.updateUserMetadata(user, {
            privateMetadata: {
                integration: {
                    linear: {
                        userId: userInfo.id
                    }
                }
            }
        });

        // user.integration.linear.userId = userInfo.id;
        // await user.save();
        return userInfo;
    } catch (error) {
        console.error('Error fetching user info:', error);
        throw error;
    }
};

// const fetchUserInfo = async (linearToken, user) => {
//     try {
//         const response = await axios.post('https://api.linear.app/graphql', {
//             query: `
//                 query {
//                     users {
//                         nodes {
//                             id
//                             name
//                             email
//                         }
//                     }
//                 }
//             `
//         }, {
//             headers: {
//                 Authorization: `Bearer ${linearToken}`,
//                 'Content-Type': 'application/json'
//             }
//         });

//         const members = response.data.data.users.nodes;

//         const userEmail = user.accounts.google.email || user.accounts.local.email;

//         const matchedMember = members.find(member => member.email === userEmail);

//         if (matchedMember) {
//             user.integration.linear.userId = matchedMember.id;
//             await user.save();
//         } else {
//             throw new Error("No matching Linear member found for the user.");
//         }

//         return matchedMember;
//     } catch (error) {
//         console.error('Error fetching user info:', error);
//         throw error;
//     }
// };

const getMyLinearIssues = async (id) => {
    const user = await clerk.users.getUser(id);
    const linearToken = user.privateMetadata.integration.linear.accessToken;
    const userId = user.privateMetadata.integration.linear.userId
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

    // Save issues to MongoDB
    for (const issue of issues) {
        const integration = new Integration({
            title: issue.title,
            type: 'linearIssue',
            id: issue.id,
            user: id,
            url: issue.url,
            metadata: {
                description: issue.description,
                labels: issue.labels,
                state: issue.state,
                priority: issue.priority,
                project: issue.project,
                dueDate: issue.dueDate
            },
            createdAt: issue.createdAt,
            updatedAt: issue.updatedAt
        });

        await integration.save();
    }

    return issues;
};

const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const getTodayLinearIssues = async (id) => {
    const user = await clerk.users.getUser(id);
    const linearToken = user.privateMetadata.integration.linear.accessToken;
    const userId = user.privateMetadata.integration.linear.userId
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

const getOverdueLinearIssues = async (id) => {
    const user = await clerk.users.getUser(id);
    const linearToken = user.privateMetadata.integration.linear.accessToken;
    const userId = user.privateMetadata.integration.linear.userId
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

const getLinearIssuesByDate = async (id, date) => {
    const user = await clerk.users.getUser(id);
    const linearToken = user.privateMetadata.integration.linear.accessToken;
    const userId = user.privateMetadata.integration.linear.userId
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

const verifyLinearWebhook = (secret, signature, payload) => {
    const hash = crypto.createHmac('sha256', secret).update(payload).digest('hex');
    return hash === signature;
};

// need to improve it
const handleWebhookEvent = async (payload) => {
    const issue = payload.data;

    if (!issue.assignee || !issue.assignee.id) {
        return;
    }

    const response = await clerk.users.getUserList({ limit: 100 });
    const users = response.data;

    const user = users.find(user => user.privateMetadata.integration?.linear?.userId === issue.assignee.id);
    if (!user) {
        console.log('No user found with the matching Linear userId.');
        return;
    }
    const userId = user.id;
    console.log('User ID:', userId);

    // Check if the issue already exists
    const existingIssue = await Integration.findOne({ id: issue.id, type: 'linearIssue' });
    if (existingIssue) {
        // existingIssue.title = issue.title;
        // existingIssue.metadata.description = issue.description;
        // existingIssue.metadata.labels = issue.labels;
        // existingIssue.metadata.state = issue.state;
        // existingIssue.metadata.priority = issue.priority;
        // existingIssue.metadata.project = issue.project;
        // existingIssue.metadata.dueDate = issue.dueDate;
        // existingIssue.updatedAt = issue.updatedAt;

        // await existingIssue.save();
        // console.log("saju: ", existingIssue);
        const updatedIssue = await Integration.findByIdAndUpdate(existingIssue._id, {
            title: issue.title,
            'metadata.description': issue.description,
            'metadata.labels': issue.labels,
            'metadata.state': issue.state,
            'metadata.priority': issue.priority,
            'metadata.project': issue.project,
            'metadata.dueDate': issue.dueDate,
            updatedAt: issue.updatedAt
        }, { new: true });

        console.log("Updated issue: ", updatedIssue);
    } else {
        const newIssue = new Integration({
            title: issue.title,
            type: 'linearIssue',
            id: issue.id,
            user: userId,
            url: issue.url,
            metadata: {
                description: issue.description,
                labels: issue.labels,
                state: issue.state,
                priority: issue.priority,
                project: issue.project,
                dueDate: issue.dueDate
            },
            createdAt: issue.createdAt,
            updatedAt: issue.updatedAt
        });

        await newIssue.save();
    }
};

export {
    getAccessToken,
    fetchUserInfo,
    getMyLinearIssues,
    getTodayLinearIssues,
    getOverdueLinearIssues,
    getLinearIssuesByDate,
    verifyLinearWebhook,
    handleWebhookEvent
}
