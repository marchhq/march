import { createArray, getArrays, getArray, updateArray, getArrayByName } from "../../services/lib/array.service.js";

const createArrayController = async (req, res, next) => {
    try {
        const user = req.user._id;

        const requestedData = req.body;
        const array = await createArray(user, requestedData);

        res.status(200).json({
            array
        });
    } catch (err) {
        next(err);
    }
};

const getArraysController = async (req, res, next) => {
    try {
        const user = req.user._id;

        const arrays = await getArrays(user);

        res.status(200).json({
            arrays
        });
    } catch (err) {
        next(err);
    }
};

const getArrayController = async (req, res, next) => {
    try {
        const user = req.user._id;
        const { array: id } = req.params;

        const array = await getArray(user, id);

        res.status(200).json({
            array
        });
    } catch (err) {
        next(err);
    }
};

const getArrayByNameController = async (req, res, next) => {
    try {
        const user = req.user._id;
        const { array: name } = req.params;

        const array = await getArrayByName(user, name);

        res.status(200).json({
            array
        });
    } catch (err) {
        next(err);
    }
};

const updateArrayController = async (req, res, next) => {
    try {
        const { array: id } = req.params;
        const updateData = req.body;
        const array = await updateArray(id, updateData);

        res.status(200).json({
            array
        });
    } catch (err) {
        next(err);
    }
};

export {
    createArrayController,
    getArraysController,
    getArrayController,
    updateArrayController,
    getArrayByNameController
}
