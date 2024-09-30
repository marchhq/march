import { Label } from "../../models/lib/label.model.js";

const createLabel = async (labelData, user) => {
    const label = new Label({
        ...labelData,
        user
    });

    await label.save();
    if (!label) {
        const error = new Error("Failed to create the label")
        error.statusCode = 500
        throw error
    }
    return label;
}
const getLabels = async (user) => {
    const labels = await Label.find({
        user
    })
        .sort({ name: 1 })
        .exec();

    return labels;
}
export {
    createLabel,
    getLabels
}
