import { Router } from "express";
import { getAccessTokenController, redirectLinearOAuthLoginController, getMyLinearIssuesController, getTodayLinearIssuesController, getOverdueLinearIssuesController, getLinearIssuesByDateController } from "../../controllers/integration/linear.controller.js";

const router = Router();

router.route("/auth/login/").get(redirectLinearOAuthLoginController)
router.route("/getAccessToken/").get(getAccessTokenController)
router.route("/linear/issues/my/").get(getMyLinearIssuesController)
router.route("/linear/issues/today/").get(getTodayLinearIssuesController)
router.route("/linear/issues/overdue/").get(getOverdueLinearIssuesController)
router.route("/linear/issues/:date/").get(getLinearIssuesByDateController)

export default router;
