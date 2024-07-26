import { environment } from "../../loaders/environment.loader.js";
import { getAccessToken, getMyLinearIssues, fetchUserInfo, getTodayLinearIssues, getOverdueLinearIssues, getLinearIssuesByDate } from "../../services/integration/linear.service.js";

// const redirectLinearOAuthLoginController = (req, res, next) => {
//     try {
//         const authUrl = `https://linear.app/oauth/authorize?client_id=${environment.LINEAR_CLIENT_ID}&redirect_uri=${environment.LINEAR_REDIRECT_URL}&response_type=code`;
//         console.log("hey: ", authUrl);
//         res.redirect(authUrl);
//     } catch (err) {
//         console.error("Error in redirectLinearOAuthLoginController:", err);
//         next(err);
//     }
// };

const redirectLinearOAuthLoginController = (req, res, next) => {
    try {
        const scopes = "read write";
        const authUrl = `https://linear.app/oauth/authorize?client_id=${environment.LINEAR_CLIENT_ID}&redirect_uri=${environment.LINEAR_REDIRECT_URL}&response_type=code&scope=${encodeURIComponent(scopes)}`;
        console.log("Redirecting to Linear OAuth URL:", authUrl);
        res.redirect(authUrl);
    } catch (err) {
        console.error("Error in redirectLinearOAuthLoginController:", err);
        next(err);
    }
};

const getAccessTokenController = async (req, res, next) => {
    const { code } = req.query;
    const user = req.auth.userId
    try {
        const accessToken = await getAccessToken(code, user);
        await fetchUserInfo(accessToken, user);

        res.status(200).json({
            statusCode: 200,
            response: {
                accessToken
            }
        });
    } catch (err) {
        next(err);
    }
};

const getMyLinearIssuesController = async (req, res, next) => {
    const user = req.auth.userId

    try {
        const issues = await getMyLinearIssues(user);

        res.status(200).json({
            status: 200,
            response: issues
        });
    } catch (err) {
        next(err);
    }
};

const getTodayLinearIssuesController = async (req, res, next) => {
    const user = req.auth.userId

    try {
        const issues = await getTodayLinearIssues(user);

        res.status(200).json({
            status: 200,
            response: issues
        });
    } catch (err) {
        next(err)
    }
};

const getOverdueLinearIssuesController = async (req, res, next) => {
    const user = req.auth.userId

    try {
        const issues = await getOverdueLinearIssues(user);

        res.status(200).json({
            status: 200,
            response: issues
        });
    } catch (err) {
        next(err);
    }
};

const getLinearIssuesByDateController = async (req, res, next) => {
    const { date } = req.params;
    const user = req.auth.userId

    try {
        const issues = await getLinearIssuesByDate(user, date);

        res.status(200).json({
            status: 200,
            response: issues
        });
    } catch (err) {
        next(err);
    }
};

export {
    redirectLinearOAuthLoginController,
    getAccessTokenController,
    getMyLinearIssuesController,
    getTodayLinearIssuesController,
    getOverdueLinearIssuesController,
    getLinearIssuesByDateController
}
