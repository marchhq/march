import { createSource, getAllSources } from "../../services/lib/source.service.js";
import { z } from "zod";

const sourceSchema = z.object({
    slug: z.string().min(1, "Slug is required").max(100, "Slug is too long"),
    user: z.string().regex(/^[a-f\d]{24}$/i, "Invalid user ID"),
    isArchived: z.boolean().optional(),
    isDeleted: z.boolean().optional()
});

const createSourceController = async (req, res, next) => {
    try {
        const user = req.user._id;
        const validatedData = sourceSchema.parse(req.body);
        const source = await createSource(user, validatedData);
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
