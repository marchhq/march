import { Router } from "express";
import multer from 'multer';
import { getUserItemsController, getUserTodayItemsController, getUserOverdueItemsController, getUserItemsByDateControlle, moveItemtoDateController } from "../../controllers/core/user.controller.js";
import { createPageController, getPagesController, getPageController, updatePageController } from "../../controllers/lib/page.controller.js";
import { createUpdateJournalController, getUserTodayJournalController, getUserAllJournalsController } from "../../controllers/lib/journal.controller.js";
import { createItemController, getItemsController, updateItemController, getItemController } from "../../controllers/lib/item.controller.js";
import { createNoteController, getNotesController, getNoteController, updateNoteController, deleteNoteController } from "../../controllers/lib/note.controller.js";
import { createRecordController, getRecordsController, getRecordController, updateRecordController } from "../../controllers/lib/record.controller.js";
import { createBlockController, getBlocksController, deleteBlockController, getBlockController, updateBlockController } from "../../controllers/lib/block.controller.js";
import { getMeetingsController, getUpcomingMeetingsController, updateMeetingController, deleteMeetingController } from "../../controllers/page/meeting.controller.js";
import { uploadFileController } from "../../controllers/lib/fileAsset.controller.js";
import { upload } from "../../loaders/s3.loader.js"; 

const router = Router();

// inbox
router.route("/my/").get(getUserItemsController)
router.route("/my/today/").get(getUserTodayItemsController)
router.route("/my/overdue/").get(getUserOverdueItemsController)
router.route("/my/:date/").get(getUserItemsByDateControlle)
router.route("/setDate/").post(moveItemtoDateController)

// space controllers
router.route("/spaces/create/").post(createPageController)
router.route("/spaces/overview/").get(getPagesController)
router.route("/spaces/:space/").get(getPageController)
router.route("/spaces/:space/").put(updatePageController)

// rocord controllers
router.route("/records/create/").post(createRecordController)
router.route("/records/overview/").get(getRecordsController)
router.route("/records/:record/").get(getRecordController)
router.route("/records/:record/").put(updateRecordController)

// journal controllers
router.route("/journals/create-update/").post(createUpdateJournalController)
router.route("/journals/today/").get(getUserTodayJournalController)
// todo: added a api to get journal by date
router.route("/journals/overview/").get(getUserAllJournalsController)

// item controllers
router.route("/items/create/").post(createItemController)
router.route("/items/overview/").get(getItemsController)
router.route("/items/:item/").get(getItemController)
router.route("/items/:item/").put(updateItemController)

// note controllers
router.route("/notes/create/").post(createNoteController)
router.route("/notes/overview/").get(getNotesController)
router.route("/notes/:note/").get(getNoteController)
router.route("/notes/:note/").put(updateNoteController)
router.route("/notes/:note/").delete(deleteNoteController)

// Block controllers
router.route("/blocks/create/").post(createBlockController)
router.route("/blocks/overview/").get(getBlocksController)
router.route("/blocks/:block/").get(getBlockController)
router.route("/blocks/:block/").put(updateBlockController)
router.route("/blocks/:block/").delete(deleteBlockController)

// Meeting controllers
router.route("/meetings/overview/").get(getMeetingsController)
router.route("/meetings/upcomings/").get(getUpcomingMeetingsController)
router.route("/meetings/:meeting/").put(updateMeetingController)
router.route("/meetings/:meeting/").delete(deleteMeetingController)

// File Asset controllers
router.route('/file-assets/upload').post(upload.single('file'), uploadFileController);

export default router;
