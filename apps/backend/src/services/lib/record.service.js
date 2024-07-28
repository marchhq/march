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

export {
    createRocord
}
