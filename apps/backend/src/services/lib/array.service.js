import { Array } from "../../models/lib/array.model.js";

const createArray = async (user, arrayData) => {
    const newArray = new Array({
        ...arrayData,
        users: user
    });
    if (!newArray) {
        const error = new Error("Failed to create the Array");
        error.statusCode = 500
        throw error
    }

    const array = await newArray.save()

    return array;
};

const getArrays = async (user) => {
    const arrays = await Array.find({
        users: user,
        isArchived: false,
        isDeleted: false
    })
        .sort({ created_at: -1 });

    return arrays;
}

const getArray = async (user, id) => {
    const array = await Array.find({
        _id: id,
        users: user,
        isArchived: false,
        isDeleted: false
    })

    return array;
};

const getArrayByName = async (user, name) => {
    const array = await Array.findOne({
        name,
        users: { $in: [user] },
        isArchived: false,
        isDeleted: false
    })

    return array;
};

const updateArray = async (id, updateData) => {
    const updatedArray = await Array.findOneAndUpdate({
        _id: id
    },
    { $set: updateData },
    { new: true }
    )

    return updatedArray;
};

export {
    createArray,
    getArrays,
    getArray,
    updateArray,
    getArrayByName
}
