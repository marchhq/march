import { v4 as uuid } from "uuid";
import { google } from "googleapis";
import axios from 'axios';
import { OauthCalClient } from "../../loaders/google.loader.js";
import { Meeting } from "../../models/page/meetings.model.js";
import { environment } from "../../loaders/environment.loader.js";

const getGoogleCalendarOAuthAuthorizationUrl = () => {
    const authUrl = OauthCalClient.generateAuthUrl({
        access_type: 'offline',
        scope: ['https://www.googleapis.com/auth/calendar'],
        response_type: 'code'
    });
    return authUrl;
};

const getGoogleCalendarAccessToken = async (code, user) => {
    const { tokens } = await OauthCalClient.getToken(code);
    OauthCalClient.setCredentials(tokens);

    user.integration.googleCalendar.accessToken = tokens.access_token;
    user.integration.googleCalendar.refreshToken = tokens.refresh_token;
    user.integration.googleCalendar.connected = true;
    await user.save();

    return tokens;
};

const refreshGoogleCalendarAccessToken = async (user) => {
    OauthCalClient.setCredentials({
        refresh_token: user.integration.googleCalendar.refreshToken
    });

    const { credentials } = await OauthCalClient.refreshAccessToken();
    // console.log("access_token: ", credentials.access_token);
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

const getGoogleCalendarEvents = async (user) => {
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
    const events = await calendar.events.list({
        calendarId: 'primary'
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

const saveUpcomingMeetingsToDatabase = async (meetings, userId) => {
    try {
        for (const meeting of meetings) {
            const existingMeeting = await Meeting.findOne({ id: meeting.id, user: userId });

            if (!existingMeeting) {
                const newMeeting = new Meeting({
                    title: meeting.summary,
                    source: 'calendar',
                    id: meeting.id,
                    user: userId,
                    metadata: {
                        status: meeting.status,
                        location: meeting.location,
                        attendees: meeting.attendees,
                        hangoutLink: meeting.hangoutLink,
                        conferenceData: meeting.conferenceData,
                        start: meeting.start,
                        end: meeting.end,
                        creator: meeting.creator
                    },
                    createdAt: meeting.createdAt,
                    updatedAt: meeting.updatedAt
                });
                await newMeeting.save();
            }
        }
    } catch (error) {
        console.error('Error saving meeting to database:', error);
        throw error;
    }
};

const setUpCalendarWatch = async (accessToken, calendarId, webhookUrl) => {
    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: accessToken });

    const requestBody = {
        id: uuid(),
        type: 'web_hook',
        address: webhookUrl,
        token: environment.CALENDAR_WEBHOOK_SECRET
    };
    const calendar = google.calendar({ version: 'v3' });

    const response = await calendar.events.watch({
        auth,
        calendarId,
        requestBody
    });

    return response.data;
};

const handleCalendarWebhookService = async (accessToken, refreshToken, userId) => {
    OauthCalClient.setCredentials({
        access_token: accessToken,
        refresh_token: refreshToken
    });

    const calendar = google.calendar({ version: 'v3', auth: OauthCalClient });

    const eventsResponse = await calendar.events.list({
        calendarId: 'primary',
        timeMin: new Date().toISOString(),
        maxResults: 10,
        singleEvents: true,
        orderBy: 'startTime'
    });

    const events = eventsResponse.data.items;
    if (events && events.length > 0) {
        for (const event of events) {
            const existingMeeting = await Meeting.findOne({ id: event.id, user: userId });

            if (existingMeeting) {
                // Update existing meeting
                existingMeeting.title = event.summary;
                existingMeeting.metadata = {
                    status: event.status,
                    location: event.location,
                    attendees: event.attendees,
                    hangoutLink: event.hangoutLink,
                    start: event.start,
                    end: event.end,
                    creator: event.creator,
                    conferenceData: event.conferenceData
                };
                existingMeeting.updatedAt = event.updatedAt;

                await existingMeeting.save();
            } else {
                // Create new meeting
                const newMeeting = new Meeting({
                    title: event.summary,
                    source: 'calendar',
                    id: event.id,
                    user: userId,
                    metadata: {
                        status: event.status,
                        description: event.description,
                        location: event.location,
                        attendees: event.attendees,
                        hangoutLink: event.hangoutLink,
                        start: event.start,
                        end: event.end,
                        creator: event.creator,
                        conferenceData: event.conferenceData
                    },
                    createdAt: event.createdAt,
                    updatedAt: event.updatedAt
                });

                await newMeeting.save();
            }
        }
    }
};

export {
    getGoogleCalendarOAuthAuthorizationUrl,
    getGoogleCalendarAccessToken,
    refreshGoogleCalendarAccessToken,
    checkAccessTokenValidity,
    getGoogleCalendarEvents,
    addGoogleCalendarEvent,
    updateGoogleCalendarEvent,
    deleteGoogleCalendarEvent,
    getGoogleCalendarMeetings,
    getGoogleCalendarupComingMeetings,
    saveUpcomingMeetingsToDatabase,
    setUpCalendarWatch,
    handleCalendarWebhookService
}
