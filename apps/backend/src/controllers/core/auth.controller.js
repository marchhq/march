import Joi from "joi";
import { createEmailUser, validateEmailUser, validateGoogleUser, getUserByEmail, createGoogleUser } from "../../services/core/user.service.js";
import { generateJWTTokenPair } from "../../utils/jwt.service.js";
import { RegisterPayload, LoginPayload } from "../../payloads/core/auth.payload.js";
import { BlackList } from "../../models/core/black-list.model.js";
import { environment } from "../../loaders/environment.loader.js";
import axios from 'axios';
import { User } from "../../models/core/user.model.js";

const { ValidationError } = Joi;

const registerEmailUserController = async (req, res, next) => {
    try {
        const { fullName, userName, email, password } = await RegisterPayload.validateAsync({ fullName: req.body.fullName, email: req.body.email, password: req.body.password });
        const user = await createEmailUser({
            fullName,
            userName,
            email,
            password
        })
        if (!user) {
            throw new Error("Failed to create user");
        }
        const { ok, isNewUser } = await generateJWTTokenPair(user);

        res.status(200).json({
            statusCode: 200,
            response: {
                ok,
                isNewUser
            }
        })
        // TODO: Send welcome email and verify email template to user
    } catch (err) {
        const error = new Error(err)
        error.statusCode = err instanceof ValidationError ? 400 : (err.statusCode || 500)
        next(error);
    }
}

const testing = async (req, res, next) => {
    try {
        const redirectUrl = `https://github.com/login/oauth/authorize?client_id=${environment.GITHUB_CLIENT_ID}&scope=user:email`;
        console.log("saju: ", redirectUrl);
        res.redirect(redirectUrl);
    } catch (err) {
        next(err);
    }
}

const emailLoginController = async (req, res, next) => {
    try {
        const payload = await LoginPayload.validateAsync(req.body)
        // TODO: Add 3 attempts and wait until next time
        const user = await validateEmailUser(payload.email, payload.password)
        const tokenPair = await generateJWTTokenPair(user)
        res.status(200).json({
            statusCode: 200,
            response: tokenPair
        })
    } catch (err) {
        const error = new Error(err);
        error.statusCode = err.statusCode || 500;
        next(err)
    }
}

const authenticateWithGoogleController = async (req, res, next) => {
    try {
        const token = req.headers["x-google-auth"]
        if (!token) {
            const error = new Error("Bad request")
            error.statusCode = 400
            throw error
        }
        const payload = await validateGoogleUser(token);
        if (!payload.email) {
            const error = new Error("Failed to authenticate with google")
            error.statusCode = 401
            throw error
        }
        let user = await getUserByEmail(payload.email);
        let isNewUser = false;
        if (!user) {
            isNewUser = true;
            user = await createGoogleUser(payload)
        }
        const tokenPair = await generateJWTTokenPair(user)
        res.status(200).json({
            ...tokenPair,
            isNewUser

        })
    } catch (err) {
        next(err)
    }
}

const authenticateWithGithubController = async (req, res, next) => {
    try {
        const { code } = req.query;
        console.log("code: ", code);
        if (!code) {
            const error = new Error("Bad request")
            error.statusCode = 400
            throw error
        }
        const tokenResponse = await axios.post('https://github.com/login/oauth/access_token', {
            client_id: process.env.GITHUB_CLIENT_ID,
            client_secret: process.env.GITHUB_CLIENT_SECRET,
            code
        }, {
            headers: { accept: 'application/json' }
        });

        const { access_token } = tokenResponse.data;
        console.log("tokenResponse.data; ", tokenResponse.data);
        if (!access_token) {
            return res.status(400).json({ message: 'GitHub access token not received' });
        }
        const emailsResponse = await axios.get('https://api.github.com/user/emails', {
            headers: { Authorization: `Bearer ${access_token}` }
        });

        const emails = emailsResponse.data;

        // Find the primary and verified email
        const primaryEmail = emails.find(email => email.primary && email.verified)?.email;
        console.log("primaryEmail: ", primaryEmail);
        if (!primaryEmail) {
            return res.status(400).json({ message: 'No verified primary email found for GitHub account' });
        }
        let user = await getUserByEmail(primaryEmail);
        let isNewUser = false;
        // let user = await User.findOne({ 'accounts.github.id': profile.id });

        // if (!user) {
        //     user = new User({
        //         fullName: profile.name || profile.login,
        //         userName: profile.login,
        //         avatar: profile.avatar_url || '',
        //         accounts: {
        //             github: {
        //                 id: profile.id,
        //                 email: profile.email || '',
        //                 isVerified: true
        //             }
        //         }
        //     });
        //     await user.save();
        // }
    } catch (err) {
        next(err)
    }
}

const logOutController = async (req, res, next) => {
    try {
        const { authorization: header } = req.headers;
        if (!header) {
            throw new Error("Unauthorized")
        }
        const token = header.split(' ')[1]
        const checkIfBlacklisted = await BlackList.findOne({ token });
        if (checkIfBlacklisted) return res.sendStatus(204);
        const newBlacklist = new BlackList({
            token
        });
        await newBlacklist.save();
        res.setHeader('Clear-Site-Data', '"cookies"');
        res.status(200).json({
            statusCode: 200,
            message: 'You are logged out!'
        })
    } catch (err) {
        next(err)
    }
}

export {
    registerEmailUserController,
    emailLoginController,
    authenticateWithGoogleController,
    authenticateWithGithubController,
    logOutController,
    testing
}
