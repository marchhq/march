import { Router } from "express";
import { redirectNotionAuthUrlController, getNotionAccessTokenController, getNotionPageController } from "../../controllers/integration/notion.controller.js";

const router = Router();

router.route("/connect/").get(redirectNotionAuthUrlController);
router.route("/getAccessToken/").post(getNotionAccessTokenController);
router.route("/getPage/").get(getNotionPageController);

export default router;
