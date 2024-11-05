import { Router } from "express";
import { getGoogleCalendarAccessTokenController, getGoogleCalendarEventsController, addGoogleCalendarEventController, updateGoogleCalendarEventController, deleteGoogleCalendarEventController, getGoogleCalendarMeetingsController, getGoogleCalendarupComingMeetingsController, revokeGoogleCalendarAccessController, getGoogleCalendarMeetingsByDateController } from "../../controllers/integration/calendar.controller.js";

const router = Router();

router.route("/getAccessToken/").get(getGoogleCalendarAccessTokenController)
router.route("/events/").get(getGoogleCalendarEventsController)
router.route("/events/").post(addGoogleCalendarEventController)
router.route("/events/:eventId/").patch(updateGoogleCalendarEventController)
router.route("/events/:eventId/").delete(deleteGoogleCalendarEventController)
router.route("/revoke-access/").get(revokeGoogleCalendarAccessController)

// get meetings
router.route("/meetings/").get(getGoogleCalendarMeetingsController)
router.route("/meetings/upcoming/").get(getGoogleCalendarupComingMeetingsController)
router.route("/meetings/:date/").get(getGoogleCalendarMeetingsByDateController);

export default router;
