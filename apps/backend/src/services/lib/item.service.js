import { Item } from "../../models/lib/item.model.js";
import moment from 'moment-timezone';

const getUserItems = async (me) => {
    const items = await Item.find({
        user: me,
        isCompleted: false,
        isArchived: false,
        isDeleted: false,
        spaces: { $exists: true, $eq: [] },
        status: { $ne: "archive" }
    })
        .sort({ createdAt: -1 });

    return items;
}

const getAllitems = async (me) => {
    const items = await Item.find({
        user: me,
        isDeleted: false
    })
        .sort({ createdAt: -1 });

    return items;
}

const getUserTodayItems = async (me) => {
    // const today = new Date();
    const startOfDay = moment().startOf('day');
    const items = await Item.find({
        user: me,
        dueDate: { $gte: startOfDay, $lt: moment().endOf('day') }
    })

    return items;
}

const getUserOverdueItems = async (me) => {
    const startOfDay = moment().startOf('day');
    const items = await Item.find({
        user: me,
        dueDate: { $lt: startOfDay },
        isCompleted: false,
        isArchived: false,
        isDeleted: false
    })
        .sort({ createdAt: -1 });

    return items;
}

const getUserItemsByDate = async (me, date) => {
    const items = await Item.find({
        user: me,
        dueDate: date,
        isArchived: false,
        isDeleted: false
    })
        .sort({ createdAt: -1 });

    return items;
}

const createItem = async (user, itemData) => {
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

const getItems = async (user, filters, sortOptions) => {
    const query = {
        user: user,
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

    // effort filter
    if (filters.effort) {
        const effortFilters = filters.effort.split(',');
        query.effort = { $in: effortFilters };
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

const getItem = async (user, id) => {
    const item = await Item.find({
        _id: id,
        user,
        isArchived: false,
        isDeleted: false
    })

    return item;
};

const updateItem = async (id, updateData) => {
    const updatedItem = await Item.findOneAndUpdate({
        _id: id
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

const getItemFilterByLabel = async (labelId, userId) => {
    const items = await Item.find({
        labels: { $in: [labelId] },
        user: userId
    })

    return items;
};

const searchItemsByTitle = async (title) => {
    const items = await Item.find({
        title: { $regex: title, $options: 'i' },
        isDeleted: false
    }).exec();

    return items;
};

export {
    getUserItems,
    createItem,
    getItems,
    updateItem,
    getItem,
    getUserOverdueItems,
    getUserItemsByDate,
    moveItemtoDate,
    getUserTodayItems,
    getAllitems,
    getItemFilterByLabel,
    searchItemsByTitle
}
