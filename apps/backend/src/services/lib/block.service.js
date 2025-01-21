import { Block } from "../../models/lib/block.model.js";
import { createItem } from "./object.service.js";

const createBlock = async (user, blockData, array) => {
    const type = blockData.data.type;

    // Initialize block with common properties
    const block = new Block({
        name: blockData.name || type,
        user,
        array,
        data: { ...blockData.data }
    });

    // Handle specific types
    if (type === 'note') {
        const [savedBlock, item] = await Promise.all([
            block.save(),
            createItem(user, { type: 'note' }, array, block._id) // Create the an note
        ]);

        // Update the block with the viewingNoteId
        savedBlock.data.viewingNoteId = item._id;
        await savedBlock.save();
        return savedBlock;
    }

    await block.save();
    return block;
};

const getBlocks = async (user, space) => {
    const blocks = await Block.find({
        user,
        space
    })
    if (!blocks) {
        throw new Error('Blocks not found');
    }
    return blocks;
};

const deleteBlock = async (id, space, user) => {
    const block = await Block.findOneAndDelete({ _id: id, user, space });

    if (!block) {
        throw new Error('Block not found');
    }
    return block;
};

const getBlock = async (user, id, space) => {
    const block = await Block.findOne({
        _id: id,
        user,
        space
    }).populate({
        path: 'data.item',
        model: 'Item'
    })
    if (!block) {
        throw new Error('Block not found');
    }
    return block;
};

const updateBlock = async (id, updateData, space, user) => {
    const updatedBlock = await Block.findOneAndUpdate({
        _id: id,
        user,
        space
    },
    { $set: updateData },
    { new: true }
    )

    return updatedBlock;
};

export {
    createBlock,
    getBlocks,
    deleteBlock,
    getBlock,
    updateBlock
};
