import { Router } from "express";
import { getAccessTokenController, getTodayLinearIssuesController, getOverdueLinearIssuesController, getLinearIssuesByDateController, revokeLinearAccessController } from "../../controllers/integration/linear.controller.js";

const router = Router();

router.route("/getAccessToken/").get(getAccessTokenController)
router.route("/issues/today/").get(getTodayLinearIssuesController)
router.route("/issues/overdue/").get(getOverdueLinearIssuesController)
router.route("/issues/:date/").get(getLinearIssuesByDateController)
router.route("/revoke-access/").post(revokeLinearAccessController)

export default router;
