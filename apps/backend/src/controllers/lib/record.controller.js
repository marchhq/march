import { createRocord } from "../../services/lib/record.service.js";

const createRocordController = async (req, res, next) => {
    try {
        const user = req.auth.userId;

        const requestedData = req.body;
        const item = await createRocord(user, requestedData);

        res.status(200).json({
            status: 200,
            response: item
        });
    } catch (err) {
        next(err);
    }
};

export {
    createRocordController
}
