import { Record } from "../../models/lib/record.model.js";

const createRecord = async (user, recordData) => {
    const newRecord = new Record({
        ...recordData,
        user
    });
    if (!newRecord) {
        const error = new Error("Failed to create the record")
        error.statusCode = 500
        throw error
    }

    const record = await newRecord.save()

    return record;
};

const getRecords = async (user) => {
    const records = await Record.find({
        user,
        isArchived: false,
        isDeleted: false
    })
        .sort({ created_at: -1 });

    return records;
};

const getRecord = async (user, id) => {
    const record = await Record.find({
        uuid: id,
        user,
        isArchived: false,
        isDeleted: false
    })

    return record;
};

export {
    createRecord,
    getRecords,
    getRecord
}
