import { Router } from "express";

import {
    createSpaceController,
    getSpacesController,
    getSpaceController,
    updateSpaceController,
    getSpaceByNameController
} from "../../controllers/lib/space.controller.js";

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

const router = Router();

// space controllers
router.route("/create/").post(createSpaceController);
router.route("/overview/").get(getSpacesController);
router.route("/:space/").get(getSpaceController);
router.route("/:space/").put(updateSpaceController);
router.route("/name/:space").get(getSpaceByNameController);

// Block controllers
router.route("/:space/blocks/create/").post(createBlockController);
router.route("/:space/blocks/overview/").get(getBlocksController);
router.route("/:space/blocks/:block/").get(getBlockController);
router.route("/:space/blocks/:block/").put(updateBlockController);
router.route("/:space/blocks/:block/").delete(deleteBlockController);

// item controllers
router.route("/:space/blocks/:block/items/create/").post(createItemController);
router.route("/items/filter-by-label/").get(getItemFilterByLabelController)
router.route("/items/search/").get(searchItemsByTitleController);

router.route("/items/overview/").get(getItemsController);
router.route("/items/:item/").get(getItemController);
router.route("/items/:item/").put(updateItemController);

// note controllers
router.route("/notes/overview/").get(getNotesController);
router.route("/notes/recent-updated/").get(getMostRecentUpdatedNoteController);

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

export default router;
