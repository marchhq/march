import { Router } from "express";
import { authenticateWithGoogleController, logOutController, authenticateWithGithubController } from "../../controllers/core/auth.controller.js";
import { checkUserVerificationController } from "../../middlewares/jwt.middleware.js";

const router = Router();

router.route('/google/login/').post(authenticateWithGoogleController);

router.route('/github/login/').get(authenticateWithGithubController);

router.route('/logout/').post(logOutController);

router.route('/user-verification/').get(checkUserVerificationController);

export default router;
