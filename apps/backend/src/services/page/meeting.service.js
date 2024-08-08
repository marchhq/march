import { Meeting } from "../../models/page/meetings.model.js";

const getMeeting = async (user) => {
    const meetings = await Meeting.find({
        user
    })
        .sort({ created_at: -1 });

    return meetings;
};

export {
    getMeeting
}
