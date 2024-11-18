import { Router } from "express";
import { getAccessTokenController, revokeLinearAccessController } from "../../controllers/integration/linear.controller.js";

const router = Router();

router.route("/getAccessToken/").get(getAccessTokenController)
router.route("/revoke-access/").post(revokeLinearAccessController)

export default router;
