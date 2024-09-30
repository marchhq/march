import { createLabel } from "../../services/lib/label.service.js"
const createLabelController = async (req, res, next) => {
    try {
        const labelData = req.body;
        const user = req.user._id;

        const label = await createLabel(labelData, user);

        res.json({
            status: 200,
            response: label
        });
    } catch (err) {
        next(err);
    }
};

export {
    createLabelController
}
