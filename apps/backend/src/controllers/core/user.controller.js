import Joi from "joi";
import { getUserItems, getUserTodayItems, getUserOverdueItems, getUserItemsByDate } from "../../services/lib/item.service.js";
import { getUserGithubIssuesAndPRs, getGitHubAccessToken } from "../../services/integration/github.service.js";
import { getMyLinearIssues } from "../../services/integration/linear.service.js";
import { clerk } from "../../middlewares/clerk.middleware.js";

const { ValidationError } = Joi;

const userProfileController = async (req, res, next) => {
    try {
        const user = req.auth.user;
        const { firstName, lastName, username, avatar } = user

        res.json({
            "status": 200,
            "response": {
                firstName,
                lastName,
                username,
                avatar
            }
        })
    } catch (err) {
        next(err)
    }
};

const updateUserController = async (req, res, next) => {
    try {
        // const user = req.user;
        // const user = req.auth.user;
        // console.log("user: ", user);
        // // const payload = await UpdateUserPayload.validateAsync(req.body)

        // const { firstName, lastName, username, avatar } = req.body;

        // await updateUser(user, { firstName, lastName, username, avatar });

        res.json({
            "status": 200,
            "message": "Updated successfully"
        })
    } catch (err) {
        const error = new Error(err)
        error.statusCode = err instanceof ValidationError ? 400 : (err.statusCode || 500)
        next(error);
    }
};

const getUserItemsController = async (req, res, next) => {
    try {
        // const me = req.user.id;
        let LinearIssues = [];
        let issues = [];
        let pullRequests = [];
        const me = req.auth.userId;
        const user = await clerk.users.getUser(me);
        const linearToken = user.privateMetadata.integration.linear;
        const inbox = await getUserItems(me);
        const { token, username } = await getGitHubAccessToken(me);
        if (token) {
            const githubData = await getUserGithubIssuesAndPRs(token, username);
            issues = githubData.issues;
            pullRequests = githubData.pullRequests;
        }

        if (linearToken) {
            LinearIssues = await getMyLinearIssues(me);
        }
        res.json({
            inbox,
            pullRequests: pullRequests.map(pullRequest => ({ type: "pullRequest", ...pullRequest })),
            githubIssues: issues.map(issue => ({ type: "githubIssue", ...issue })),
            linearIssues: LinearIssues.map(linearIssue => ({ type: "linearIssue", ...linearIssue }))
        });
    } catch (err) {
        next(err);
    }
};

const getUserTodayItemsController = async (req, res, next) => {
    try {
        // const me = req.user.id;
        const me = req.auth.userId;
        const items = await getUserTodayItems(me);
        res.json({
            status: 200,
            response: {
                items
            }
        });
    } catch (err) {
        next(err);
    }
};

const getUserOverdueItemsController = async (req, res, next) => {
    try {
        // const me = req.user.id;
        const me = req.auth.userId;
        const items = await getUserOverdueItems(me);
        res.json({
            status: 200,
            response: {
                items
            }
        });
    } catch (err) {
        next(err);
    }
};

const getUserItemsByDateControlle = async (req, res, next) => {
    try {
        // const me = req.user.id;
        const me = req.auth.userId;
        const { date } = req.params;
        const items = await getUserItemsByDate(me, date);
        res.json({
            status: 200,
            response: {
                items
            }
        });
    } catch (err) {
        next(err);
    }
};

export {
    userProfileController,
    updateUserController,
    getUserItemsController,
    getUserTodayItemsController,
    getUserOverdueItemsController,
    getUserItemsByDateControlle
}
