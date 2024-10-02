import { createSpace, getSpaces, getSpace, updateSpace } from "../../services/lib/space.service.js"

const createSpaceController = async (req, res, next) => {
    try {
        const user = req.user._id;

        const requestedData = req.body;
        const page = await createSpace(user, requestedData);

        res.status(200).json({
            page
        });
    } catch (err) {
        next(err);
    }
};

const getSpacesController = async (req, res, next) => {
    try {
        const user = req.user._id;

        const pages = await getSpaces(user);

        res.status(200).json({
            pages
        });
    } catch (err) {
        next(err);
    }
};

const getSpaceController = async (req, res, next) => {
    try {
        const user = req.user._id;
        const { space: id } = req.params;

        const page = await getSpace(user, id);

        res.status(200).json({
            page
        });
    } catch (err) {
        next(err);
    }
};

const updateSpaceController = async (req, res, next) => {
    try {
        const { space: id } = req.params;
        const updateData = req.body;
        const page = await updateSpace(id, updateData);

        res.status(200).json({
            page
        });
    } catch (err) {
        next(err);
    }
};

export {
    createSpaceController,
    getSpacesController,
    getSpaceController,
    updateSpaceController
}
