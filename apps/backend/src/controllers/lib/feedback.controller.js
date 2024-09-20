import { sendFeedbackEmail } from "../../services/lib/feedback.service.js";
const feedbackController = async (req, res) => {
    try {
        const response = await sendFeedbackEmail(req, res);
        return res.status(response.status).json({ message: response.message });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export { feedbackController };
