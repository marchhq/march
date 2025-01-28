import { Router } from "express";
import { createTypeController, getAllTypesController, getTypesBySlugController } from "../../controllers/lib/type.controller.js";
import { createSourceController, getAllSourcesController } from "../../controllers/lib/source.controller.js";
const router = Router();

router.route("/types/").post(createTypeController);
router.route("/types/").get(getAllTypesController);
router.route("/types/:slug").get(getTypesBySlugController);
router.route("/sources/").post(createSourceController);
router.route("/sources/").get(getAllSourcesController);
export default router;
