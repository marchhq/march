import { Router } from "express";

// Journal related imports
import {
    createUpdateJournalController,
    getUserTodayJournalController,
    getUserAllJournalsController,
    getUserJournalByDateController
} from "../../controllers/lib/journal.controller.js";

// User and item management imports
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

// Item functionality imports
import {
    searchItemsByTitleController,
    createInboxItemController,
    filterItemsController,
    getThisWeekItemsByDateRangeController,
    getUserFavoriteItemsController,
    getSubItemsController,
    getItemsByTypeController,
    getItemsBySourceController
} from "../../controllers/lib/item.controller.js";

// Utility imports
import { uploadFileController } from "../../controllers/lib/fileAsset.controller.js";
import { upload } from "../../loaders/s3.loader.js";
import { feedbackController } from "../../controllers/lib/feedback.controller.js";
import { linkPreviewGeneratorController } from "../../controllers/lib/linkPreview.controller.js";

const router = Router();

/* Inbox Management Routes
-------------------------------------------------- */
router.route("/inbox/")
    .get(getInboxItemsController)
    .post(createInboxItemController);

router.route("/inbox/:item/")
    .get(getInboxItemController)
    .put(updateInboxItemController);

router.route("/inbox/:item/sub-items/").get(getSubItemsController);

/* Timeline Routes
-------------------------------------------------- */
router.route("/this-week/").get(getThisWeekItemsByDateRangeController);
router.route("/today/").get(getUserTodayItemsController);
router.route("/overdue/").get(getUserOverdueItemsController);
router.route("/favorite/").get(getUserFavoriteItemsController);
router.route("/setDate/").post(moveItemtoDateController);
router.route("/:date/").get(getUserItemsByDateController);

/* Journal Routes
-------------------------------------------------- */
router.route("/journals/create-update/").post(createUpdateJournalController);
router.route("/journals/today/").get(getUserTodayJournalController);
router.route("/journals/overview/").get(getUserAllJournalsController);
router.route("/journals/:date/").get(getUserJournalByDateController);

/* Item Management Routes
-------------------------------------------------- */
router.route("/items/").get(getAllitemsController);
router.route("/items/search/").get(searchItemsByTitleController);
router.route("/items/filter/").get(filterItemsController);
router.route("/items/source/").get(getItemsBySourceController);
router.route("/items/all/").get(getAllitemsController);
router.route("/items/:slug").get(getItemsByTypeController);

/* Asset Management Routes
-------------------------------------------------- */
router.route("/file-assets/upload/")
    .post(upload.single("file"), uploadFileController);

/* Utility Routes
-------------------------------------------------- */
router.route("/feedback/").post(feedbackController);
router.route("/get-link-preview/").post(linkPreviewGeneratorController);

export default router;
