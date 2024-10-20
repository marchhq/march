import { Router } from "express";
import { userProfileController, updateUserController, getAllUsersController, updateUserVerificationByIdController } from "../../controllers/core/user.controller.js";

const router = Router();

router.route('/me/').get(userProfileController);
router.route('/me/').patch(updateUserController);
// Admin Panel 
router.route('/all').get(getAllUsersController);
router.patch('/update/:id', updateUserVerificationByIdController); 

export default router;
