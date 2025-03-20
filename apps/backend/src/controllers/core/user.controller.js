import Joi from "joi";
import { getInboxObject, getObjectsWithDate, reorderObjects, getInboxObjects, getThisWeekObjects, updateInboxObject, getAllObjects, getUserOverdueObjects, getUserObjectsByDate, moveObjecttoDate, getUserTodayObjects } from "../../services/lib/object.service.js";
import { updateUser } from "../../services/core/user.service.js";
import { UpdateUserPayload } from "../../payloads/core/user.payload.js";
import { updateContent, deleteContent } from "../../utils/helper.service.js"

const { ValidationError } = Joi;

const userProfileController = async (req, res, next) => {
    try {
        const user = req.user;
        const {
            integration,
            uuid,
            fullName,
            userName,
            avatar,
            roles,
            timezone,
            accounts
        } = user.toObject ? user.toObject() : user;

        const response = {
            uuid,
            fullName,
            userName,
            avatar,
            roles,
            timezone,
            accounts,
            integrations: {
                linear: { connected: integration.linear.connected },
                googleCalendar: { connected: integration.googleCalendar.connected },
                gmail: { connected: integration.gmail.connected },
                github: { connected: integration.github.connected },
                x: { connected: integration.x.connected },
                notion: { connected: integration.notion.connected }
            }
        };

        res.json(response);
    } catch (err) {
        next(err);
    }
};

const updateUserController = async (req, res, next) => {
    try {
        const user = req.user;
        const data = req.body;
        const payload = await UpdateUserPayload.validateAsync(data)

        await updateUser(user, payload);

        res.json({
            message: "Updated successfully"
        });
    } catch (err) {
        const error = new Error(err);
        error.statusCode =
        err instanceof ValidationError ? 400 : err.statusCode || 500;
        next(error);
    }
};

const getInboxObjectsController = async (req, res, next) => {
    try {
        const me = req.user._id;

        const objects = await getInboxObjects(me);

        res.status(200).json({
            response: objects
        });
    } catch (err) {
        next(err);
    }
};

export const getObjectsWithDateController = async (req, res, next) => {
    try {
        const me = req.user._id;

        const objects = await getObjectsWithDate(me);

        res.status(200).json({
            response: objects
        });
    } catch (err) {
        next(err);
    }
};

export const reorderObjectsController = async (req, res, next) => {
    const { orderedItems } = req.body;
    await reorderObjects(orderedItems)

    res.json({ success: true, message: "Order updated" });
}

const getInboxObjectController = async (req, res, next) => {
    try {
        const me = req.user._id;
        const { object: id } = req.params;
        const objects = await getInboxObject(me, id);

        res.status(200).json({
            response: objects
        });
    } catch (err) {
        next(err);
    }
};

const getThisWeekObjectsController = async (req, res, next) => {
    try {
        const me = req.user._id;
        const objects = await getThisWeekObjects(me);

        res.status(200).json({
            response: objects
        });
    } catch (err) {
        next(err);
    }
};

const updateInboxObjectController = async (req, res, next) => {
    try {
        const me = req.user._id;
        const { object: id } = req.params;
        const updateData = req.body;
        const objects = await updateInboxObject(id, me, updateData);
        // update in vector db
        await updateContent(objects);
        res.status(200).json({
            response: objects
        });
    } catch (err) {
        next(err);
    }
};

export const deleteInboxObjectController = async (req, res, next) => {
    try {
        const me = req.user._id;
        const { object: id } = req.params;

        await updateInboxObject(id, me, { isDeleted: true });

        await deleteContent(id);

        res.status(200).json({
            success: true,
            message: "Object deleted successfully"
        });
    } catch (err) {
        next(err);
    }
};

const getAllObjectsController = async (req, res, next) => {
    try {
        const me = req.user._id;
        const objects = await getAllObjects(me);

        res.status(200).json({
            response: objects
        });
    } catch (err) {
        next(err);
    }
};

const getUserTodayObjectsController = async (req, res, next) => {
    try {
        const me = req.user.id;
        const todayObjects = await getUserTodayObjects(me);
        const overdueObjects = await getUserOverdueObjects(me);
        res.json({
            response: {
                todayObjects,
                overdueObjects
            }
        });
    } catch (err) {
        next(err);
    }
};

const getUserOverdueObjectsController = async (req, res, next) => {
    try {
        const me = req.user.id;
        const objects = await getUserOverdueObjects(me);
        res.json({
            response: objects
        });
    } catch (err) {
        next(err);
    }
};

const getUserObjectsByDateController = async (req, res, next) => {
    try {
        const me = req.user.id;
        const { date } = req.params;
        const today = await getUserObjectsByDate(me, date);
        const overdue = await getUserOverdueObjects(me);
        res.json({
            response: {
                today,
                overdue
            }
        });
    } catch (err) {
        next(err);
    }
};

const moveObjecttoDateController = async (req, res, next) => {
    try {
        const { id, dueDate } = req.body;
        const objects = await moveObjecttoDate(dueDate, id);
        res.json({
            response: objects
        });
    } catch (err) {
        next(err);
    }
};

export {
    userProfileController,
    updateUserController,
    updateInboxObjectController,
    getInboxObjectController,
    getInboxObjectsController,
    getThisWeekObjectsController,
    getAllObjectsController,
    getUserOverdueObjectsController,
    getUserObjectsByDateController,
    moveObjecttoDateController,
    getUserTodayObjectsController
};
