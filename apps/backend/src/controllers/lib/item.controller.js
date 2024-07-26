import { createItem, getItems, updateItem, getItem } from "../../services/lib/item.service.js";

const createItemController = async (req, res, next) => {
    try {
        // const user = req.user._id;
        const user = req.auth.userId;

        const requestedData = req.body;
        const item = await createItem(user, requestedData);

        res.status(200).json({
            status: 200,
            response: item
        });
    } catch (err) {
        next(err);
    }
};

const updateItemController = async (req, res, next) => {
    try {
        const updateData = req.body;
        const item = await updateItem(updateData);

        res.status(200).json({
            status: 200,
            response: item
        });
    } catch (err) {
        next(err);
    }
};

const getItemsController = async (req, res, next) => {
    try {
        // const user = req.user._id;
        const user = req.auth.userId;

        const items = await getItems(user);

        res.status(200).json({
            status: 200,
            response: items
        });
    } catch (err) {
        next(err);
    }
};

const getItemController = async (req, res, next) => {
    try {
        // const user = req.user._id;
        const user = req.auth.userId;
        const { item: id } = req.params;

        const item = await getItem(user, id);

        res.status(200).json({
            status: 200,
            response: item
        });
    } catch (err) {
        next(err);
    }
};

export {
    createItemController,
    getItemsController,
    updateItemController,
    getItemController
}
