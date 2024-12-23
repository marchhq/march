import { Router } from "express";
import { createTypeController, getAllTypesController, getTypesBySlugController } from "../../controllers/lib/type.controller.js";

const router = Router();

router.route("/").post(createTypeController);
router.route("/").get(getAllTypesController);
router.route("/:slug").get(getTypesBySlugController);
export default router;
