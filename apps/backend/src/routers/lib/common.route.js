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
    getUserObjectsByDateController,
    moveItemtoDateController,
    getAllitemsController
} from "../../controllers/core/user.controller.js";

// Item functionality imports
import {
    searchObjectsByTitleController,
    createInboxObjectController,
    filterObjectsController,
    getThisWeekObjectsByDateRangeController,
    getUserFavoriteObjectsController,
    getSubObjectsController,
    getObjectsBySourceController,
    getObjectsByTypeAndSourceController
} from "../../controllers/lib/object.controller.js";

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
    .post(createInboxObjectController);

router.route("/inbox/:item/")
    .get(getInboxItemController)
    .put(updateInboxItemController);

router.route("/inbox/:item/sub-items/").get(getSubObjectsController);

/* Timeline Routes
-------------------------------------------------- */
router.route("/this-week/").get(getThisWeekObjectsByDateRangeController);
router.route("/today/").get(getUserTodayItemsController);
router.route("/overdue/").get(getUserOverdueItemsController);
router.route("/favorite/").get(getUserFavoriteObjectsController);
router.route("/setDate/").post(moveItemtoDateController);
router.route("/items/").get(getObjectsByTypeAndSourceController);
router.route("/:date/").get(getUserObjectsByDateController);

/* Journal Routes
-------------------------------------------------- */
router.route("/journals/create-update/").post(createUpdateJournalController);
router.route("/journals/today/").get(getUserTodayJournalController);
router.route("/journals/overview/").get(getUserAllJournalsController);
router.route("/journals/:date/").get(getUserJournalByDateController);

/* Item Management Routes
-------------------------------------------------- */
router.route("/items/").get(getAllitemsController);
router.route("/items/search/").get(searchObjectsByTitleController);
router.route("/items/filter/").get(filterObjectsController);
router.route("/items/source/").get(getObjectsBySourceController);
router.route("/items/all/").get(getAllitemsController);

/* Asset Management Routes
-------------------------------------------------- */
router.route("/file-assets/upload/")
    .post(upload.single("file"), uploadFileController);

/* Utility Routes
-------------------------------------------------- */
router.route("/feedback/").post(feedbackController);
router.route("/get-link-preview/").post(linkPreviewGeneratorController);

export default router;
