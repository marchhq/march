import { environment } from "../../loaders/environment.loader.js";
import { getNotionAccessToken } from "../../services/integration/notion.service.js"

const redirectNotionAuthUrlController = (req, res) => {
    const notionAuthUrl = `https://api.notion.com/v1/oauth/authorize?client_id=${environment.NOTION_CLIENT_ID}&response_type=code&owner=user&redirect_uri=${environment.NOTION_REDIRECT_URL}`;

    console.log(notionAuthUrl);
    res.redirect(notionAuthUrl);
};

const getNotionAccessTokenController = async (req, res, next) => {
    const { code } = req.query;
    const user = req.user;
    try {
        const tokenInfo = await getNotionAccessToken(code, user);
        console.log("token: ", tokenInfo);
    } catch (err) {
        console.log("err: ", err);
        next(err)
    }
};

export {
    redirectNotionAuthUrlController,
    getNotionAccessTokenController
}
