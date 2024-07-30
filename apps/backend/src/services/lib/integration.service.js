import { Integration } from "../../models/integration/integration.model.js";

const getIntegration = async (user) => {
    const issues = await Integration.find({
        user
    })
        .sort({ created_at: -1 });

    return issues;
};

const moveItemtoDate = async (date, id) => {
    const formattedDate = new Date(date); // Ensure date is a Date object

    const item = await Integration.findByIdAndUpdate(
        id,
        { $set: { date: formattedDate } }, // Correctly specify the field to update
        { new: true } // Ensure timestamps are updated automatically by Mongoose
    );

    return item;
};

export {
    getIntegration,
    moveItemtoDate
}
