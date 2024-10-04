import Joi from "joi";
import { getUserOverdueItems, getUserItemsByDate, getUserItems, moveItemtoDate, getUserTodayItems, getAllitems } from "../../services/lib/item.service.js";
import { updateUser } from "../../services/core/user.service.js";

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

const getUserItemsController = async (req, res, next) => {
    try {
        const me = req.user._id;
        const items = await getUserItems(me);

        // const IntegratedAppIssues = await getIntegration(me);
        // res.json({
        //     items
        // });
        res.status(200).json({
            statusCode: 200,
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

        // const IntegratedAppIssues = await getIntegration(me);
        // res.json({
        //     items
        // });
        res.status(200).json({
            statusCode: 200,
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
            todayItems,
            overdueItems
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
            items
        });
    } catch (err) {
        next(err);
    }
};

const getUserItemsByDateControlle = async (req, res, next) => {
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
            items
        });
    } catch (err) {
        next(err);
    }
};

export {
    userProfileController,
    updateUserController,
    getUserItemsController,
    getUserTodayItemsController,
    getUserOverdueItemsController,
    getUserItemsByDateControlle,
    moveItemtoDateController,
    getAllitemsController
}
