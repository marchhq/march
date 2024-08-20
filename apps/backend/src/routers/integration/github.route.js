import { Router } from "express";
// import { getUserGithubIssuesAndPRsController, handleGithubCallbackController } from "../../controllers/integration/github.controller.js"
import { handleGithubCallbackController } from "../../controllers/integration/github.controller.js";

const router = Router();
// router.route("/issues/").get(getUserGithubIssuesAndPRsController);
// router.route("/callback/").get(handleGithubCallbackController);

router.get('/callback/', handleGithubCallbackController);

export default router;
