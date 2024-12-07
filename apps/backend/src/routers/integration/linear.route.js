import { Router } from "express";
import { getAccessTokenController, revokeLinearAccessController } from "../../controllers/integration/linear.controller.js";

const router = Router();

router.route("/getAccessToken/").get(getAccessTokenController)
/**
 * Route to handle revoking Linear access.
 *
 * POST /revoke-access/ - Revokes the user's Linear access token.
 */
router.route("/revoke-access/").post(revokeLinearAccessController)

export default router;
