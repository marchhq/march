import { environment } from "../../loaders/environment.loader.js";

const redirectNotionAuthUrlController = (req, res) => {
    const notionAuthUrl = environment.NOTION_REDIRECT_URL;

    console.log(notionAuthUrl);
    res.redirect(notionAuthUrl);
};

export {
    redirectNotionAuthUrlController
}
