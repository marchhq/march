import { getGoogleCalendarOAuthAuthorizationUrl, getGoogleCalendarAccessToken, getGoogleCalendarEvents, addGoogleCalendarEvent, updateGoogleCalendarEvent, deleteGoogleCalendarEvent } from "../..//services/integration/calendar.service.js"

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
    const user = req.auth.userId;
    try {
        const tokenInfo = await getGoogleCalendarAccessToken(code, user);
        res.status(200).json({
            statusCode: 200,
            response: tokenInfo
        });
    } catch (err) {
        next(err);
    }
};

const getGoogleCalendarEventsController = async (req, res, next) => {
    const user = req.auth.userId;
    try {
        const events = await getGoogleCalendarEvents(user);
        res.status(200).json({
            statusCode: 200,
            response: events
        });
    } catch (err) {
        next(err);
    }
};

const addGoogleCalendarEventController = async (req, res, next) => {
    const user = req.auth.userId;
    const event = req.body;
    try {
        const newEvent = await addGoogleCalendarEvent(user, event);
        res.status(200).json({
            statusCode: 200,
            response: newEvent
        });
    } catch (err) {
        next(err);
    }
};

const updateGoogleCalendarEventController = async (req, res, next) => {
    const user = req.auth.userId;
    const { eventId } = req.params;
    const event = req.body;
    try {
        const updatedEvent = await updateGoogleCalendarEvent(user, eventId, event);
        res.status(200).json({
            statusCode: 200,
            response: updatedEvent
        });
    } catch (err) {
        next(err);
    }
};

const deleteGoogleCalendarEventController = async (req, res, next) => {
    const user = req.auth.userId;
    const { eventId } = req.params;
    try {
        await deleteGoogleCalendarEvent(user, eventId);
        res.status(200).json({
            status: 200,
            message: 'event deleted successfully'
        });
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
    deleteGoogleCalendarEventController
}
