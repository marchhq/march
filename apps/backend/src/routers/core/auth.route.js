import { Router } from "express";
import { authenticateWithGoogleController, logOutController, registerEmailUserController, emailLoginController } from "../../controllers/core/auth.controller.js";

const router = Router();

router.route('/common/signup/').post(registerEmailUserController);
router.route('/common/login/').post(emailLoginController);

router.route('/google/login/').post(authenticateWithGoogleController);

router.route('/logout/').post(logOutController);

export default router;
