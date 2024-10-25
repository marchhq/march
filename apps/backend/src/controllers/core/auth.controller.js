import Joi from "joi";
import { createEmailUser, validateEmailUser, validateGoogleUser, getUserByEmail, createGoogleUser, createGithubUser, validateGithubUser } from "../../services/core/user.service.js";
import { generateJWTTokenPair } from "../../utils/jwt.service.js";
import { RegisterPayload, LoginPayload } from "../../payloads/core/auth.payload.js";
import { BlackList } from "../../models/core/black-list.model.js";
import { spaceQueue } from "../../loaders/bullmq.loader.js";

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
            user = await createGoogleUser(payload);
            await spaceQueue.add('spaceQueue', {
                user: user._id
            }, {
                attempts: 3,
                backoff: 5000
            });
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
        if (!code) {
            const error = new Error("Bad request")
            error.statusCode = 400
            throw error
        }
        const payload = await validateGithubUser(code);
        if (!payload.email) {
            const error = new Error("Failed to authenticate with google")
            error.statusCode = 401
            throw error
        }
        let user = await getUserByEmail(payload.email);

        let isNewUser = false;
        if (!user) {
            isNewUser = true;
            user = await createGithubUser(payload);
            await spaceQueue.add('spaceQueue', {
                user: user._id
            }, {
                attempts: 3,
                backoff: 5000
            });
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
    logOutController
}
