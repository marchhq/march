import {
    getGoogleCalendarAccessToken,
    getGoogleCalendarEventsByDate,
    addGoogleCalendarEvent,
    updateGoogleCalendarEvent,
    deleteGoogleCalendarEvent,
    getGoogleCalendarMeetings,
    getGoogleCalendarupComingMeetings,
    checkAccessTokenValidity,
    refreshGoogleCalendarAccessToken,
    revokeGoogleCalendarAccess,
    getGoogleCalendarMeetingsByDate
} from "../..//services/integration/calendar.service.js";

const getGoogleCalendarAccessTokenController = async (req, res, next) => {
    const { code } = req.query;
    const user = req.user;
    try {
        const tokenInfo = await getGoogleCalendarAccessToken(code, user);
        res.status(200).json({
            tokenInfo
        });
    } catch (err) {
        next(err);
    }
};

const getGoogleCalendarEventsByDateController = async (req, res, next) => {
    const user = req.user;
    const { date } = req.params;
    try {
        const events = await getGoogleCalendarEventsByDate(user, date);
        res.status(200).json({
            events
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
            events
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
            refreshToken
        );

        res.status(200).json({
            meetings
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
            newEvent
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
            updatedEvent
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
            ok: "ok"
        });
    } catch (err) {
        next(err);
    }
};

const revokeGoogleCalendarAccessController = async (req, res, next) => {
    const user = req.user;

    try {
        await revokeGoogleCalendarAccess(user);

        res.status(200).json({
            message: 'Google Calendar access revoked successfully.'
        });
    } catch (err) {
        console.error('Error revoking Google Calendar access:', err);
        next(err);
    }
};

const getGoogleCalendarMeetingsByDateController = async (req, res, next) => {
    const user = req.user;
    const date = req.params.date;
    try {
        const events = await getGoogleCalendarMeetingsByDate(user, date);
        res.status(200).json({
            events
        });
    } catch (err) {
        next(err);
    }
};

export {
    getGoogleCalendarAccessTokenController,
    getGoogleCalendarEventsByDateController,
    addGoogleCalendarEventController,
    updateGoogleCalendarEventController,
    deleteGoogleCalendarEventController,
    getGoogleCalendarMeetingsController,
    getGoogleCalendarupComingMeetingsController,
    revokeGoogleCalendarAccessController,
    getGoogleCalendarMeetingsByDateController
};
