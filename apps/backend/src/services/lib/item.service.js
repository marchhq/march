import { Item } from "../../models/lib/item.model.js";
import { getLabelByName } from "./label.service.js";

const getInboxItems = async (me) => {
    const items = await Item.find({
        user: me,
        isCompleted: false,
        isArchived: false,
        isDeleted: false,
        spaces: { $exists: true, $eq: [] },
        status: { $nin: ["archive", "done"] },
        dueDate: null,
        "cycle.startsAt": null,
        "cycle.endsAt": null
    }).sort({ createdAt: -1 });

    return items;
}

const getInboxItem = async (me, id) => {
    const items = await Item.find({
        user: me,
        _id: id,
        isArchived: false,
        isDeleted: false
    })

    return items;
}

const getThisWeekItems = async (me) => {
    const startOfWeek = new Date();
    startOfWeek.setHours(0, 0, 0, 0);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
    startOfWeek.setDate(diff);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    const items = await Item.find({
        user: me,
        isArchived: false,
        isDeleted: false,
        spaces: { $exists: true, $eq: [] },
        $or: [
            { status: { $nin: ["done"] } },
            {
                status: "done",
                cycleDate: { $gte: startOfWeek, $lte: endOfWeek }
            }
        ],
        cycleDate: { $ne: null }
    })
        .sort({ createdAt: -1 });
    return items;
}

const getThisWeekItemsByDateRange = async (me, startDate, endDate) => {
    if (!me || !startDate || !endDate) {
        throw new Error('Missing required parameters: me, startDate, endDate');
    }

    if (startDate > endDate) {
        throw new Error('startDate must be before or equal to endDate');
    }

    startDate = new Date(startDate);
    startDate.setUTCHours(0, 0, 0, 0);

    endDate = new Date(endDate);
    endDate.setUTCHours(23, 59, 59, 999);

    const items = await Item.find({
        user: me,
        isArchived: false,
        isDeleted: false,
        spaces: { $exists: true, $eq: [] },
        $or: [
            { "cycle.startsAt": { $gte: startDate, $lte: endDate } },
            { "cycle.endsAt": { $gte: startDate, $lte: endDate } },
            { dueDate: { $gte: startDate, $lte: endDate } }
        ]
    }).sort({ createdAt: 1 });

    return items;
};

const getAllitems = async (me) => {
    const items = await Item.find({
        user: me,
        isDeleted: false
    })
        .sort({ createdAt: -1 });

    return items;
}

const getUserTodayItems = async (me) => {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    const items = await Item.find({
        user: me,
        $or: [
            { dueDate: { $gte: startOfDay, $lt: endOfDay } },
            { completedAt: { $gte: startOfDay, $lt: endOfDay } }
        ]
    });
    return items;
}

const getUserOverdueItems = async (me) => {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
    const items = await Item.find({
        user: me,
        dueDate: { $lt: startOfToday },
        isCompleted: false,
        isArchived: false,
        isDeleted: false
    })
        .sort({ createdAt: -1 });

    return items;
}

const getUserItemsByDate = async (me, date) => {
    const startOfDay = new Date(date);
    startOfDay.setUTCHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setUTCHours(23, 59, 59, 999);

    const items = await Item.find({
        user: me,
        isArchived: false,
        $or: [
            { dueDate: { $gte: startOfDay, $lte: endOfDay } },
            { completedAt: { $gte: startOfDay, $lte: endOfDay } }
        ]
    }).sort({ createdAt: -1 });

    return items;
};

const createItem = async (user, itemData, space, block) => {
    if (!space || !block) {
        const error = new Error("Space and block must be provided");
        error.statusCode = 400;
        throw error;
    }
    const newItem = new Item({
        ...itemData,
        user,
        spaces: [space],
        blocks: [block]
    });
    if (!newItem) {
        const error = new Error("Failed to create the item")
        error.statusCode = 500
        throw error
    }

    const item = await newItem.save()

    return item;
};

const createInboxItem = async (user, itemData) => {
    const newItem = new Item({
        ...itemData,
        user
    });
    if (!newItem) {
        const error = new Error("Failed to create the item")
        error.statusCode = 500
        throw error
    }

    const item = await newItem.save()

    return item;
};

const updateInboxItem = async (item, user, itemData) => {
    const updatedItem = await Item.findOneAndUpdate({
        _id: item,
        user
    },
    { $set: itemData },
    { new: true }
    )
    if (!updatedItem) {
        const error = new Error("Item not found or you do not have permission to update it");
        error.statusCode = 404;
        throw error;
    }
    return updatedItem;
};

const filterItems = async (user, filters, sortOptions) => {
    const query = {
        user,
        isArchived: false,
        isDeleted: false
    };
    const sort = {};
    const startOfWeek = new Date();
    const endOfWeek = new Date(startOfWeek);
    const startOfMonth = new Date();
    const endOfMonth = new Date(startOfMonth.getFullYear(), startOfMonth.getMonth() + 1, 0);

    if (filters.dueDate) {
        const dueDateFilters = filters.dueDate.split(',');
        const dueDateConditions = [];

        dueDateFilters.forEach((dueDateFilter) => {
            switch (dueDateFilter) {
            case 'no-date':
                dueDateConditions.push({ dueDate: null });
                break;
            case 'before-today':
                dueDateConditions.push({ dueDate: { $lt: new Date().setHours(0, 0, 0, 0) } });
                break;
            case 'today':
                dueDateConditions.push({
                    dueDate: {
                        $gte: new Date().setHours(0, 0, 0, 0),
                        $lt: new Date().setHours(23, 59, 59, 999)
                    }
                });
                break;
            case 'after-today':
                dueDateConditions.push({ dueDate: { $gt: new Date().setHours(23, 59, 59, 999) } });
                break;
            case 'this-week':
                startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
                startOfWeek.setHours(0, 0, 0, 0);
                endOfWeek.setDate(endOfWeek.getDate() + 6);
                endOfWeek.setHours(23, 59, 59, 999);
                dueDateConditions.push({
                    dueDate: { $gte: startOfWeek, $lt: endOfWeek }
                });
                break;
            case 'this-month':
                startOfMonth.setDate(1);
                startOfMonth.setHours(0, 0, 0, 0);
                endOfMonth.setHours(23, 59, 59, 999);
                dueDateConditions.push({
                    dueDate: { $gte: startOfMonth, $lt: endOfMonth }
                });
                break;
            default:
                break;
            }
        });

        if (dueDateConditions.length > 0) {
            query.$or = dueDateConditions;
        }
    }

    // sorting
    if (sortOptions) {
        const sortParams = sortOptions.split(',');

        sortParams.forEach(sortParam => {
            const [by, direction] = sortParam.split(':');
            sort[by] = direction === 'asc' ? 1 : -1;
        });
    } else {
        // Default sorting by creation date (newest on top)
        sort.createdAt = -1;
    }

    return await Item.find(query).sort(sort);
};

const getItem = async (user, id, space, block) => {
    const item = await Item.find({
        _id: id,
        user,
        spaces: { $elemMatch: { $eq: space } },
        blocks: { $elemMatch: { $eq: block } },
        isArchived: false,
        isDeleted: false
    })

    return item;
};

const getAllItemsByBloack = async (user, space, block) => {
    const item = await Item.find({
        user,
        spaces: { $elemMatch: { $eq: space } },
        blocks: { $elemMatch: { $eq: block } },
        isArchived: false,
        isDeleted: false
    })

    return item;
};

const updateItem = async (id, updateData, space, block) => {
    const updatedItem = await Item.findOneAndUpdate({
        _id: id,
        spaces: { $elemMatch: { $eq: space } },
        blocks: { $elemMatch: { $eq: block } }
    },
    { $set: updateData },
    { new: true }
    )

    return updatedItem;
};

const moveItemtoDate = async (date, id) => {
    const formattedDate = date ? new Date(date) : null;

    const item = await Item.findByIdAndUpdate(
        id,
        { $set: { dueDate: formattedDate } },
        { new: true }
    );

    return item;
};

const getItemFilterByLabel = async (name, userId, space) => {
    const label = await getLabelByName(name, userId, space);
    const items = await Item.find({
        labels: { $in: [label._id] },
        user: userId
    })

    return items;
};

const searchItemsByTitle = async (title, user) => {
    const items = await Item.find({
        title: { $regex: title, $options: 'i' },
        isDeleted: false,
        user
    }).exec();

    return items;
};

const getUserFavoriteItems = async (user) => {
    const items = await Item.find({
        isFavorite: true,
        isArchived: false,
        isDeleted: false,
        user
    })

    return items;
};

const getSubItems = async (user, parentId) => {
    const subItems = await Item.find({
        parent: parentId,
        user,
        isArchived: false,
        isDeleted: false,
        isCompleted: false
    });
    if (!subItems.length) {
        const error = new Error("No sub-items found for this parent item.");
        error.statusCode = 404;
        throw error;
    }
    return subItems;
};

export {
    getInboxItems,
    getInboxItem,
    createItem,
    filterItems,
    updateItem,
    getItem,
    getUserOverdueItems,
    getUserItemsByDate,
    moveItemtoDate,
    getUserTodayItems,
    getAllitems,
    getItemFilterByLabel,
    getAllItemsByBloack,
    updateInboxItem,
    searchItemsByTitle,
    createInboxItem,
    getThisWeekItems,
    getThisWeekItemsByDateRange,
    getUserFavoriteItems,
    getSubItems
}
