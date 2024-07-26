import axios from 'axios';
import { environment } from '../../loaders/environment.loader.js';
import { clerk } from "../../middlewares/clerk.middleware.js";

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

export {
    getAccessToken,
    fetchUserInfo,
    getMyLinearIssues,
    getTodayLinearIssues,
    getOverdueLinearIssues,
    getLinearIssuesByDate
}
