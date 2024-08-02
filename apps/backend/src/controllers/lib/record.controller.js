import { createRecord, getRecords, getRecord, updateRecord } from "../../services/lib/record.service.js";

const createRecordController = async (req, res, next) => {
    try {
        const user = req.auth.userId;

        const requestedData = req.body;
        const record = await createRecord(user, requestedData);

        res.status(200).json({
            status: 200,
            response: record
        });
    } catch (err) {
        next(err);
    }
};

const getRecordsController = async (req, res, next) => {
    try {
        const user = req.auth.userId;

        const records = await getRecords(user);

        res.status(200).json({
            status: 200,
            response: records
        });
    } catch (err) {
        next(err);
    }
};

const getRecordController = async (req, res, next) => {
    try {
        const user = req.auth.userId;
        const { record: id } = req.params;

        const record = await getRecord(user, id);

        res.status(200).json({
            status: 200,
            response: record
        });
    } catch (err) {
        next(err);
    }
};

const updateRecordController = async (req, res, next) => {
    try {
        const { record: id } = req.params
        const updateData = req.body;
        const record = await updateRecord(id, updateData);

        res.status(200).json({
            status: 200,
            response: record
        });
    } catch (err) {
        next(err);
    }
};

export {
    createRecordController,
    getRecordsController,
    getRecordController,
    updateRecordController
}
