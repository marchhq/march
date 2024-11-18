import { Router } from "express";
import { getAccessTokenController, getLinearIssuesByDateController, revokeLinearAccessController } from "../../controllers/integration/linear.controller.js";

const router = Router();

router.route("/getAccessToken/").get(getAccessTokenController)
router.route("/issues/:date/").get(getLinearIssuesByDateController)
router.route("/revoke-access/").post(revokeLinearAccessController)

export default router;
