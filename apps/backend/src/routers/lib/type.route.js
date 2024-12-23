import { Router } from "express";
import { createTypeController } from "../../controllers/lib/type.controller.js";

const router = Router();

router.route("/").post(createTypeController);
export default router;
