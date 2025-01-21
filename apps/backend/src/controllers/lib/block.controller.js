import { createBlock, getBlocks, deleteBlock, getBlock, updateBlock } from "../../services/lib/block.service.js";

const createBlockController = async (req, res, next) => {
    try {
        const user = req.user._id;
        const { array } = req.params;

        const requestedData = req.body;
        const block = await createBlock(user, requestedData, array);

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
        const { array } = req.params;

        const blocks = await getBlocks(user, array);

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
        const { block: id, array } = req.params;
        await deleteBlock(id, array, user);

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
        const { block: id, array } = req.params;

        const block = await getBlock(user, id, array);

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
        const { block: id, array } = req.params;

        const block = await updateBlock(id, updateData, array, user);

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
