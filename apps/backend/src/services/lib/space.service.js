import { Space } from "../../models/lib/space.model.js";

const createSpace = async (user, spaceData) => {
    const newSpace = new Space({
        ...spaceData,
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

const getSpace = async (user, identifier) => {
    const space = await Space.findOne({
        identifier: identifier,
        users: user,
        isArchived: false,
        isDeleted: false
    })

    return space;
};

const getSpaceByName = async (user, name) => {
    const space = await Space.findOne({
        name,
        users: { $in: [user] },
        isArchived: false,
        isDeleted: false
    })

    return space;
};

const updateSpace = async (identifier, updateData) => {
    const updatedSpace = await Space.findOneAndUpdate({
        identifier: identifier
    },
    { $set: updateData },
    { new: true }
    )

    return updatedSpace;
};

export {
    createSpace,
    getSpaces,
    getSpace,
    updateSpace,
    getSpaceByName
}
