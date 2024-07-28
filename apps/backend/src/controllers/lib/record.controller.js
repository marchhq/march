import { createRocord, getRocords, getRocord } from "../../services/lib/record.service.js";

const createRocordController = async (req, res, next) => {
    try {
        const user = req.auth.userId;

        const requestedData = req.body;
        const record = await createRocord(user, requestedData);

        res.status(200).json({
            status: 200,
            response: record
        });
    } catch (err) {
        next(err);
    }
};

const getRocordsController = async (req, res, next) => {
    try {
        const user = req.auth.userId;

        const records = await getRocords(user);

        res.status(200).json({
            status: 200,
            response: records
        });
    } catch (err) {
        next(err);
    }
};

const getRocordController = async (req, res, next) => {
    try {
        const user = req.auth.userId;
        const { record: id } = req.params;

        const record = await getRocord(user, id);

        res.status(200).json({
            status: 200,
            response: record
        });
    } catch (err) {
        next(err);
    }
};

export {
    createRocordController,
    getRocordsController,
    getRocordController
}
