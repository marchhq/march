import { Router } from "express";
import { redirectGoogleCalendarOAuthLoginController, getGoogleCalendarAccessTokenController, getGoogleCalendarEventsController, addGoogleCalendarEventController, updateGoogleCalendarEventController, deleteGoogleCalendarEventController, getGoogleCalendarMeetingsController } from "../../controllers/integration/calendar.controller.js";

const router = Router();

router.route("/connect/").get(redirectGoogleCalendarOAuthLoginController)
router.route("/getAccessToken/").get(getGoogleCalendarAccessTokenController)
router.route("/events/").get(getGoogleCalendarEventsController)
router.route("/events/").post(addGoogleCalendarEventController)
router.route("/events/:eventId/").patch(updateGoogleCalendarEventController)
router.route("/events/:eventId/").delete(deleteGoogleCalendarEventController)

// get meeting
router.route("/meetings/").get(getGoogleCalendarMeetingsController)

export default router;
