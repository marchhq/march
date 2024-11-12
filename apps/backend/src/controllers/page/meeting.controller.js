import { createMeeting, getMeeting, updateMeeting, deleteMeeting, getMeetingById } from "../../services/page/meeting.service.js";

const createMeetingController = async (req, res, next) => {
    try {
        const user = req.user._id;
        const requestedData = req.body;
        const meetings = await createMeeting(user, requestedData);

        res.status(200).json({
            meetings
        });
    } catch (err) {
        next(err);
    }
};

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

const updateMeetingController = async (req, res, next) => {
    try {
        const updateData = req.body;
        const user = req.user._id;
        const { meeting: id } = req.params;

        const meeting = await updateMeeting(id, updateData, user);

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
        const user = req.user._id;
        await deleteMeeting(id, user);

        res.status(200).json({
            ok: 'ok'
        });
    } catch (err) {
        next(err);
    }
};

export {
    createMeetingController,
    getMeetingsController,
    getMeetingByIdController,
    updateMeetingController,
    deleteMeetingController
}
