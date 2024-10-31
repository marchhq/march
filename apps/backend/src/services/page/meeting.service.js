import { Meeting } from "../../models/page/meetings.model.js";

const getMeeting = async (user) => {
    const meetings = await Meeting.find({
        user
    })
        .sort({ 'metadata.start.dateTime': 1 });

    return meetings;
};

const recentUpcomingMeeting = async (user) => {
    const now = new Date().toISOString();
    const meetings = await Meeting.find({
        user,
        'metadata.start.dateTime': { $gte: now }
    })
        .sort({ 'metadata.start': 1 })
        .limit(1);

    return meetings;
};

const getMeetingById = async (user, id) => {
    const meeting = await Meeting.find({
        user,
        _id: id
    })
        .sort({ created_at: -1 });

    return meeting;
};

const getUpcomingMeetings = async (user, currentDateTime) => {
    const upcomingMeetings = await Meeting.find({
        user,
        'metadata.start.dateTime': { $gt: currentDateTime.toISOString() }
    });
    return upcomingMeetings;
};

const updateMeeting = async (id, updateData) => {
    const updatedBlock = await Meeting.findOneAndUpdate({
        _id: id
    },
    { $set: updateData },
    { new: true }
    )

    return updatedBlock;
};

const deleteMeeting = async (id) => {
    const meeting = await Meeting.findOneAndDelete({ _id: id });

    if (!meeting) {
        throw new Error('meeting not found');
    }
    return meeting;
};

export {
    getMeeting,
    getUpcomingMeetings,
    recentUpcomingMeeting,
    updateMeeting,
    deleteMeeting,
    getMeetingById
}
