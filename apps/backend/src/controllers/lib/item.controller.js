import { createItem, getItems, updateItem, getItem } from "../../services/lib/item.service.js";

const createItemController = async (req, res, next) => {
    try {
        const user = req.user._id;

        const requestedData = req.body;
        const item = await createItem(user, requestedData);

        res.status(200).json({
            item
        });
    } catch (err) {
        next(err);
    }
};

const updateItemController = async (req, res, next) => {
    try {
        const { item: id } = req.params;
        const { pageId, removePageId, ...updateData } = req.body; // Destructure pageId and removePageId

        const updateOperation = {};

        // If pageId is provided, add it to the pages array using $addToSet (to prevent duplicates)
        if (pageId) {
            updateOperation.$addToSet = { pages: pageId };
        }

        // If removePageId is provided, remove it from the pages array
        if (removePageId) {
            updateOperation.$pull = { pages: removePageId };
        }

        // Set other fields if they exist
        if (Object.keys(updateData).length) {
            updateOperation.$set = updateData;
        }

        const item = await updateItem(id, updateOperation);

        res.status(200).json({
            item
        });
    } catch (err) {
        next(err);
    }
};

const getItemsController = async (req, res, next) => {
    try {
        const user = req.user._id;
        const filters = {
            dueDate: req.query.dueDate,
            effort: req.query.effort
        };
        const sortOptions = req.query.sort;

        const items = await getItems(user, filters, sortOptions);

        res.status(200).json({
            items
        });
    } catch (err) {
        next(err);
    }
};

const getItemController = async (req, res, next) => {
    try {
        const user = req.user._id;
        const { item: id } = req.params;

        const item = await getItem(user, id);

        res.status(200).json({
            item
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
