import { Object } from "../../models/lib/object.model.js";
import { getLabelByName } from "./label.service.js";

const getInboxObjects = async (me) => {
    const objects = await Object.find({
        user: me,
        isCompleted: false,
        isArchived: false,
        isDeleted: false,
        // arrays: { $exists: true, $eq: [] },
        status: { $nin: ["archive", "done"] },
        dueDate: null,
        "cycle.startsAt": null,
        "cycle.endsAt": null
    }).sort({ order: 1 });

    return objects;
}
export const getObjectsWithDate = async (me) => {
    const objects = await Object.find({
        user: me,
        isCompleted: false,
        isArchived: false,
        isDeleted: false,
        arrays: { $exists: true, $eq: [] },
        status: { $nin: ["archive", "done"] },
        dueDate: { $exists: true, $ne: null }
    }).sort({ dueDate: 1, createdAt: -1 });

    return objects;
}

export const reorderObjects = async (orderedItems) => {
    const bulkOps = orderedItems.map(({ id, order }) => ({
        updateOne: {
            filter: { _id: id },
            update: { $set: { order } }
        }
    }));

    await Object.bulkWrite(bulkOps);
}

const getInboxObject = async (me, id) => {
    const objects = await Object.findOne({
        user: me,
        _id: id,
        isArchived: false,
        isDeleted: false
    })

    return objects;
}

const getThisWeekObjects = async (me) => {
    const startOfWeek = new Date();
    startOfWeek.setHours(0, 0, 0, 0);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
    startOfWeek.setDate(diff);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    const objects = await Object.find({
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
    return objects;
}

const getThisWeekObjectsByDateRange = async (me, startDate, endDate) => {
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

    const objects = await Object.find({
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

    return objects;
};

const getAllObjects = async (me) => {
    const objects = await Object.find({
        user: me,
        isDeleted: false
    })
        .sort({ createdAt: -1 });

    return objects;
}

const getUserTodayObjects = async (me) => {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    const objects = await Object.find({
        user: me,
        $or: [
            { dueDate: { $gte: startOfDay, $lt: endOfDay } },
            { completedAt: { $gte: startOfDay, $lt: endOfDay } }
        ]
    });
    return objects;
}

const getUserOverdueObjects = async (me) => {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
    const objects = await Object.find({
        user: me,
        dueDate: { $lt: startOfToday },
        isCompleted: false,
        isArchived: false,
        isDeleted: false
    })
        .sort({ createdAt: -1 });

    return objects;
}

const getUserObjectsByDate = async (me, date) => {
    const startOfDay = new Date(date);
    startOfDay.setUTCHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setUTCHours(23, 59, 59, 999);

    const objects = await Object.find({
        user: me,
        isArchived: false,
        isDeleted: false,
        $or: [
            { dueDate: { $gte: startOfDay, $lte: endOfDay } },
            { completedAt: { $gte: startOfDay, $lte: endOfDay } }
        ]
    }).sort({ createdAt: -1 });

    return objects;
};

const createObject = async (user, objectData, array, block) => {
    if (!array || !block) {
        const error = new Error("Array and block must be provided");
        error.statusCode = 400;
        throw error;
    }
    const newObject = new Object({
        ...objectData,
        user,
        arrays: [array],
        blocks: [block]
    });
    if (!newObject) {
        const error = new Error("Failed to create the object")
        error.statusCode = 500
        throw error
    }

    const object = await newObject.save()

    return object;
};

const createInboxObject = async (user, objectData) => {
    const newObject = new Object({
        ...objectData,
        user
    });
    if (!newObject) {
        const error = new Error("Failed to create the object")
        error.statusCode = 500
        throw error
    }

    const object = await newObject.save()

    return object;
};

const updateInboxObject = async (object, user, objectData) => {
    const updatedObject = await Object.findOneAndUpdate({
        _id: object,
        user
    },
    { $set: objectData },
    { new: true }
    )
    if (!updatedObject) {
        const error = new Error("Object not found or you do not have permission to update it");
        error.statusCode = 404;
        throw error;
    }
    return updatedObject;
};

const filterObjects = async (user, filters, sortOptions) => {
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

    return await Object.find(query).sort(sort);
};

const getObject = async (user, id, array, block) => {
    const object = await Object.find({
        _id: id,
        user,
        arrays: { $elemMatch: { $eq: array } },
        blocks: { $elemMatch: { $eq: block } },
        isArchived: false,
        isDeleted: false
    })

    return object;
};

const getAllObjectsByBloack = async (user, array, block) => {
    const object = await Object.find({
        user,
        arrays: { $elemMatch: { $eq: array } },
        blocks: { $elemMatch: { $eq: block } },
        isArchived: false,
        isDeleted: false
    })

    return object;
};

const updateObject = async (id, updateData, array, block) => {
    const updatedObject = await Object.findOneAndUpdate({
        _id: id,
        arrays: { $elemMatch: { $eq: array } },
        blocks: { $elemMatch: { $eq: block } }
    },
    { $set: updateData },
    { new: true }
    )

    return updatedObject;
};

const moveObjecttoDate = async (date, id) => {
    const formattedDate = date ? new Date(date) : null;

    const object = await Object.findByIdAndUpdate(
        id,
        { $set: { dueDate: formattedDate } },
        { new: true }
    );

    return object;
};

const getObjectFilterByLabel = async (name, userId, array) => {
    const label = await getLabelByName(name, userId, array);
    const objects = await Object.find({
        labels: { $in: [label._id] },
        user: userId
    })

    return objects;
};

const searchObjectsByTitle = async (title, user) => {
    const objects = await Object.find({
        title: { $regex: title, $options: 'i' },
        isDeleted: false,
        user
    }).exec();

    return objects;
};

const getUserFavoriteObjects = async (user) => {
    const objects = await Object.find({
        isFavorite: true,
        isArchived: false,
        isDeleted: false,
        user
    })

    return objects;
};

const getSubObjects = async (user, parentId) => {
    const subobjects = await Object.find({
        parent: parentId,
        user,
        isArchived: false,
        isDeleted: false,
        isCompleted: false
    });
    if (!subobjects.length) {
        const error = new Error("No sub-objects found for this parent object.");
        error.statusCode = 404;
        throw error;
    }
    return subobjects;
};

const getObjectsByTypeAndSource = async (user, { type, source }) => {
    const query = { user, isArchived: false, isDeleted: false };

    if (type) {
        query.type = type;
    }

    if (source) {
        query.source = source;
    }

    const objects = await Object.find(query);
    return objects;
}

const getObjectsBySource = async (user, source) => {
    const objects = await Object.find({
        source,
        user,
        isArchived: false,
        isDeleted: false
    })
    return objects;
}

export {
    getInboxObjects,
    getInboxObject,
    createObject,
    filterObjects,
    updateObject,
    getObject,
    getUserOverdueObjects,
    getUserObjectsByDate,
    moveObjecttoDate,
    getThisWeekObjects,
    getAllObjects,
    getObjectFilterByLabel,
    getAllObjectsByBloack,
    updateInboxObject,
    searchObjectsByTitle,
    createInboxObject,
    getUserTodayObjects,
    getThisWeekObjectsByDateRange,
    getUserFavoriteObjects,
    getSubObjects,
    getObjectsByTypeAndSource,
    getObjectsBySource
}
