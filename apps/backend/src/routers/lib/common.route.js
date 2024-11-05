import { Router } from "express";
import { createUpdateJournalController, getUserTodayJournalController, getUserAllJournalsController, getUserJournalByDateController } from "../../controllers/lib/journal.controller.js";
import {
    getInboxItemsController,
    getInboxItemController,
    updateInboxItemController,
    getUserTodayItemsController,
    getUserOverdueItemsController,
    getUserItemsByDateController,
    moveItemtoDateController,
    getAllitemsController
} from "../../controllers/core/user.controller.js";
import { searchItemsByTitleController, createInboxItemController, filterItemsController, getThisWeekItemsByDateRangeController, getUserFavoriteItemsController, getSubItemsController } from "../../controllers/lib/item.controller.js"
import { uploadFileController } from "../../controllers/lib/fileAsset.controller.js";
import { upload } from "../../loaders/s3.loader.js";
import { feedbackController } from "../../controllers/lib/feedback.controller.js";
import { linkPreviewGeneratorController } from "../../controllers/lib/linkPreview.controller.js";

const router = Router();

// Feedback controller
router.route("/feedback/").post(feedbackController);

// inbox
router.route("/inbox/").get(getInboxItemsController);
router.route("/inbox/").post(createInboxItemController);
router.route("/inbox/:item/").put(updateInboxItemController);
router.route("/inbox/:item/").get(getInboxItemController);
router.route("/inbox/:item/sub-items/").get(getSubItemsController);
router.route("/this-week/").get(getThisWeekItemsByDateRangeController);
router.route("/today/").get(getUserTodayItemsController);
router.route("/overdue/").get(getUserOverdueItemsController);
router.route("/favorite/").get(getUserFavoriteItemsController);
router.route("/setDate/").post(moveItemtoDateController);
router.route("/:date/").get(getUserItemsByDateController);

// journal controllers
router.route("/journals/create-update/").post(createUpdateJournalController);
router.route("/journals/today/").get(getUserTodayJournalController);
router.route("/journals/overview/").get(getUserAllJournalsController);
router.route("/journals/:date/").get(getUserJournalByDateController);

// get all items
router.route("/items/").get(getAllitemsController);

// search and filter items
router.route("/items/search/").get(searchItemsByTitleController);
router.route("/items/filter/").get(filterItemsController);

// File Asset controllers
router
    .route("/file-assets/upload/")
    .post(upload.single("file"), uploadFileController);

// Link preview controller
router.route("/get-link-preview/").post(linkPreviewGeneratorController);

export default router;
