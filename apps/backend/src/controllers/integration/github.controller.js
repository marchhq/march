import { fetchInstallationDetails, processWebhookEvent } from "../../services/integration/github.service.js";
import axios from "axios";
const { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, BACKEND_URL } = process.env;

const handleGithubCallbackController = async (req, res, next) => {
    try {
        const installationId = req.query.installation_id;
        const user = req.user;
        await fetchInstallationDetails(installationId, user);
        res.status(200).send({
            message: 'GitHub App installed successfully'
        });
    } catch (err) {
        next(err);
    }
};

const handleGithubWebhook = async (req, res, next) => {
    try {
        const event = req.headers['x-github-event'];
        const payload = req.body;
        await processWebhookEvent(event, payload);

        res.status(200).send({ message: 'Webhook received and processed' });
    } catch (err) {
        next(err);
    }
};


// Mock function to get accessToken and refreshToken from GitHub
const getAccessToken = async (code) => {
    const tokenUrl = `https://github.com/login/oauth/access_token`;
    const params = {
        client_id: GITHUB_CLIENT_ID,
        client_secret: GITHUB_CLIENT_SECRET,
        code,
    };

    try {
        const response = await axios.post(tokenUrl, params, {
            headers: { Accept: "application/json" },
        });
        
        // Extract access token and refresh token from response
        const { access_token: accessToken, refresh_token: refreshToken } = response.data;

        if (!accessToken) throw new Error("Failed to retrieve access token.");

        return { accessToken, refreshToken };
    } catch (error) {
        throw new Error(`GitHub OAuth Error: ${error.message}`);
    }
};

const fetchUserInfo = async (accessToken) => {
    try {
        const response = await axios.get("https://api.github.com/user", {
            headers: { Authorization: `Bearer ${accessToken}` },
        });
        return response.data;
    } catch (error) {
        throw new Error(`Failed to fetch GitHub user info: ${error.message}`);
    }
};

const githubAccessTokenController = async (req, res, next) => {
    const { code } = req.query;  
    const user = req.user;      

    try {
        const { accessToken, refreshToken } = await getAccessToken(code);

        
        const userInfo = await fetchUserInfo(accessToken);
        console.log("GitHub User Info:", userInfo);

       
        user.integration.github.accessToken = tokens.access_token;
        user.integration.github.refreshToken = tokens.refresh_token;
        user.integration.github.connected = true; 
        await user.save();


        // Step 4: Respond with the tokens (access and refresh)
        res.status(200).json({
            accessToken,
            refreshToken,
        });
    } catch (error) {
        console.error("GitHub OAuth Error:", error);
        next(error);
    }
};



export {
    handleGithubCallbackController,
    handleGithubWebhook,
    githubAccessTokenController
};
