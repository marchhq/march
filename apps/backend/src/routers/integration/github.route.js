import { Router } from "express";
import { getUserGithubIssuesAndPRsController } from "../../controllers/integration/github.controller.js"

const router = Router();
router.route("/issues/").get(getUserGithubIssuesAndPRsController);

export default router;
