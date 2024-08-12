import { getMeeting, getUpcomingMeetings, updateMeeting, deleteMeeting } from "../../services/page/meeting.service.js";

const getMeetingsController = async (req, res, next) => {
    try {
        const user = req.auth.userId;

        const meetings = await getMeeting(user);

        res.status(200).json({
            meetings
        });
    } catch (err) {
        next(err);
    }
};

const getUpcomingMeetingsController = async (req, res, next) => {
    try {
        const user = req.auth.userId;
        const currentDateTime = new Date();

        const upcomingMeetings = await getUpcomingMeetings(user, currentDateTime)

        res.status(200).json({
            upcomingMeetings
        });
    } catch (err) {
        next(err);
    }
};

const updateMeetingController = async (req, res, next) => {
    try {
        const updateData = req.body;
        const { meeting: id } = req.params;

        const meeting = await updateMeeting(id, updateData);

        res.status(200).json({
            meeting
        });
    } catch (err) {
        next(err);
    }
};

const deleteMeetingController = async (req, res, next) => {
    try {
        const { meeting: id } = req.params;
        await deleteMeeting(id);

        res.status(200).json({
            ok: 'ok'
        });
    } catch (err) {
        next(err);
    }
};

export {
    getMeetingsController,
    getUpcomingMeetingsController,
    updateMeetingController,
    deleteMeetingController
}
