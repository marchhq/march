import { createObject, createInboxObject, filterObjects, updateObject, getAllObjectsByBloack, getObject, getObjectFilterByLabel, searchObjectsByTitle, getThisWeekObjectsByDateRange, getUserFavoriteObjects, getSubObjects, getObjectsBySource, getObjectsByTypeAndSource } from "../../services/lib/object.service.js";
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

const createObjectController = async (req, res, next) => {
    try {
        const user = req.user._id;
        const { array, block } = req.params;
        const requestedData = req.body;
        const { type } = requestedData;

        let objectData = requestedData;

        if (type === 'link' || type === 'text') {
            const updatedData = await generateLinkPreview(requestedData);
            if (updatedData) {
                objectData = updatedData;
            }
        }

        const object = await createObject(user, objectData, array, block);

        return res.status(200).json({ object });
    } catch (err) {
        next(err);
    }
};

const createInboxObjectController = async (req, res, next) => {
    try {
        const user = req.user._id;
        const requestedData = req.body;
        const { type } = requestedData;

        let objectData = requestedData;

        if (type === "bookmark" && extractUrl(requestedData.title)) {
            const updatedData = await generateLinkPreview(requestedData);
            if (updatedData) {
                objectData = updatedData;
            }
        }

        const object = await createInboxObject(user, objectData);

        res.status(200).json({
            response: object
        });
    } catch (err) {
        next(err);
    }
};

const updateObjectController = async (req, res, next) => {
    try {
        const { array, block, object: id } = req.params;
        const updateData = req.body;
        const object = await updateObject(id, updateData, array, block);

        res.status(200).json({
            object
        });
    } catch (err) {
        next(err);
    }
};

const filterObjectsController = async (req, res, next) => {
    try {
        const user = req.user._id;
        const filters = {
            dueDate: req.query.dueDate
        };
        const sortOptions = req.query.sort;

        const objects = await filterObjects(user, filters, sortOptions);

        res.status(200).json({
            response: objects
        });
    } catch (err) {
        next(err);
    }
};

const getAllObjectsByBloackController = async (req, res, next) => {
    try {
        const user = req.user._id;
        const { array, block } = req.params;
        const objects = await getAllObjectsByBloack(user, array, block);

        res.status(200).json({
            objects
        });
    } catch (err) {
        next(err);
    }
};

const getObjectController = async (req, res, next) => {
    try {
        const user = req.user._id;
        const { array, block, object: id } = req.params;

        const object = await getObject(user, id, array, block);

        res.status(200).json({
            object
        });
    } catch (err) {
        next(err);
    }
};

const getObjectFilterByLabelController = async (req, res, next) => {
    const { name } = req.query;
    const { array } = req.params;
    const user = req.user._id;

    try {
        const objects = await getObjectFilterByLabel(name, user, array);
        res.status(200).json(objects);
    } catch (err) {
        next(err);
    }
};

const searchObjectsByTitleController = async (req, res, next) => {
    const { q } = req.query;
    const user = req.user._id;
    try {
        const objects = await searchObjectsByTitle(q, user);
        res.status(200).json({
            response: objects
        });
    } catch (err) {
        next(err);
    }
};

const getThisWeekObjectsByDateRangeController = async (req, res, next) => {
    try {
        const me = req.user._id;
        const { startDate, endDate } = req.query;

        if (!startDate || !endDate) {
            return res.status(400).json({
                message: "Please provide both startDate and endDate."
            });
        }

        const objects = await getThisWeekObjectsByDateRange(me, new Date(startDate), new Date(endDate));

        res.status(200).json({
            response: objects
        });
    } catch (err) {
        next(err);
    }
};

const getUserFavoriteObjectsController = async (req, res, next) => {
    try {
        const user = req.user._id;

        const objects = await getUserFavoriteObjects(user);

        res.status(200).json({
            response: objects
        });
    } catch (err) {
        next(err);
    }
};

const getSubObjectsController = async (req, res, next) => {
    try {
        const user = req.user._id;
        const { object: parentId } = req.params;

        const subObjects = await getSubObjects(user, parentId);

        res.status(200).json({
            response: subObjects
        });
    } catch (err) {
        next(err);
    }
};

const getObjectsByTypeAndSourceController = async (req, res, next) => {
    try {
        const user = req.user._id;
        const { type, source } = req.query;
        const objects = await getObjectsByTypeAndSource(user, { type, source });
        res.json({
            objects
        });
    } catch (error) {
        next(error);
    }
}

const getObjectsBySourceController = async (req, res, next) => {
    try {
        const user = req.user._id;
        const { source } = req.query;
        const objects = await getObjectsBySource(user, source);
        res.json({ objects });
    } catch (error) {
        next(error);
    }
}

export {
    createObjectController,
    filterObjectsController,
    updateObjectController,
    getObjectController,
    getObjectFilterByLabelController,
    searchObjectsByTitleController,
    getAllObjectsByBloackController,
    createInboxObjectController,
    getThisWeekObjectsByDateRangeController,
    getUserFavoriteObjectsController,
    getSubObjectsController,
    getObjectsByTypeAndSourceController,
    getObjectsBySourceController
}
