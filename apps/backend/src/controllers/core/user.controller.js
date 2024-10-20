import Joi from "joi";
import { getUserOverdueItems, getUserItemsByDate, getInboxItems, getInboxItem, moveItemtoDate, getUserTodayItems, getAllitems, getThisWeekItems, updateInboxItem } from "../../services/lib/item.service.js";
import { getAllUsers, updateUser } from "../../services/core/user.service.js";

const { ValidationError } = Joi;

// const userProfileController = async (req, res, next) => {
//     try {
//         const user = req.user;
//         const { integration, ...userWithoutIntegration } = user.toObject ? user.toObject() : user;

//         res.json(userWithoutIntegration);
//     } catch (err) {
//         next(err)
//     }
// };

export const getAllUsersController = async (req, res) => {
    try {
        const users = await getAllUsers();
        return res.status(200).json(users);
    } catch (error) {
        return res.status(500).json({ error: 'An error occurred', details: error.message });
    }
};

const userProfileController = async (req, res, next) => {
    try {
        const user = req.user;
        const { integration, uuid, fullName, userName, avatar, roles, timezone, accounts } = user.toObject ? user.toObject() : user;

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
        // const payload = await UpdateUserPayload.validateAsync(req.body)

        const data = req.body;

        await updateUser(user, data);

        res.json({
            "message": "Updated successfully"
        })
    } catch (err) {
        const error = new Error(err)
        error.statusCode = err instanceof ValidationError ? 400 : (err.statusCode || 500)
        next(error);
    }
};

const getInboxItemsController = async (req, res, next) => {
    try {
        const me = req.user._id;
        const items = await getInboxItems(me);

        res.status(200).json({
            response: items
        });
    } catch (err) {
        next(err);
    }
};

const getInboxItemController = async (req, res, next) => {
    try {
        const me = req.user._id;
        const { item: id } = req.params;
        const items = await getInboxItem(me, id);

        res.status(200).json({
            response: items
        });
    } catch (err) {
        next(err);
    }
};

const getThisWeekItemsController = async (req, res, next) => {
    try {
        const me = req.user._id;
        const items = await getThisWeekItems(me);

        res.status(200).json({
            response: items
        });
    } catch (err) {
        next(err);
    }
};

const updateInboxItemController = async (req, res, next) => {
    try {
        const me = req.user._id;
        const { item: id } = req.params;
        const updateData = req.body;
        const items = await updateInboxItem(id, me, updateData);

        res.status(200).json({
            response: items
        });
    } catch (err) {
        next(err);
    }
};

const getAllitemsController = async (req, res, next) => {
    try {
        const me = req.user._id;
        const items = await getAllitems(me);

        res.status(200).json({
            response: items
        });
    } catch (err) {
        next(err);
    }
};

const getUserTodayItemsController = async (req, res, next) => {
    try {
        const me = req.user.id;
        const todayItems = await getUserTodayItems(me);
        const overdueItems = await getUserOverdueItems(me);
        res.json({
            response: {
                todayItems,
                overdueItems
            }
        });
    } catch (err) {
        next(err);
    }
};

const getUserOverdueItemsController = async (req, res, next) => {
    try {
        const me = req.user.id;
        const items = await getUserOverdueItems(me);
        res.json({
            response: items
        });
    } catch (err) {
        next(err);
    }
};

const getUserItemsByDateController = async (req, res, next) => {
    try {
        const me = req.user.id;
        const { date } = req.params;
        const items = await getUserItemsByDate(me, date);
        res.json({
            items
        });
    } catch (err) {
        next(err);
    }
};

const moveItemtoDateController = async (req, res, next) => {
    try {
        const { id, dueDate } = req.body;
        const items = await moveItemtoDate(dueDate, id);
        res.json({
            response: items
        });
    } catch (err) {
        next(err);
    }
};

export {
    userProfileController,
    updateUserController,
    updateInboxItemController,
    getInboxItemController,
    getInboxItemsController,
    getUserTodayItemsController,
    getUserOverdueItemsController,
    getUserItemsByDateController,
    moveItemtoDateController,
    getAllitemsController,
    getThisWeekItemsController
}
