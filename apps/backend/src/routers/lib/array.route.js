import { Router } from "express";

import {
    createArrayController,
    getArraysController,
    getArrayController,
    updateArrayController,
    getArrayByNameController
} from "../../controllers/lib/array.controller.js";

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
    updateMeetingController,
    getMeetingByIdController
} from "../../controllers/page/meeting.controller.js";
import { createLabelController, getLabelsController, getLabelController, updateLabelController, deleteLabelController } from "../../controllers/lib/label.controller.js";

const router = Router();

// arrays controllers
router.route("/").post(createArrayController);
router.route("/").get(getArraysController);
router.route("/:array/").get(getArrayController);
router.route("/:array/").put(updateArrayController);
router.route("/name/:array/").get(getArrayByNameController);

// items filter by label name
router.route("/:space/items/filter-by-label/").get(getItemFilterByLabelController)

// Labels controller left with this
router.route("/:space/labels/").post(createLabelController)
router.route("/:space/labels/").get(getLabelsController)
router.route("/:space/labels/:label/").get(getLabelController)
router.route("/:space/labels/:label/").put(updateLabelController)
router.route("/:space/labels/:label/").delete(deleteLabelController)

// Block controllers
router.route("/:array/blocks/").post(createBlockController);
router.route("/:array/blocks/").get(getBlocksController);
router.route("/:array/blocks/:block/").get(getBlockController);
router.route("/:array/blocks/:block/").put(updateBlockController);
router.route("/:array/blocks/:block/").delete(deleteBlockController);

// item controllers
router.route("/:space/blocks/:block/items/").post(createItemController);
router.route("/:space/blocks/:block/items/").get(getAllItemsByBloackController);
router.route("/:space/blocks/:block/items/:item/").get(getItemController);
router.route("/:space/blocks/:block/items/:item/").put(updateItemController);
router.route("/:space/blocks/:block/items/:item/sub-items/").get(getSubItemsController);

// Meeting controllers

router.route("/meetings/overview/").get(getMeetingsController);
router.route("/meetings/:meeting/").get(getMeetingByIdController);
router.route("/meetings/:meeting/").put(updateMeetingController);

export default router;
