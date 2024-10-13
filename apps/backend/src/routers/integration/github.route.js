import { Router } from "express";
import { handleGithubCallbackController} from "../../controllers/integration/github.controller.js";

const router = Router();


router.get('/callback/', handleGithubCallbackController);

export default router;
