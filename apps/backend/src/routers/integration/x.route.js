import { Router } from "express";
import { redirectXOAuthLoginController, getXAccessTokenController } from "../../controllers/integration/x.controller.js";

const router = Router();

router.route("/connect/").get(redirectXOAuthLoginController);
router.route("/getAccessToken/").get(getXAccessTokenController);

export default router;
