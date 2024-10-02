import { Space } from "../../models/lib/space.model.js";

const createSpace = async (user, pageData) => {
    const newSpace = new Space({
        ...pageData,
        users: user
    });
    if (!newSpace) {
        const error = new Error("Failed to create the item")
        error.statusCode = 500
        throw error
    }

    const space = await newSpace.save()

    return space;
};

const getSpaces = async (user) => {
    const space = await Space.find({
        users: user,
        isArchived: false,
        isDeleted: false
    })
        .sort({ created_at: -1 });

    return space;
}

const getSpace = async (user, id) => {
    const space = await Space.find({
        uuid: id,
        users: user,
        isArchived: false,
        isDeleted: false
    })

    return space;
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
