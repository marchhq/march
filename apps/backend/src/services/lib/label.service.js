import { Label } from "../../models/lib/label.model.js";

const createLabel = async (labelData, user, space) => {
    const label = new Label({
        ...labelData,
        user,
        space
    });

    await label.save();
    if (!label) {
        const error = new Error("Failed to create the label")
        error.statusCode = 500
        throw error
    }
    return label;
}

const createLabels = async (labelsData, space, user) => {
    const labels = labelsData.map(labelData => ({
        ...labelData,
        space,
        user
    }));

    const createdLabels = await Label.insertMany(labels);

    if (!createdLabels) {
        const error = new Error("Failed to create the labels")
        error.statusCode = 500
        throw error
    }

    return createdLabels;
}

const getLabels = async (user, space) => {
    const labels = await Label.find({
        user,
        space
    })
        .sort({ name: 1 })
        .exec();

    return labels;
}

const getLabelsBySpace = async (user, space) => {
    const labels = await Label.find({
        user,
        space
    })
        .sort({ name: 1 })
        .exec();

    return labels;
}

const getLabelByName = async (name, user, space) => {
    const labels = await Label.findOne({
        name,
        user,
        space
    })

    return labels;
}

const getLabel = async (id, space) => {
    const label = await Label.findOne({
        _id: id,
        space
    });
    if (!label) {
        const error = new Error("Label not found")
        error.statusCode = 404
        throw error
    }
    return label;
}

const updateLabel = async (id, updatedData, space) => {
    const updatedLabel = await Label.findOneAndUpdate({
        _id: id,
        space
    },
    { $set: updatedData },
    { new: true }
    )
    if (!updatedLabel) {
        const error = new Error("Failed to update Label");
        error.statusCode = 500;
        throw error;
    }
    return updatedLabel;
}

const deleteLabel = async (id, space) => {
    await Label.findOneAndDelete({
        _id: id,
        space
    });
}

const getOrCreateLabels = async (labels, userId) => {
    const labelIds = [];

    for (const label of labels) {
        let existingLabel = await Label.findOne({
            name: label.name,
            user: userId
        });

        if (!existingLabel) {
            const newLabel = new Label({
                name: label.name,
                description: label.description || '',
                color: label.color || '',
                user: userId
            });

            existingLabel = await newLabel.save();
        }

        labelIds.push(existingLabel._id);
    }

    return labelIds;
};

export {
    createLabel,
    createLabels,
    getLabelByName,
    getLabels,
    getLabel,
    updateLabel,
    deleteLabel,
    getOrCreateLabels,
    getLabelsBySpace
}
