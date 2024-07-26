import { User } from "../../models/core/user.model.js";
import generator from "crypto-random-string";
import { generateHash, generateRandomPassword, verifyPasswordHash } from "../../utils/helper.service.js";
import { LoginLink } from "../../models/core/login-link.model.js";
import { environment } from "../../loaders/environment.loader.js";
import { OauthClient } from "../../loaders/google.loader.js";

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
                "accounts.local.email": email
            }] : [])
        ]

    })
    return user
}

const createEmailUser = async ({
    fullName,
    userName,
    email,
    password
}) => {
    let user = await getUserByEmail(email);
    if (user) {
        const error = new Error("User already exists");
        error.statusCode = 400;
        throw error;
    }
    const hash = await generateHash(password);
    user = await User.create({
        fullName,
        userName,
        accounts: {
            local: {
                email,
                password: hash
            }
        }
    })
    return user;
}

const validateEmailUser = async (email, password) => {
    const user = await User.findOne({
        'accounts.local.email': email
    })
    if (!user) {
        const error = new Error("Invalid email or password")
        error.statusCode = 401;
        throw error
    }
    const verifyPassword = await verifyPasswordHash(password, user.accounts.local.password);
    if (!verifyPassword) {
        const error = new Error("Invalid email or password")
        error.statusCode = 401;
        throw error
    }
    return user
}

const createMagicLoginLink = async (email, redirectUrl) => {
    const token = generator({
        length: 36,
        type: "url-safe"
    })
    let user = await getUserByEmail(email);
    let isNewUser = false;
    if (!user) {
        isNewUser = true;
        const userName = email.split('@')[0];
        user = await createEmailUser({ fullName: email, userName, email, password: generateRandomPassword() })
    }
    await LoginLink.create({
        token,
        type: "login",
        user: user._id
    })
    console.log("token: ", token);
    // need to add send email

    return { ok: "ok", isNewUser };
}

const validateMagicLoginLink = async (token) => {
    // TODO: Add expiry time
    const magicLink = await LoginLink.findOne({
        token,
        isRevoked: false
    }).populate({
        path: "user",
        select: "fullName uuid"
    })
    if (!magicLink) {
        const error = new Error("Invalid Magic Link")
        error.statusCode = 404;
        throw error;
    }
    return magicLink;
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

const updateUser = async (user, { firstName, lastName, username, avatar }) => {
    // const _user = await getUserById(user)
    // const updated = await user.updateOne({
    //     $set: {
    //         fullName: fullName || user.fullName,
    //         userName: userName || user.userName,
    //         avatar: avatar || user.avatar,
    //         timezone
    //     }
    // }, {
    //     new: true
    // })
    const updated = await user.update({ firstName })

    return updated;
}

export {
    getUserByEmail,
    createEmailUser,
    validateEmailUser,
    createMagicLoginLink,
    validateMagicLoginLink,
    getUserById,
    validateGoogleUser,
    createGoogleUser,
    updateUser
}
