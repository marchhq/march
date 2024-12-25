import { createSource, getAllSources } from "../../services/lib/source.service.js";

const createSourceController = async (req, res, next) => {
    try {
        const user = req.user._id;
        const source = await createSource(user, req.body);
        res.json({
            source
        })
    } catch (error) {
        next(error);
    }
}
const getAllSourcesController = async (req, res, next) => {
    try {
        const user = req.user._id;
        const sources = await getAllSources(user);
        res.json({
            sources
        })
    } catch (error) {
        next(error);
    }
}
export { createSourceController, getAllSourcesController };
