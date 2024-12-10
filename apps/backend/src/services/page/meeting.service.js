import { Item } from "../../models/lib/item.model.js";
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
    const meetings = await Item.find({
        user,
        type: "meeting",
        isDeleted: false
    })
        .sort({ updatedAt: -1 });
    return meetings;
};

const getMeetingById = async (user, id) => {
    const meeting = await Item.find({
        user,
        id
    })
        .sort({ created_at: -1 });

    return meeting;
};

const updateMeeting = async (id, updateData, user) => {
    const updatedBlock = await Item.findOneAndUpdate({
        id,
        user
    },
    { $set: updateData },
    { new: true }
    )

    return updatedBlock;
};

const deleteMeeting = async (id, user) => {
    const meeting = await Meeting.findOneAndDelete({ id, user });

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
