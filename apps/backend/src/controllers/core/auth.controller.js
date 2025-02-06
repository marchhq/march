import { validateGoogleUser, getUserByEmail, createGoogleUser, createGithubUser, validateGithubUser } from "../../services/core/user.service.js";
import { generateJWTTokenPair } from "../../utils/jwt.service.js";
import { BlackList } from "../../models/core/black-list.model.js";
import { logsnag } from "../../loaders/logsnag.loader.js";
import { initQueue } from "../../loaders/bullmq.loader.js";

const authenticateWithGoogleController = async (req, res, next) => {
    try {
        const token = req.headers["x-google-auth"];
        if (!token) {
            const error = new Error("Bad request");
            error.statusCode = 400;
            throw error;
        }

        const payload = await validateGoogleUser(token);
        if (!payload.email) {
            const error = new Error("Failed to authenticate with Google");
            error.statusCode = 401;
            throw error;
        }

        let user = await getUserByEmail(payload.email);
        let isNewUser = false;
        if (!user) {
            isNewUser = true;
            user = await createGoogleUser(payload);

            // Log user event to LogSnag
            await logsnag.track({
                channel: "new-users",
                event: `${user.userName} is Added`,
                user_id: user._id,
                icon: "✨",
                notify: true,
                tags: {
                    method: "Google",
                    email: user.accounts.google.email,
                    name: user.fullName
                }
            });
            await initQueue.add('initQueue', { user: user._id });
        }

        const tokenPair = await generateJWTTokenPair(user);
        res.status(200).json({
            ...tokenPair,
            isNewUser
        });
    } catch (err) {
        next(err);
    }
};

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

            // Log user event to LogSnag
            await logsnag.track({
                channel: "new-users",
                event: `${user.userName} is Added`,
                user_id: user._id,
                icon: "✨",
                notify: true,
                tags: {
                    method: "Github",
                    email: user.accounts.github.email,
                    name: user.fullName
                }
            });

            // Add job to initQueue
            await initQueue.add('initQueue', { user: user._id });
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
    authenticateWithGoogleController,
    authenticateWithGithubController,
    logOutController
}
