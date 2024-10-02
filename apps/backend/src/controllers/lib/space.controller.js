import { createSpace, getSpaces, getSpace, updateSpace } from "../../services/lib/space.service.js"

const createSpaceController = async (req, res, next) => {
    try {
        const user = req.user._id;

        const requestedData = req.body;
        const space = await createSpace(user, requestedData);

        res.status(200).json({
            space
        });
    } catch (err) {
        next(err);
    }
};

const getSpacesController = async (req, res, next) => {
    try {
        const user = req.user._id;

        const spaces = await getSpaces(user);

        res.status(200).json({
            spaces
        });
    } catch (err) {
        next(err);
    }
};

const getSpaceController = async (req, res, next) => {
    try {
        const user = req.user._id;
        const { space: id } = req.params;

        const space = await getSpace(user, id);

        res.status(200).json({
            space
        });
    } catch (err) {
        next(err);
    }
};

const updateSpaceController = async (req, res, next) => {
    try {
        const { space: id } = req.params;
        const updateData = req.body;
        const space = await updateSpace(id, updateData);

        res.status(200).json({
            space
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
