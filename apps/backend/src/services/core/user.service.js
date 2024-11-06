import { User } from "../../models/core/user.model.js";
import { environment } from "../../loaders/environment.loader.js";
import { OauthClient } from "../../loaders/google.loader.js";
import axios from 'axios';

const getUserByEmail = async (email) => {
    const user = await User.findOne({
        $or: [
            {
                email
            },
            ...(email ? [{
                "accounts.google.email": email
            }] : []),
            ...(email ? [{
                "accounts.github.email": email
            }] : []),
            ...(email ? [{
                "accounts.local.email": email
            }] : [])
        ]

    })
    return user
}

const getUserById = async (id) => {
    const user = await User.findOne({
        uuid: id
    }, {
        'accounts.local.password': 0,
        updatedAt: 0,
        __v: 0
    })
    if (!user) {
        const error = new Error("User does not exist")
        error.statusCode = 404;
        throw error
    }
    return user;
}

const validateGoogleUser = async (token) => {
    const { tokens } = await OauthClient.getToken({
        code: token,
        client_id: environment.GOOGLE_CLIENT_ID,
        // redirect_uri: 'postmessage'
        redirect_uri: environment.GOOGLE_REDIRECT_URL
    });
    const ticket = await OauthClient.verifyIdToken({
        idToken: tokens.id_token,
        audience: environment.GOOGLE_CLIENT_ID
    })
    const payload = ticket.getPayload()
    return {
        userId: payload.sub,
        email: payload.email,
        fullName: payload.name,
        avatar: payload.picture
    }
}

const validateGithubUser = async (code) => {
    const tokenResponse = await axios.post('https://github.com/login/oauth/access_token', {
        client_id: environment.GITHUB_CLIENT_ID,
        client_secret: environment.GITHUB_CLIENT_SECRET,
        code
    }, {
        headers: { accept: 'application/json' }
    });

    const accessToken = tokenResponse.data.access_token;

    if (!accessToken) {
        throw new Error('GitHub access token not received');
    }

    const [profileResponse, emailsResponse] = await Promise.all([
        axios.get('https://api.github.com/user', {
            headers: { Authorization: `Bearer ${accessToken}` }
        }),
        axios.get('https://api.github.com/user/emails', {
            headers: { Authorization: `Bearer ${accessToken}` }
        })
    ]);
    const profile = profileResponse.data;
    const emails = emailsResponse.data;

    const primaryEmail = emails.find(email => email.primary && email.verified)?.email;

    if (!primaryEmail) {
        throw new Error('No verified primary email found for GitHub account');
    }
    return {
        fullName: profile.name || profile.login,
        userName: profile.login,
        id: profile.id,
        email: primaryEmail,
        avatar: profile.avatar_url || ''

    }
}

const createGoogleUser = async ({
    fullName,
    userName,
    email,
    id,
    avatar,
    timezone
}) => {
    let user = await User.findOne({
        'accounts.google.email': email
    })

    if (user) {
        const error = new Error("User already exists")
        error.statusCode = 400;
        throw error
    }
    userName = userName || email.split('@')[0];
    user = await User.create({
        fullName,
        userName,
        accounts: {
            google: {
                email,
                id,
                isVerified: true
            }
        },
        avatar,
        userTimezone: timezone
    })
    return user;
}

const createGithubUser = async (
    {
        fullName,
        userName,
        email,
        id,
        avatar,
        timezone
    }
) => {
    let user = await User.findOne({
        'accounts.github.email': email
    })
    if (user) {
        const error = new Error("User already exists")
        error.statusCode = 400;
        throw error
    }
    userName = userName || email.split('@')[0];
    user = await User.create({
        fullName,
        userName,
        accounts: {
            github: {
                email,
                id,
                isVerified: true
            }
        },
        avatar,
        integration: {
            github: {
                userName
            }
        },
        userTimezone: timezone
    })
    return user;
}

const updateUser = async (user, data) => {
    const updatedItem = await User.findOneAndUpdate({
        uuid: user.uuid
    },
    { $set: data },
    { new: true }
    )

    return updatedItem;
}

export {
    getUserByEmail,
    getUserById,
    validateGoogleUser,
    validateGithubUser,
    createGoogleUser,
    createGithubUser,
    updateUser
}
