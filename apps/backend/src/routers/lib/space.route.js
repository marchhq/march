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
    getAllItemsByBloackController,
    updateItemController,
    getItemController,
    getItemFilterByLabelController,
    getSubItemsController
} from "../../controllers/lib/item.controller.js";

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
import { createLabelController, getLabelsController, getLabelController, updateLabelController, deleteLabelController } from "../../controllers/lib/label.controller.js";

const router = Router();

// space controllers
router.route("/").post(createSpaceController);
router.route("/").get(getSpacesController);
router.route("/:space/").get(getSpaceController);
router.route("/:space/").put(updateSpaceController);
router.route("/name/:space").get(getSpaceByNameController);

// items filter by label name
router.route("/:space/items/filter-by-label/").get(getItemFilterByLabelController)

// Labels controller left with this
router.route("/:space/labels/").post(createLabelController)
router.route("/:space/labels/").get(getLabelsController)
router.route("/:space/labels/:label/").get(getLabelController)
router.route("/:space/labels/:label/").put(updateLabelController)
router.route("/:space/labels/:label/").delete(deleteLabelController)

// Block controllers
router.route("/:space/blocks/").post(createBlockController);
router.route("/:space/blocks/").get(getBlocksController);
router.route("/:space/blocks/:block/").get(getBlockController);
router.route("/:space/blocks/:block/").put(updateBlockController);
router.route("/:space/blocks/:block/").delete(deleteBlockController);

// item controllers
router.route("/:space/blocks/:block/items/").post(createItemController);
router.route("/:space/blocks/:block/items/").get(getAllItemsByBloackController);
router.route("/:space/blocks/:block/items/:item/").get(getItemController);
router.route("/:space/blocks/:block/items/:item/").put(updateItemController);
router.route("/:space/blocks/:block/items/:item/sub-items/").get(getSubItemsController);

// Meeting controllers
router.route("/meetings/overview/").get(getMeetingsController);
router.route("/meetings/upcomings/").get(getUpcomingMeetingsController);
router.route("/meetings/recent-upcoming-meeting/").get(recentUpcomingMeetingController);
router.route("/meetings/:meeting/").get(getMeetingByIdController);
router.route("/meetings/:meeting/").put(updateMeetingController);
router.route("/meetings/:meeting/").delete(deleteMeetingController);

export default router;
