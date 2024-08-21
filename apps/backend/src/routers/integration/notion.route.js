import { Router } from "express";
import { redirectNotionAuthUrlController, getNotionAccessTokenController } from "../../controllers/integration/notion.controller.js";

const router = Router();

router.route("/connect/").get(redirectNotionAuthUrlController);
router.route("/getAccessToken/").post(getNotionAccessTokenController);

export default router;
