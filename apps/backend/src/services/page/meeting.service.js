import { Object } from "../../models/lib/object.model.js";
import { Meeting } from "../../models/page/meetings.model.js";
import { z } from "zod";
import sanitize from "mongo-sanitize";

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
    const meetings = await Object.find({
        user,
        type: "meeting",
        isDeleted: false
    })
        .sort({ updatedAt: -1 });
    return meetings;
};

const getMeetingById = async (user, id) => {
    const meeting = await Object.find({
        user,
        id
    })
        .sort({ created_at: -1 });

    return meeting;
};
// TODO: improve validation for updateMeetingSchema
const updateMeetingSchema = z.object({
    title: z.string().optional(),
    date: z.string().optional(),
    description: z.string().optional(),
    participants: z.array(z.string()).optional(),
    isArchived: z.boolean().optional()
});

const updateMeeting = async (id, updateData, user) => {
    const safeUpdateData = sanitize(updateData);
    const validatedData = updateMeetingSchema.parse(safeUpdateData);

    const updatedBlock = await Object.findOneAndUpdate({
        id,
        user
    },
    { $set: validatedData },
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
