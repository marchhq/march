import { Router } from "express";
import { getUserItemsController, getUserTodayItemsController, getUserOverdueItemsController, getUserItemsByDateControlle } from "../../controllers/core/user.controller.js";
import { createPageController, getPagesController, getPageController, updatePageController } from "../../controllers/lib/page.controller.js";
import { createUpdateJournalController, getUserTodayJournalController, getUserAllJournalsController } from "../../controllers/lib/journal.controller.js";
import { createItemController, getItemsController, updateItemController, getItemController } from "../../controllers/lib/item.controller.js";
import { createNoteController, getNotesController, getNoteController, updateNoteController, deleteNoteController } from "../../controllers/lib/note.controller.js";
import { createRecordController, getRecordsController, getRecordController, updateRecordController } from "../../controllers/lib/record.controller.js";
import { createBlockController, getBlocksController, deleteBlockController, getBlockController } from "../../controllers/lib/block.controller.js";

const router = Router();

// inbox
router.route("/my/").get(getUserItemsController)
router.route("/my/today/").get(getUserTodayItemsController)
router.route("/my/overdue/").get(getUserOverdueItemsController)
router.route("/my/:date/").get(getUserItemsByDateControlle)

// space controllers
router.route("/spaces/create/").post(createPageController)
router.route("/spaces/overview/").get(getPagesController)
router.route("/spaces/:space/").get(getPageController)
router.route("/spaces/update/").post(updatePageController)

// rocord controllers
router.route("/records/create/").post(createRecordController)
router.route("/records/overview/").get(getRecordsController)
router.route("/records/:record/").get(getRecordController)
router.route("/records/update/").post(updateRecordController)

// journal controllers
router.route("/journals/create-update/").post(createUpdateJournalController)
router.route("/journals/today/").get(getUserTodayJournalController)
router.route("/journals/overview/").get(getUserAllJournalsController)

// item controllers
router.route("/items/create/").post(createItemController)
router.route("/items/overview/").get(getItemsController)
router.route("/items/:item/").get(getItemController)
router.route("/items/update/").post(updateItemController)

// note controllers
router.route("/notes/create/").post(createNoteController)
router.route("/notes/overview/").get(getNotesController)
router.route("/notes/:note/").get(getNoteController)
router.route("/notes/update/").post(updateNoteController)
router.route("/notes/delete/").post(deleteNoteController)

// Block controllers
router.route("/blocks/create/").post(createBlockController)
router.route("/blocks/overview/").get(getBlocksController)
router.route("/blocks/:block/").get(getBlockController)
router.route("/blocks/delete/").post(deleteBlockController)

export default router;
