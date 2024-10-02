import { Space } from "../../models/lib/space.model.js";

const createSpace = async (user, pageData) => {
    const newPage = new Space({
        ...pageData,
        users: user
    });
    if (!newPage) {
        const error = new Error("Failed to create the item")
        error.statusCode = 500
        throw error
    }

    const page = await newPage.save()

    return page;
};

const getSpaces = async (user) => {
    const items = await Space.find({
        users: user,
        isArchived: false,
        isDeleted: false
    })
        .sort({ created_at: -1 });

    return items;
}

const getSpace = async (user, id) => {
    const page = await Space.find({
        uuid: id,
        users: user,
        isArchived: false,
        isDeleted: false
    })

    return page;
};

const updateSpace = async (id, updateData) => {
    const updatedPage = await Space.findOneAndUpdate({
        uuid: id
    },
    { $set: updateData },
    { new: true }
    )

    return updatedPage;
};

export {
    createSpace,
    getSpaces,
    getSpace,
    updateSpace
}
