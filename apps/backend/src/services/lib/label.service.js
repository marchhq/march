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

const getLabel = async (id) => {
    const label = await Label.findOne({
        uuid: id
    });
    if (!label) {
        const error = new Error("Label not found")
        error.statusCode = 404
        throw error
    }
    return label;
}

export {
    createLabel,
    getLabels,
    getLabel
}