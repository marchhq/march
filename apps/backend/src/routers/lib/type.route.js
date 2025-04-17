import { Router } from "express";

import { createSourceController, getAllSourcesController } from "../../controllers/lib/source.controller.js";
const router = Router();

router.route("/sources/").post(createSourceController);
router.route("/sources/").get(getAllSourcesController);
export default router;
