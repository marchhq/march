import { getIntegration } from "../../services/lib/integration.service.js";

const getIntegrationController = async (req, res, next) => {
    try {
        // const user = req.user._id;
        const user = req.auth.userId;

        const issues = await getIntegration(user);

        res.status(200).json({
            issues
        });
    } catch (err) {
        next(err);
    }
};

export {
    getIntegrationController
}
