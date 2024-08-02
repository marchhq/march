import { Integration } from "../../models/integration/integration.model.js";
import { Item } from "../../models/lib/item.model.js";
import moment from 'moment-timezone';

const getUserItems = async (me) => {
    const items = await Item.find({
        user: me,
        status: { $ne: "done" },
        isArchived: false,
        isDeleted: false
    })
        .sort({ created_at: -1 });

    return items;
}

const getUserTodayItems = async (me) => {
    // const today = new Date();
    const startOfDay = moment().startOf('day');
    const items = await Integration.find({
        user: me,
        date: { $gte: startOfDay, $lt: moment().endOf('day') }
    })

    return items;
}

const getUserOverdueItems = async (me) => {
    const startOfDay = moment().startOf('day');
    const items = await Item.find({
        user: me,
        dueDate: { $lt: startOfDay }, // Due date is before start of today (without time component)
        status: { $ne: "done" },
        isArchived: false,
        isDeleted: false
    })
        .sort({ created_at: -1 });

    return items;
}

const getUserItemsByDate = async (me, date) => {
    const items = await Item.find({
        user: me,
        dueDate: date,
        isArchived: false,
        isDeleted: false
    })
        .sort({ created_at: -1 });

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

const getItems = async (user) => {
    const items = await Item.find({
        user,
        isArchived: false,
        isDeleted: false
    })
        .sort({ created_at: -1 });

    return items;
};

const getItem = async (user, id) => {
    const item = await Item.find({
        uuid: id,
        user,
        isArchived: false,
        isDeleted: false
    })

    return item;
};

const updateItem = async (id, updateData) => {
    const updatedItem = await Item.findOneAndUpdate({
        uuid: id
    },
    { $set: updateData },
    { new: true }
    )

    return updatedItem;
};

export {
    getUserItems,
    createItem,
    getItems,
    updateItem,
    getItem,
    getUserTodayItems,
    getUserOverdueItems,
    getUserItemsByDate
}
