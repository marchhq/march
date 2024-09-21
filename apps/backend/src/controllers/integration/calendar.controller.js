import {
  getGoogleCalendarOAuthAuthorizationUrl,
  getGoogleCalendarAccessToken,
  getGoogleCalendarEvents,
  addGoogleCalendarEvent,
  updateGoogleCalendarEvent,
  deleteGoogleCalendarEvent,
  getGoogleCalendarMeetings,
  getGoogleCalendarupComingMeetings,
  checkAccessTokenValidity,
  refreshGoogleCalendarAccessToken,
  setUpCalendarWatch,
  handleCalendarWebhookService,
} from "../..//services/integration/calendar.service.js";
import { calendarQueue } from "../../loaders/bullmq.loader.js";
import { environment } from "../../loaders/environment.loader.js";
import { User } from "../../models/core/user.model.js";
// import { listener } from "../../../index.js";

const redirectGoogleCalendarOAuthLoginController = async (req, res, next) => {
  try {
    const authUrl = getGoogleCalendarOAuthAuthorizationUrl();
    console.log("auth: ", authUrl);
    res.redirect(authUrl);
  } catch (err) {
    console.error("Error in redirectGoogleCalendarOAuthLoginController:", err);
    next(err);
  }
};

const getGoogleCalendarAccessTokenController = async (req, res, next) => {
  const { code } = req.query;
  const user = req.user;
  try {
    const tokenInfo = await getGoogleCalendarAccessToken(code, user);
    // const url = `${listener.url()}/calendar/webhook/?user=${user._id}`
    const url = `${environment.CALENDAR_WEBHOOK_URL}/calendar/webhook/?user=${user._id}`;
    console.log("url: ", url);
    await setUpCalendarWatch(tokenInfo.access_token, "primary", url);
    // const watchResponse = await setUpCalendarWatch(tokenInfo.access_token, 'primary', environment.CALENDAR_WEBHOOK_URL)
    await calendarQueue.add("calendarQueue", {
      accessToken: tokenInfo.access_token,
      refreshToken: tokenInfo.refresh_token,
      userId: user._id,
    });
    res.status(200).json({
      tokenInfo,
    });
  } catch (err) {
    next(err);
  }
};

const getGoogleCalendarEventsController = async (req, res, next) => {
  const user = req.user;
  try {
    const events = await getGoogleCalendarEvents(user);
    res.status(200).json({
      events,
    });
  } catch (err) {
    next(err);
  }
};

const getGoogleCalendarMeetingsController = async (req, res, next) => {
  const user = req.user;
  try {
    const events = await getGoogleCalendarMeetings(user);
    res.status(200).json({
      events,
    });
  } catch (err) {
    next(err);
  }
};

const getGoogleCalendarupComingMeetingsController = async (req, res, next) => {
  try {
    const user = req.user;
    let accessToken = user.integration.googleCalendar.accessToken;
    const refreshToken = user.integration.googleCalendar.refreshToken;

    const isValid = await checkAccessTokenValidity(accessToken);

    if (!isValid) {
      accessToken = await refreshGoogleCalendarAccessToken(user);
    }
    const meetings = await getGoogleCalendarupComingMeetings(
      accessToken,
      refreshToken,
    );

    res.status(200).json({
      meetings,
    });
  } catch (err) {
    next(err);
  }
};

const addGoogleCalendarEventController = async (req, res, next) => {
  const user = req.user;
  const event = req.body;
  try {
    const newEvent = await addGoogleCalendarEvent(user, event);
    res.status(200).json({
      newEvent,
    });
  } catch (err) {
    next(err);
  }
};

const updateGoogleCalendarEventController = async (req, res, next) => {
  const user = req.user;
  const { eventId } = req.params;
  const event = req.body;
  try {
    const updatedEvent = await updateGoogleCalendarEvent(user, eventId, event);
    res.status(200).json({
      updatedEvent,
    });
  } catch (err) {
    next(err);
  }
};

const deleteGoogleCalendarEventController = async (req, res, next) => {
  const user = req.user;
  const { eventId } = req.params;
  try {
    await deleteGoogleCalendarEvent(user, eventId);
    res.status(200).json({
      ok: "ok",
    });
  } catch (err) {
    next(err);
  }
};

const handleCalendarWebhook = async (req, res, next) => {
  const channelToken = req.headers["x-goog-channel-token"];
  const resourceState = req.headers["x-goog-resource-state"];
  const userId = req.query.user;
  if (channelToken !== environment.CALENDAR_WEBHOOK_SECRET) {
    return res.status(403).send("Invalid webhook token");
  }

  if (resourceState === "sync") {
    return res.status(200).send();
  }

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).send("User not found");
  }

  try {
    let accessToken = user.integration.googleCalendar.accessToken;
    const refreshToken = user.integration.googleCalendar.refreshToken;

    const isValid = await checkAccessTokenValidity(accessToken);

    if (!isValid) {
      accessToken = await refreshGoogleCalendarAccessToken(user);
    }
    await handleCalendarWebhookService(accessToken, refreshToken, userId);
    res.status(200).send("Webhook event processed");
  } catch (err) {
    next(err);
  }
};

export {
  redirectGoogleCalendarOAuthLoginController,
  getGoogleCalendarAccessTokenController,
  getGoogleCalendarEventsController,
  addGoogleCalendarEventController,
  updateGoogleCalendarEventController,
  deleteGoogleCalendarEventController,
  getGoogleCalendarMeetingsController,
  getGoogleCalendarupComingMeetingsController,
  handleCalendarWebhook,
};
