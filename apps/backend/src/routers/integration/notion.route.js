import { Router } from "express";
import { redirectNotionAuthUrlController } from "../../controllers/integration/notion.controller.js";

const router = Router();

router.route("/connect/").get(redirectNotionAuthUrlController);
// router.get('/callback/', );

export default router;
