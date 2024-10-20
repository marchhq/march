import { Router } from "express";
import { userProfileController, updateUserController, getAllUsersController } from "../../controllers/core/user.controller.js";

const router = Router();

router.route('/me/').get(userProfileController);
router.route('/me/').patch(updateUserController);
router.route('/all').get(getAllUsersController);

export default router;
