import { Record } from "../../models/lib/record.model.js";

const createRocord = async (user, recordData) => {
    const newRocord = new Record({
        ...recordData,
        user
    });
    if (!newRocord) {
        const error = new Error("Failed to create the record")
        error.statusCode = 500
        throw error
    }

    const record = await newRocord.save()

    return record;
};

const getRocords = async (user) => {
    const records = await Record.find({
        user,
        isArchived: false,
        isDeleted: false
    })
        .sort({ created_at: -1 });

    return records;
};

const getRocord = async (user, id) => {
    const record = await Record.find({
        uuid: id,
        user,
        isArchived: false,
        isDeleted: false
    })

    return record;
};

export {
    createRocord,
    getRocords,
    getRocord
}
