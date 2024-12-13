import { createBlock, getBlocks, deleteBlock, getBlock, updateBlock } from "../../services/lib/block.service.js";

const createBlockController = async (req, res, next) => {
    try {
        const user = req.user._id;
        const space = res.locals.space._id;

        const requestedData = req.body;
        const block = await createBlock(user, requestedData, space);

        res.status(200).json({
            block
        });
    } catch (err) {
        next(err);
    }
};

const getBlocksController = async (req, res, next) => {
    try {
        const user = req.user._id;
        const space = res.locals.space._id;

        const blocks = await getBlocks(user, space);

        res.status(200).json({
            blocks
        });
    } catch (err) {
        next(err);
    }
};

const deleteBlockController = async (req, res, next) => {
    try {
        const user = req.user._id;
        const space = res.locals.space._id;
        const { block: id } = req.params;
        await deleteBlock(id, space, user);

        res.status(200).json({
            ok: 'ok'
        });
    } catch (err) {
        next(err);
    }
};

const getBlockController = async (req, res, next) => {
    try {
        const user = req.user._id;
        const space = res.locals.space._id;
        const { block: id } = req.params;

        const block = await getBlock(user, id, space);

        res.status(200).json({
            block
        });
    } catch (err) {
        next(err);
    }
};

const updateBlockController = async (req, res, next) => {
    try {
        const user = req.user._id;
        const updateData = req.body;
        const space = res.locals.space._id;
        const { block: id } = req.params;

        const block = await updateBlock(id, updateData, space, user);

        res.status(200).json({
            block
        });
    } catch (err) {
        next(err);
    }
};

export {
    createBlockController,
    getBlocksController,
    deleteBlockController,
    getBlockController,
    updateBlockController
}
