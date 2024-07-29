import { Integration } from "../../models/integration/integration.model.js";

const getIntegration = async (user) => {
    const issues = await Integration.find({
        user
    })
        .sort({ created_at: -1 });

    return issues;
};

export {
    getIntegration
}
