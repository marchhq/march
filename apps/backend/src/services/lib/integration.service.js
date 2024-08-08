import { Integration } from "../../models/integration/integration.model.js";

const getIntegration = async (user) => {
    const issues = await Integration.find({
        user
    })
        .sort({ created_at: -1 });

    return issues;
};

const moveItemtoDate = async (date, id) => {
    const formattedDate = new Date(date);

    const item = await Integration.findByIdAndUpdate(
        id,
        { $set: { date: formattedDate } },
        { new: true }
    );

    return item;
};

export {
    getIntegration,
    moveItemtoDate
}
