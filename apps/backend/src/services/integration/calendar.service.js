import { v4 as uuid } from "uuid";
import { google } from "googleapis";
import axios from 'axios';
import { OauthClient } from "../../loaders/google.loader.js";
import { clerk } from "../../middlewares/clerk.middleware.js";
import { Meeting } from "../../models/page/meetings.model.js";
import { environment } from "../../loaders/environment.loader.js";

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

const getGoogleCalendarMeetings = async (id) => {
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
    OauthClient.setCredentials({
        access_token: accessToken,
        refresh_token: refreshToken
    });

    const calendar = google.calendar({ version: 'v3', auth: OauthClient });
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

const saveUpcomingMeetingsToDatabase = async (meetings, userId) => {
    try {
        for (const meeting of meetings) {
            const existingMeeting = await Meeting.findOne({ id: meeting.id, user: userId });

            if (!existingMeeting) {
                const newMeeting = new Meeting({
                    title: meeting.summary,
                    id: meeting.id,
                    user: userId,
                    metadata: {
                        status: meeting.status,
                        description: meeting.description,
                        location: meeting.location,
                        attendees: meeting.attendees,
                        hangoutLink: meeting.hangoutLink,
                        start: meeting.start,
                        end: meeting.end,
                        creator: meeting.creator,
                        conferenceData: meeting.conferenceData
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
    console.log("webhookUrl: ", webhookUrl);

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

const handleCalendarWebhook = async (req, res) => {
    const channelToken = req.headers['x-goog-channel-token'];
    const resourceState = req.headers['x-goog-resource-state'];
    const userId = req.query.user;

    if (channelToken !== environment.CALENDAR_WEBHOOK_SECRET) {
        return res.status(403).send('Invalid webhook token');
    }

    if (resourceState === 'sync') {
        return res.status(200).send();
    }

    const user = await clerk.users.getUser(userId);
    if (!user) {
        return res.status(404).send('User not found');
    }

    let accessToken = user.privateMetadata.integration.googleCalendar.accessToken;
    const refreshToken = user.privateMetadata.integration.googleCalendar.refreshToken;

    const isValid = await checkAccessTokenValidity(accessToken);

    if (!isValid) {
        accessToken = await refreshGoogleCalendarAccessToken(user);
    }

    OauthClient.setCredentials({
        access_token: accessToken,
        refresh_token: refreshToken
    });

    const calendar = google.calendar({ version: 'v3', auth: OauthClient });

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
                    description: event.description,
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

    return res.status(200).send('Webhook received and processed');
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
    handleCalendarWebhook
}
