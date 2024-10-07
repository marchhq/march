import { itemQueue } from "../../loaders/bullmq.loader.js";
import { createItem, getItems, updateItem, getItem } from "../../services/lib/item.service.js";

const extractUrl = (text) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const urls = text.match(urlRegex);
    return urls ? urls[0] : null;
};
const createItemController = async (req, res, next) => {
    try {
        const user = req.user._id;

        const requestedData = req.body;
        const { title } = requestedData;
        const urlInTitle = extractUrl(title);
        console.log("urlInTitle: ", urlInTitle);
        const item = await createItem(user, requestedData);
        if (urlInTitle) {
            await itemQueue.add("itemQueue", {
                url: urlInTitle,
                itemId: item._id
            });
        }

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
        const updateData = req.body;
        const item = await updateItem(id, updateData);

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
