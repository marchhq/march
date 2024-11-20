import { google } from "googleapis";
import axios from 'axios';
import { OauthCalClient } from "../../loaders/google.loader.js";

const getGoogleCalendarAccessToken = async (code, user) => {
    const { tokens } = await OauthCalClient.getToken(code);
    OauthCalClient.setCredentials(tokens);
    user.integration.googleCalendar.accessToken = tokens.access_token;
    user.integration.googleCalendar.refreshToken = tokens.refresh_token;
    user.integration.googleCalendar.connected = true;
    const calendar = google.calendar({ version: 'v3', auth: OauthCalClient });
    const { data } = await calendar.settings.get({ setting: 'timezone' });
    const userTimezone = data.value;
    user.timezone = userTimezone
    await user.save();

    return { tokens, userTimezone };
};

const refreshGoogleCalendarAccessToken = async (user) => {
    OauthCalClient.setCredentials({
        refresh_token: user.integration.googleCalendar.refreshToken
    });

    const { credentials } = await OauthCalClient.refreshAccessToken();
    user.integration.googleCalendar.accessToken = credentials.access_token;
    user.integration.googleCalendar.refreshToken = credentials.refresh_token;
    await user.save();

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
            return true;
        }
    } catch (error) {
        console.error("Error checking access token validity:", error);
    }
    return false;
};

const getGoogleCalendarEventsByDate = async (user, date) => {
    let accessToken = user.integration.googleCalendar.accessToken;
    const refreshToken = user.integration.googleCalendar.refreshToken;
    const timeZone = user.timezone;

    const isValid = await checkAccessTokenValidity(accessToken);

    if (!isValid) {
        accessToken = await refreshGoogleCalendarAccessToken(user);
    }

    OauthCalClient.setCredentials({
        access_token: accessToken,
        refresh_token: refreshToken
    });

    const calendar = google.calendar({ version: 'v3', auth: OauthCalClient });

    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    const timeMin = startDate.toISOString();
    const timeMax = endDate.toISOString();

    const events = await calendar.events.list({
        calendarId: 'primary',
        timeMin,
        timeMax,
        timeZone,
        singleEvents: true,
        orderBy: 'startTime'
    });

    return events.data.items;
};

const getGoogleCalendarMeetings = async (user) => {
    let accessToken = user.integration.googleCalendar.accessToken;
    const refreshToken = user.integration.googleCalendar.refreshToken

    const isValid = await checkAccessTokenValidity(accessToken);

    if (!isValid) {
        accessToken = await refreshGoogleCalendarAccessToken(user);
    }

    OauthCalClient.setCredentials({
        access_token: accessToken,
        refresh_token: refreshToken
    });

    const calendar = google.calendar({ version: 'v3', auth: OauthCalClient });
    const res = await calendar.events.list({
        calendarId: 'primary',
        singleEvents: true,
        orderBy: 'startTime'
    });

    const events = res.data.items;

    if (events.length) {
        const meetings = events.filter(event => event.attendees && event.attendees.length > 0);

        return meetings;
    } else {
        console.log('No upcoming meetings found.');
    }
};

const getGoogleCalendarupComingMeetings = async (accessToken, refreshToken) => {
    OauthCalClient.setCredentials({
        access_token: accessToken,
        refresh_token: refreshToken
    });

    const calendar = google.calendar({ version: 'v3', auth: OauthCalClient });
    const res = await calendar.events.list({
        calendarId: 'primary',
        timeMin: (new Date()).toISOString(),
        singleEvents: true,
        orderBy: 'startTime'
    });

    const events = res.data.items;

    if (events.length) {
        const meetings = events.filter(event => event.attendees && event.attendees.length > 0);

        return meetings;
    } else {
        console.log('No upcoming meetings found.');
    }
};

const addGoogleCalendarEvent = async (user, event) => {
    let accessToken = user.integration.googleCalendar.accessToken;
    const refreshToken = user.integration.googleCalendar.refreshToken;
    const isValid = await checkAccessTokenValidity(accessToken);

    if (!isValid) {
        accessToken = await refreshGoogleCalendarAccessToken(user);
    }

    OauthCalClient.setCredentials({
        access_token: accessToken,
        refresh_token: refreshToken
    });

    const calendar = google.calendar({ version: 'v3', auth: OauthCalClient });
    const newEvent = await calendar.events.insert({
        calendarId: 'primary',
        resource: event
    });

    return newEvent.data;
};

const updateGoogleCalendarEvent = async (user, eventId, event) => {
    let accessToken = user.integration.googleCalendar.accessToken;
    const refreshToken = user.integration.googleCalendar.refreshToken;
    const isValid = await checkAccessTokenValidity(accessToken);

    if (!isValid) {
        accessToken = await refreshGoogleCalendarAccessToken(user);
    }

    OauthCalClient.setCredentials({
        access_token: accessToken,
        refresh_token: refreshToken
    });

    const calendar = google.calendar({ version: 'v3', auth: OauthCalClient });
    const updatedEvent = await calendar.events.update({
        calendarId: 'primary',
        eventId,
        resource: event
    });

    return updatedEvent.data;
};

const deleteGoogleCalendarEvent = async (user, eventId) => {
    let accessToken = user.integration.googleCalendar.accessToken;
    const refreshToken = user.integration.googleCalendar.refreshToken;

    const isValid = await checkAccessTokenValidity(accessToken);

    if (!isValid) {
        accessToken = await refreshGoogleCalendarAccessToken(user);
    }

    OauthCalClient.setCredentials({
        access_token: accessToken,
        refresh_token: refreshToken
    });

    const calendar = google.calendar({ version: 'v3', auth: OauthCalClient });
    await calendar.events.delete({
        calendarId: 'primary',
        eventId
    });

    return { success: true };
};

const revokeGoogleCalendarAccess = async (user) => {
    const revokeTokenUrl = 'https://oauth2.googleapis.com/revoke';
    let accessToken = user.integration.googleCalendar.accessToken;
    const isValid = await checkAccessTokenValidity(accessToken);

    if (!isValid) {
        accessToken = await refreshGoogleCalendarAccessToken(user);
    }

    await axios.post(revokeTokenUrl, null, {
        params: {
            token: accessToken
        },
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });

    user.integration.googleCalendar.accessToken = null;
    user.integration.googleCalendar.refreshToken = null;
    user.integration.googleCalendar.connected = false;
    user.integration.googleCalendar.metadata = {};
    await user.save();
};

const getGoogleCalendarMeetingsByDate = async (user, date) => {
    let accessToken = user.integration.googleCalendar.accessToken;
    const refreshToken = user.integration.googleCalendar.refreshToken;

    const isValid = await checkAccessTokenValidity(accessToken);

    if (!isValid) {
        accessToken = await refreshGoogleCalendarAccessToken(user);
    }

    OauthCalClient.setCredentials({
        access_token: accessToken,
        refresh_token: refreshToken
    });

    const calendar = google.calendar({ version: 'v3', auth: OauthCalClient });

    const startOfDay = new Date(date);
    startOfDay.setUTCHours(0, 0, 0, 0);
    const endOfDay = new Date(startOfDay);
    endOfDay.setUTCHours(23, 59, 59, 999);

    const res = await calendar.events.list({
        calendarId: 'primary',
        singleEvents: true,
        orderBy: 'startTime',
        timeMin: startOfDay.toISOString(),
        timeMax: endOfDay.toISOString()
    });

    const events = res.data.items;

    if (events.length) {
        const meetings = events.filter(event => event.attendees && event.attendees.length > 0);

        return meetings;
    } else {
        console.log('No meetings found for the specified date.');
    }
};

export {
    getGoogleCalendarAccessToken,
    refreshGoogleCalendarAccessToken,
    checkAccessTokenValidity,
    getGoogleCalendarEventsByDate,
    addGoogleCalendarEvent,
    updateGoogleCalendarEvent,
    deleteGoogleCalendarEvent,
    getGoogleCalendarMeetings,
    getGoogleCalendarupComingMeetings,
    revokeGoogleCalendarAccess,
    getGoogleCalendarMeetingsByDate
}
