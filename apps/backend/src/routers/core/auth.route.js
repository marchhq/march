import { Router } from "express";
import { authenticateWithGoogleController, logOutController, registerEmailUserController, emailLoginController, authenticateWithGithubController, testing } from "../../controllers/core/auth.controller.js";

const router = Router();

router.route('/common/signup/').post(registerEmailUserController);
router.route('/common/login/').post(emailLoginController);

router.route('/google/login/').post(authenticateWithGoogleController);

router.route('/github/').get(testing);

router.route('/github/login/').get(authenticateWithGithubController);

router.route('/logout/').post(logOutController);

export default router;
