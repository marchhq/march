import { Router } from "express";
import { handleGithubCallbackController , handleGithubIntegrationController } from "../../controllers/integration/github.controller.js";

const router = Router();

router.post('/integrate/github', handleGithubIntegrationController);
router.get('/callback/', handleGithubCallbackController);

export default router;
