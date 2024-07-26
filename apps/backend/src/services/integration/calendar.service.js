import { google } from "googleapis";
import axios from 'axios';
import { OauthClient } from "../../loaders/google.loader.js";
import { clerk } from "../../middlewares/clerk.middleware.js";

const getGoogleCalendarOAuthAuthorizationUrl = () => {
    const authUrl = OauthClient.generateAuthUrl({
        access_type: 'offline',
        scope: ['https://www.googleapis.com/auth/calendar']
    });
    return authUrl;
};

const getGoogleCalendarAccessToken = async (code, user) => {
    const { tokens } = await OauthClient.getToken(code);
    OauthClient.setCredentials(tokens);

    await clerk.users.updateUserMetadata(user, {
        privateMetadata: {
            integration: {
                googleCalendar: {
                    accessToken: tokens.access_token,
                    refreshToken: tokens.refresh_token
                }
            }
        }
    });

    // user.integration.googleCalendar.accessToken = tokens.access_token;
    // user.integration.googleCalendar.refreshToken = tokens.refresh_token;
    // await user.save();
    return tokens;
};

const refreshGoogleCalendarAccessToken = async (user) => {
    OauthClient.setCredentials({
        refresh_token: user.privateMetadata.integration.googleCalendar.refreshToken
    });

    const { credentials } = await OauthClient.refreshAccessToken();
    console.log("access_token: ", credentials.access_token);
    // user.integration.googleCalendar.accessToken = credentials.access_token;
    // user.integration.googleCalendar.refreshToken = credentials.refresh_token;
    // await user.save();
    await clerk.users.updateUserMetadata(user, {
        privateMetadata: {
            integration: {
                googleCalendar: {
                    accessToken: credentials.access_token,
                    refreshToken: credentials.refresh_tokenn
                }
            }
        }
    });

    return credentials.access_token;
};

const checkAccessTokenValidity = async (accessToken) => {
    try {
        const response = await axios.get('https://www.googleapis.com/calendar/v3/users/me/calendarList', {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        if (response.status === 200) {
            console.log("Access token is valid.");
            return true;
        }
    } catch (error) {
        console.error("Error checking access token validity:", error);
    }
    console.log("Access token is invalid.");
    return false;
};

const getGoogleCalendarEvents = async (id) => {
    const user = await clerk.users.getUser(id);
    let accessToken = user.privateMetadata.integration.googleCalendar.accessToken;
    const refreshToken = user.privateMetadata.integration.googleCalendar.refreshToken

    const isValid = await checkAccessTokenValidity(accessToken);

    if (!isValid) {
        accessToken = await refreshGoogleCalendarAccessToken(user);
    }

    OauthClient.setCredentials({
        access_token: accessToken,
        refresh_token: refreshToken
    });

    const calendar = google.calendar({ version: 'v3', auth: OauthClient });
    const events = await calendar.events.list({
        calendarId: 'primary'
    });

    return events.data.items;
};

const addGoogleCalendarEvent = async (id, event) => {
    const user = await clerk.users.getUser(id);
    let accessToken = user.privateMetadata.integration.googleCalendar.accessToken;
    const refreshToken = user.privateMetadata.integration.googleCalendar.refreshToken
    const isValid = await checkAccessTokenValidity(accessToken);

    if (!isValid) {
        accessToken = await refreshGoogleCalendarAccessToken(user);
    }

    OauthClient.setCredentials({
        access_token: accessToken,
        refresh_token: refreshToken
    });

    const calendar = google.calendar({ version: 'v3', auth: OauthClient });
    const newEvent = await calendar.events.insert({
        calendarId: 'primary',
        resource: event
    });

    return newEvent.data;
};

const updateGoogleCalendarEvent = async (id, eventId, event) => {
    const user = await clerk.users.getUser(id);
    let accessToken = user.privateMetadata.integration.googleCalendar.accessToken;
    const refreshToken = user.privateMetadata.integration.googleCalendar.refreshToken

    const isValid = await checkAccessTokenValidity(accessToken);

    if (!isValid) {
        accessToken = await refreshGoogleCalendarAccessToken(user);
    }

    OauthClient.setCredentials({
        access_token: accessToken,
        refresh_token: refreshToken
    });

    const calendar = google.calendar({ version: 'v3', auth: OauthClient });
    const updatedEvent = await calendar.events.update({
        calendarId: 'primary',
        eventId: eventId,
        resource: event
    });

    return updatedEvent.data;
};

const deleteGoogleCalendarEvent = async (id, eventId) => {
    const user = await clerk.users.getUser(id);
    let accessToken = user.privateMetadata.integration.googleCalendar.accessToken;
    const refreshToken = user.privateMetadata.integration.googleCalendar.refreshToken

    const isValid = await checkAccessTokenValidity(accessToken);

    if (!isValid) {
        accessToken = await refreshGoogleCalendarAccessToken(user);
    }

    OauthClient.setCredentials({
        access_token: accessToken,
        refresh_token: refreshToken
    });

    const calendar = google.calendar({ version: 'v3', auth: OauthClient });
    await calendar.events.delete({
        calendarId: 'primary',
        eventId
    });

    return { success: true };
};

export {
    getGoogleCalendarOAuthAuthorizationUrl,
    getGoogleCalendarAccessToken,
    refreshGoogleCalendarAccessToken,
    checkAccessTokenValidity,
    getGoogleCalendarEvents,
    addGoogleCalendarEvent,
    updateGoogleCalendarEvent,
    deleteGoogleCalendarEvent
}
