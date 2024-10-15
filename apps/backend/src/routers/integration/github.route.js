import { Router } from "express";
import { githubAccessTokenController, handleGithubCallbackController } from "../../controllers/integration/github.controller.js";

const router = Router();

router.get('/callback/', handleGithubCallbackController);
router.route("/getAccessToken/").get(githubAccessTokenController)
export default router;
