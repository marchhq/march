import { Router } from "express";
import { userProfileController, updateUserController } from "../../controllers/core/user.controller.js";

const router = Router();

router.route('/me/').get(userProfileController);
router.route('/me/').patch(updateUserController);

export default router;
