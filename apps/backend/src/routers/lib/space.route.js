import { Router } from "express";
import {
    getUserItemsController,
    getUserTodayItemsController,
    getUserOverdueItemsController,
    getUserItemsByDateControlle,
    moveItemtoDateController,
    getAllitemsController
} from "../../controllers/core/user.controller.js";
import {
    createSpaceController,
    getSpacesController,
    getSpaceController,
    updateSpaceController,
    getSpaceByNameController
} from "../../controllers/lib/space.controller.js";
import {
    createUpdateJournalController,
    getUserTodayJournalController,
    getUserAllJournalsController,
    getUserJournalByDateController
} from "../../controllers/lib/journal.controller.js";
import {
    createItemController,
    getItemsController,
    updateItemController,
    getItemController,
    getItemFilterByLabelController,
    searchItemsByTitleController
} from "../../controllers/lib/item.controller.js";
import {
    getNotesController,
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
    deleteMeetingController,
    getMeetingByIdController,
    recentUpcomingMeetingController
} from "../../controllers/page/meeting.controller.js";
import { createLabelController, getLabelsController, getLabelController, updateLabelController, deleteLabelController, getLabelsBySpaceController } from "../../controllers/lib/label.controller.js";
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

// space controllers
router.route("/spaces/create/").post(createSpaceController);
router.route("/spaces/overview/").get(getSpacesController);
router.route("/spaces/:space/").get(getSpaceController);
router.route("/spaces/:space/").put(updateSpaceController);
router.route("/spaces/name/:space").get(getSpaceByNameController);

// journal controllers
router.route("/journals/create-update/").post(createUpdateJournalController);
router.route("/journals/today/").get(getUserTodayJournalController);
router.route("/journals/overview/").get(getUserAllJournalsController);
router.route("/journals/:date/").get(getUserJournalByDateController);

// item controllers
router.route("/items/").get(getAllitemsController);
router.route("/items/create/").post(createItemController);
router.route("/items/filter-by-label/").get(getItemFilterByLabelController)
router.route("/items/search/").get(searchItemsByTitleController);

router.route("/items/overview/").get(getItemsController);
router.route("/items/:item/").get(getItemController);
router.route("/items/:item/").put(updateItemController);

// note controllers
router.route("/notes/overview/").get(getNotesController);
router.route("/notes/recent-updated/").get(getMostRecentUpdatedNoteController);

// Block controllers
router.route("/blocks/create/").post(createBlockController);
router.route("/blocks/overview/").get(getBlocksController);
router.route("/blocks/:block/").get(getBlockController);
router.route("/blocks/:block/").put(updateBlockController);
router.route("/blocks/:block/").delete(deleteBlockController);

// Meeting controllers
router.route("/meetings/overview/").get(getMeetingsController);
router.route("/meetings/upcomings/").get(getUpcomingMeetingsController);
router.route("/meetings/recent-upcoming-meeting/").get(recentUpcomingMeetingController);
router.route("/meetings/:meeting/").get(getMeetingByIdController);
router.route("/meetings/:meeting/").put(updateMeetingController);
router.route("/meetings/:meeting/").delete(deleteMeetingController);

// Labels controller
router.route("/labels/create/").post(createLabelController)
router.route("/labels/overview/").get(getLabelsController)
router.route("/labels/:label/").get(getLabelController)
router.route("/labels/:label/").put(updateLabelController)
router.route("/labels/:label/").delete(deleteLabelController)
router.route("/spaces/:space/labels/").get(getLabelsBySpaceController)

// File Asset controllers
router
    .route("/file-assets/upload/")
    .post(upload.single("file"), uploadFileController);

// Feedback controller
router.route("/feedback/").post(feedbackController);

// Link preview controller
router.route("/get-link-preview/").post(linkPreviewGeneratorController);

export default router;
