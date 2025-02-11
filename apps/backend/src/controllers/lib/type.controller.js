import { createType, getAllTypes, getTypesBySlug } from "../../services/lib/type.service.js";

const createTypeController = async (req, res, next) => {
    const user = req.user._id;
    const requestedData = req.body;
    try {
        const type = await createType(user, requestedData);

        res.json({
            type
        })
    } catch (error) {
        next(error);
    }
}
const getAllTypesController = async (req, res, next) => {
    try {
        const user = req.user._id;
        const types = await getAllTypes(user);
        // const sources = await getAllSources(user);
        res.json({
            types
        })
    } catch (error) {
        next(error);
    }
}

const getTypesBySlugController = async (req, res, next) => {
    try {
        const slug = req.params.slug;
        const user = req.user._id;
        const type = await getTypesBySlug(user, slug);
        res.json({
            type
        })
    } catch (error) {
        next(error);
    }
}

export { createTypeController, getAllTypesController, getTypesBySlugController };
