import { Integration } from "../../models/integration/integration.model.js";
import { Item } from "../../models/lib/item.model.js";

const getIntegration = async (user) => {
    const issues = await Integration.find({
        user
    })
        .sort({ created_at: -1 });

    return issues;
};

const moveItemtoDate = async (date, id) => {
    const formattedDate = date ? new Date(date) : null;

    const item = await Item.findByIdAndUpdate(
        id,
        { $set: { dueDate: formattedDate } },
        { new: true }
    );

    return item;
};

export {
    getIntegration,
    moveItemtoDate
}
