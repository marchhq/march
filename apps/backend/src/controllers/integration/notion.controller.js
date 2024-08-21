import { environment } from "../../loaders/environment.loader.js";

const redirectNotionAuthUrlController = (req, res) => {
    const notionAuthUrl = `https://api.notion.com/v1/oauth/authorize?client_id=${environment.NOTION_CLIENT_ID}&response_type=code&owner=user&redirect_uri=${environment.NOTION_REDIRECT_URL}`;

    console.log(notionAuthUrl);
    res.redirect(notionAuthUrl);
};

export {
    redirectNotionAuthUrlController
}
