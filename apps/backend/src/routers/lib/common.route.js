import { Router } from "express";
import { createUpdateJournalController, getUserTodayJournalController, getUserAllJournalsController, getUserJournalByDateController } from "../../controllers/lib/journal.controller.js";
import {
    getUserItemsController,
    getUserTodayItemsController,
    getUserOverdueItemsController,
    getUserItemsByDateControlle,
    moveItemtoDateController,
    getAllitemsController
} from "../../controllers/core/user.controller.js";
import { searchItemsByTitleController } from "../../controllers/lib/item.controller.js"
import { uploadFileController } from "../../controllers/lib/fileAsset.controller.js";
import { upload } from "../../loaders/s3.loader.js";
import { feedbackController } from "../../controllers/lib/feedback.controller.js";
import { linkPreviewGeneratorController } from "../../controllers/lib/linkPreview.controller.js";

const router = Router();

// inbox
router.route("/my/").get(getUserItemsController);
router.route("/my/today/").get(getUserTodayItemsController);
router.route("/my/overdue/").get(getUserOverdueItemsController);
router.route("/my/:date/").get(getUserItemsByDateControlle);
router.route("/setDate/").post(moveItemtoDateController);

// journal controllers
router.route("/journals/create-update/").post(createUpdateJournalController);
router.route("/journals/today/").get(getUserTodayJournalController);
router.route("/journals/overview/").get(getUserAllJournalsController);
router.route("/journals/:date/").get(getUserJournalByDateController);

// get all items
router.route("/items/").get(getAllitemsController);
router.route("/items/search/").get(searchItemsByTitleController);

// File Asset controllers
router
    .route("/file-assets/upload/")
    .post(upload.single("file"), uploadFileController);

// Feedback controller
router.route("/feedback/").post(feedbackController);

// Link preview controller
router.route("/get-link-preview/").post(linkPreviewGeneratorController);

export default router;
