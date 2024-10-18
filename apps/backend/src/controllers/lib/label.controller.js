import { createLabel, getLabels, getLabel, updateLabel, deleteLabel, getLabelsBySpace } from "../../services/lib/label.service.js"

const createLabelController = async (req, res, next) => {
    try {
        const labelData = req.body;
        const user = req.user._id;
        const { space } = req.params;

        const label = await createLabel(labelData, user, space);

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
        const { space } = req.params;
        const labels = await getLabels(user, space);

        res.json({
            labels
        });
    } catch (err) {
        next(err);
    }
};

const getLabelsBySpaceController = async (req, res, next) => {
    try {
        const user = req.user._id;
        const { space } = req.params;
        const labels = await getLabelsBySpace(user, space);

        res.json({
            labels
        });
    } catch (err) {
        next(err);
    }
};

const getLabelController = async (req, res, next) => {
    try {
        const { label: id, space } = req.params;
        const label = await getLabel(id, space);

        res.json({
            label
        });
    } catch (err) {
        next(err);
    }
};

const updateLabelController = async (req, res, next) => {
    try {
        const { label: id, space } = req.params;
        const updatedData = req.body;

        const updatedLabel = await updateLabel(id, updatedData, space);
        res.json({
            updatedLabel
        });
    } catch (err) {
        next(err);
    }
};

const deleteLabelController = async (req, res, next) => {
    try {
        const { label: id, space } = req.params;
        await deleteLabel(id, space);
        res.json({
            message: "Label deleted successfully"
        });
    } catch (err) {
        next(err);
    }
};

export {
    createLabelController,
    getLabelsController,
    getLabelController,
    updateLabelController,
    deleteLabelController,
    getLabelsBySpaceController
}
