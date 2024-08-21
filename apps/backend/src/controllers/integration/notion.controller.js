import { environment } from "../../loaders/environment.loader.js";
import { getNotionAccessToken } from "../../services/integration/notion.service.js"

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

export {
    redirectNotionAuthUrlController,
    getNotionAccessTokenController
}
