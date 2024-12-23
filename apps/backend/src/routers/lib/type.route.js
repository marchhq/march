import { Router } from "express";
import { createTypeController, getAllTypesController } from "../../controllers/lib/type.controller.js";

const router = Router();

router.route("/").post(createTypeController);
router.route("/").get(getAllTypesController);
export default router;
