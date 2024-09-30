import { Router } from "express";
import {
    getUserItemsController,
    getUserTodayItemsController,
    getUserOverdueItemsController,
    getUserItemsByDateControlle,
    moveItemtoDateController
} from "../../controllers/core/user.controller.js";
import {
    createPageController,
    getPagesController,
    getPageController,
    updatePageController
} from "../../controllers/lib/page.controller.js";
import {
    createUpdateJournalController,
    getUserTodayJournalController,
    getUserAllJournalsController
} from "../../controllers/lib/journal.controller.js";
import {
    createItemController,
    getItemsController,
    updateItemController,
    getItemController
} from "../../controllers/lib/item.controller.js";
import {
    createNoteController,
    getNotesController,
    getNoteController,
    updateNoteController,
    deleteNoteController,
    getMostRecentUpdatedNoteController
} from "../../controllers/lib/note.controller.js";

import {
    createBlockController,
    getBlocksController,
    deleteBlockController,
    getBlockController,
    updateBlockController
} from "../../controllers/lib/block.controller.js";
import {
    getMeetingsController,
    getUpcomingMeetingsController,
    updateMeetingController,
    deleteMeetingController
} from "../../controllers/page/meeting.controller.js";
import { createLabelController } from "../../controllers/lib/label.controller.js";
import { uploadFileController } from "../../controllers/lib/fileAsset.controller.js";
import { upload } from "../../loaders/s3.loader.js";
import { feedbackController } from "../../controllers/lib/feedback.controller.js";

const router = Router();

// inbox
router.route("/my/").get(getUserItemsController);
router.route("/my/today/").get(getUserTodayItemsController);
router.route("/my/overdue/").get(getUserOverdueItemsController);
router.route("/my/:date/").get(getUserItemsByDateControlle);
router.route("/setDate/").post(moveItemtoDateController);

// space controllers
router.route("/spaces/create/").post(createPageController);
router.route("/spaces/overview/").get(getPagesController);
router.route("/spaces/:space/").get(getPageController);
router.route("/spaces/:space/").put(updatePageController);

// journal controllers
router.route("/journals/create-update/").post(createUpdateJournalController);
router.route("/journals/today/").get(getUserTodayJournalController);
// todo: add a api to get journal by date
router.route("/journals/overview/").get(getUserAllJournalsController);

// item controllers
router.route("/items/create/").post(createItemController);
router.route("/items/overview/").get(getItemsController);
router.route("/items/:item/").get(getItemController);
router.route("/items/:item/").put(updateItemController);

// note controllers
router.route("/notes/create/").post(createNoteController); // no need
router.route("/notes/overview/").get(getNotesController);
router.route("/notes/recent-updated/").get(getMostRecentUpdatedNoteController);
router.route("/notes/:note/").get(getNoteController); // no need
router.route("/notes/:note/").put(updateNoteController); // no need
router.route("/notes/:note/").delete(deleteNoteController); // no need

// Block controllers
router.route("/blocks/create/").post(createBlockController);
router.route("/blocks/overview/").get(getBlocksController);
router.route("/blocks/:block/").get(getBlockController);
router.route("/blocks/:block/").put(updateBlockController);
router.route("/blocks/:block/").delete(deleteBlockController);

// Meeting controllers
router.route("/meetings/overview/").get(getMeetingsController);
router.route("/meetings/upcomings/").get(getUpcomingMeetingsController);
router.route("/meetings/:meeting/").put(updateMeetingController);
router.route("/meetings/:meeting/").delete(deleteMeetingController);

// Labels controller
router.route("/labels/create/").post(createLabelController)

// File Asset controllers
router
    .route("/file-assets/upload/")
    .post(upload.single("file"), uploadFileController);

// Feedback controllers
router.route("/feedback/").post(feedbackController);

export default router;
