import { Meeting } from "../../models/page/meetings.model.js";

const createMeeting = async (user, meetingData) => {
    const newMeeting = new Meeting({
        ...meetingData,
        user
    });
    if (!newMeeting) {
        const error = new Error("Failed to create the item")
        error.statusCode = 500
        throw error
    }

    const meeting = await newMeeting.save()

    return meeting;
};

const getMeeting = async (user) => {
    const meetings = await Meeting.find({
        user
    })
        .sort({ created_at: -1 });
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
    createMeeting,
    getMeeting,
    updateMeeting,
    deleteMeeting,
    getMeetingById
}
