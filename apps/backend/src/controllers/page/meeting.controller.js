import { getMeeting } from "../../services/page/meeting.service.js";

const getMeetingsController = async (req, res, next) => {
    try {
        const user = req.auth.userId;

        const meetings = await getMeeting(user);

        res.status(200).json({
            status: 200,
            response: meetings
        });
    } catch (err) {
        next(err);
    }
};

export {
    getMeetingsController
}
