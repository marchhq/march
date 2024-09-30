import { createLabel, getLabels } from "../../services/lib/label.service.js"

const createLabelController = async (req, res, next) => {
    try {
        const labelData = req.body;
        const user = req.user._id;

        const label = await createLabel(labelData, user);

        res.json({
            label
        });
    } catch (err) {
        next(err);
    }
};

const getLabelsController = async (req, res, next) => {
    try {
        const user = req.user._id;
        const labels = await getLabels(user);

        res.json({
            labels
        });
    } catch (err) {
        next(err);
    }
};

export {
    createLabelController,
    getLabelsController
}
