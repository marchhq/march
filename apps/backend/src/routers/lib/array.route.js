import { Router } from "express";

import {
    createArrayController,
    getArraysController,
    getArrayController,
    updateArrayController,
    getArrayByNameController
} from "../../controllers/lib/array.controller.js";

import {
    createObjectController,
    getAllObjectsByBloackController,
    // getObjectFilterByLabelController,
    getSubObjectsController,
    getObjectController,
    updateObjectController
} from "../../controllers/lib/object.controller.js";

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
// import { createLabelController, getLabelsController, getLabelController, updateLabelController, deleteLabelController } from "../../controllers/lib/label.controller.js";

const router = Router();

// arrays controllers
router.route("/").post(createArrayController);
router.route("/").get(getArraysController);
router.route("/:array/").get(getArrayController);
router.route("/:array/").put(updateArrayController);
router.route("/name/:array/").get(getArrayByNameController);

// // items filter by label name
// router.route("/:space/items/filter-by-label/").get(getObjectFilterByLabelController)

// // Labels controller left with this
// router.route("/:space/labels/").post(createLabelController)
// router.route("/:space/labels/").get(getLabelsController)
// router.route("/:space/labels/:label/").get(getLabelController)
// router.route("/:space/labels/:label/").put(updateLabelController)
// router.route("/:space/labels/:label/").delete(deleteLabelController)

// Block controllers
router.route("/:array/blocks/").post(createBlockController);
router.route("/:array/blocks/").get(getBlocksController);
router.route("/:array/blocks/:block/").get(getBlockController);
router.route("/:array/blocks/:block/").put(updateBlockController);
router.route("/:array/blocks/:block/").delete(deleteBlockController);

// object controllers
router.route("/:array/blocks/:block/objects/").post(createObjectController);
router.route("/:array/blocks/:block/objects/").get(getAllObjectsByBloackController);
router.route("/:array/blocks/:block/objects/:object/").get(getObjectController);
router.route("/:array/blocks/:block/objects/:object/").put(updateObjectController);
router.route("/:array/blocks/:block/objects/:object/sub-objects/").get(getSubObjectsController);

// Meeting controllers

router.route("/meetings/overview/").get(getMeetingsController);
router.route("/meetings/:meeting/").get(getMeetingByIdController);
router.route("/meetings/:meeting/").put(updateMeetingController);

export default router;
