import { Meeting } from "../../models/page/meetings.model.js";

const getMeeting = async (user) => {
    const meetings = await Meeting.find({
        user
    })
        .sort({ created_at: -1 });

    return meetings;
};

const getUpcomingMeetings = async (user, currentDateTime) => {
    const upcomingMeetings = await Meeting.find({
        user,
        'metadata.start.dateTime': { $gt: currentDateTime.toISOString() }
    });
    return upcomingMeetings;
};

export {
    getMeeting,
    getUpcomingMeetings
}
