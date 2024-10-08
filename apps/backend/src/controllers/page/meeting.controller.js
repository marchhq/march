import { getMeeting, getUpcomingMeetings, updateMeeting, deleteMeeting, getMeetingById, recentUpcomingMeeting } from "../../services/page/meeting.service.js";

const getMeetingsController = async (req, res, next) => {
    try {
        const user = req.user._id;

        const meetings = await getMeeting(user);

        res.status(200).json({
            meetings
        });
    } catch (err) {
        next(err);
    }
};

const recentUpcomingMeetingController = async (req, res, next) => {
    try {
        const user = req.user._id;

        const meetings = await recentUpcomingMeeting(user);

        res.status(200).json({
            meetings
        });
    } catch (err) {
        next(err);
    }
};

const getMeetingByIdController = async (req, res, next) => {
    try {
        const user = req.user._id;
        const { meeting: id } = req.params;

        const meeting = await getMeetingById(user, id);

        res.status(200).json({
            meeting
        });
    } catch (err) {
        next(err);
    }
};

const getUpcomingMeetingsController = async (req, res, next) => {
    try {
        const user = req.user._id;
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
    recentUpcomingMeetingController,
    getMeetingByIdController,
    updateMeetingController,
    deleteMeetingController
}
