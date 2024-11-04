import { Router } from "express";
import { redirectNotionAuthUrlController, getNotionAccessTokenController, triggerNotionSyncController } from "../../controllers/integration/notion.controller.js";

const router = Router();

router.route("/connect/").get(redirectNotionAuthUrlController); // no need
router.route("/getAccessToken/").post(getNotionAccessTokenController);
router.route("/getPage/").get(triggerNotionSyncController);

export default router;
