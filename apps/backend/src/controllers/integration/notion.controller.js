import { environment } from "../../loaders/environment.loader.js";
import { getNotionAccessToken, syncNotionPages } from "../../services/integration/notion.service.js";
import axios from 'axios';

const redirectNotionAuthUrlController = (req, res) => {
    const notionAuthUrl = environment.NOTION_AUTH_URL;
    console.log(notionAuthUrl);
    res.redirect(notionAuthUrl);
};

const getNotionAccessTokenController = async (req, res, next) => {
    const { code } = req.query;
    const user = req.user;
    try {
        const accessToken = await getNotionAccessToken(code, user);
        res.status(200).json({
            accessToken
        });
    } catch (err) {
        console.log("err: ", err);
        next(err)
    }
};

const getNotionPageController = async (req, res, next) => {
    try {
        const user = req.user;
        const accessToken = user.integration.notion.accessToken;
        const response = await axios.post(
            'https://api.notion.com/v1/search',
            {
                // Optional: include a filter to limit the results
                filter: {
                    property: 'object',
                    value: 'page' // or 'database' if you're searching for databases
                }
            },
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Notion-Version': '2022-06-28'
                }
            }
        );

        return response.data;
    } catch (err) {
        console.error("Error fetching databases:", err.response?.data || err.message);
        // throw err;
    }
};

const triggerNotionSyncController = async (req, res, next) => {
    const user = req.user;
    try {
        await syncNotionPages(user);
        res.status(200).json({ message: "Sync completed." });
    } catch (err) {
        console.error("Error during sync:", err);
        next(err);
    }
};

export {
    redirectNotionAuthUrlController,
    getNotionAccessTokenController,
    getNotionPageController,
    triggerNotionSyncController
}
