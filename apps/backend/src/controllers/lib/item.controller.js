import { createItem, filterItems, updateItem, getItem, getItemFilterByLabel, searchItemsByTitle, getAllItemsByBloack, createInboxItem, getThisWeekItemsByDateRange, getUserFavoriteItems, getSubItems, getItemsByTypeAndSource, getItemsBySource } from "../../services/lib/item.service.js";
import { linkPreviewGenerator } from "../../services/lib/linkPreview.service.js";

const extractUrl = (text) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const urls = text.match(urlRegex);
    return urls ? urls[0] : null;
};

const generateLinkPreview = async (requestedData) => {
    const url = requestedData.metadata?.url;

    const { title: previewTitle, favicon } = await linkPreviewGenerator(url);

    return {
        ...requestedData,
        title: previewTitle || requestedData.title,
        metadata: {
            ...requestedData.metadata,
            url,
            favicon
        }
    };
};

const createItemController = async (req, res, next) => {
    try {
        const user = req.user._id;
        const { space, block } = req.params;
        const requestedData = req.body;
        const { type } = requestedData;

        let itemData = requestedData;

        if (type === 'link' || type === 'text') {
            const updatedData = await generateLinkPreview(requestedData);
            if (updatedData) {
                itemData = updatedData;
            }
        }

        const item = await createItem(user, itemData, space, block);

        return res.status(200).json({ item });
    } catch (err) {
        next(err);
    }
};

const createInboxItemController = async (req, res, next) => {
    try {
        const user = req.user._id;
        const requestedData = req.body;
        const { type } = requestedData;

        let itemData = requestedData;

        if (type === "bookmark" && extractUrl(requestedData.title)) {
            const updatedData = await generateLinkPreview(requestedData);
            if (updatedData) {
                itemData = updatedData;
            }
        }

        const item = await createInboxItem(user, itemData);

        res.status(200).json({
            response: item
        });
    } catch (err) {
        next(err);
    }
};

// const createInboxItemController = async (req, res, next) => {
//     try {
//         const user = req.user._id;
//         const requestedData = req.body;
//         const { type } = requestedData;

//         let itemData = requestedData;

//         if (type === 'link' || type === 'text') {
//             const updatedData = await generateLinkPreview(requestedData);
//             if (updatedData) {
//                 itemData = updatedData;
//             }
//         }

//         const item = await createInboxItem(user, itemData);

//         res.status(200).json({
//             response: item
//         });
//     } catch (err) {
//         next(err);
//     }
// };

const updateItemController = async (req, res, next) => {
    try {
        const { space, block, item: id } = req.params;
        const updateData = req.body;
        const item = await updateItem(id, updateData, space, block);

        res.status(200).json({
            item
        });
    } catch (err) {
        next(err);
    }
};

const filterItemsController = async (req, res, next) => {
    try {
        const user = req.user._id;
        const filters = {
            dueDate: req.query.dueDate
        };
        const sortOptions = req.query.sort;

        const items = await filterItems(user, filters, sortOptions);

        res.status(200).json({
            response: items
        });
    } catch (err) {
        next(err);
    }
};

const getAllItemsByBloackController = async (req, res, next) => {
    try {
        const user = req.user._id;
        const { space, block } = req.params;
        const items = await getAllItemsByBloack(user, space, block);

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
        const { space, block, item: id } = req.params;

        const item = await getItem(user, id, space, block);

        res.status(200).json({
            item
        });
    } catch (err) {
        next(err);
    }
};

const getItemFilterByLabelController = async (req, res, next) => {
    const { name } = req.query;
    const { space } = req.params;
    const user = req.user._id;

    try {
        const items = await getItemFilterByLabel(name, user, space);
        res.status(200).json(items);
    } catch (err) {
        next(err);
    }
};

const searchItemsByTitleController = async (req, res, next) => {
    const { q } = req.query;
    const user = req.user._id;
    try {
        const items = await searchItemsByTitle(q, user);
        res.status(200).json({
            response: items
        });
    } catch (err) {
        next(err);
    }
};

const getThisWeekItemsByDateRangeController = async (req, res, next) => {
    try {
        const me = req.user._id;
        const { startDate, endDate } = req.query;

        if (!startDate || !endDate) {
            return res.status(400).json({
                message: "Please provide both startDate and endDate."
            });
        }

        const items = await getThisWeekItemsByDateRange(me, new Date(startDate), new Date(endDate));

        res.status(200).json({
            response: items
        });
    } catch (err) {
        next(err);
    }
};

const getUserFavoriteItemsController = async (req, res, next) => {
    try {
        const user = req.user._id;

        const items = await getUserFavoriteItems(user);

        res.status(200).json({
            response: items
        });
    } catch (err) {
        next(err);
    }
};

const getSubItemsController = async (req, res, next) => {
    try {
        const user = req.user._id;
        const { item: parentId } = req.params;

        const subItems = await getSubItems(user, parentId);

        res.status(200).json({
            response: subItems
        });
    } catch (err) {
        next(err);
    }
};

const getItemsByTypeAndSourceController = async (req, res, next) => {
    try {
        const user = req.user._id;
        const { type, source } = req.query;
        const items = await getItemsByTypeAndSource(user, { type, source });
        res.json({
            items
        });
    } catch (error) {
        next(error);
    }
}

const getItemsBySourceController = async (req, res, next) => {
    try {
        const user = req.user._id;
        const { source } = req.query;
        const items = await getItemsBySource(user, source);
        res.json({ items });
    } catch (error) {
        next(error);
    }
}

export {
    createItemController,
    filterItemsController,
    updateItemController,
    getItemController,
    getItemFilterByLabelController,
    searchItemsByTitleController,
    getAllItemsByBloackController,
    createInboxItemController,
    getThisWeekItemsByDateRangeController,
    getUserFavoriteItemsController,
    getSubItemsController,
    getItemsByTypeAndSourceController,
    getItemsBySourceController
}
