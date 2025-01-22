import { Block } from "../../models/lib/block.model.js";
import { createObject } from "./object.service.js";

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
            createObject(user, { type: 'note' }, array, block._id) // Create the an note
        ]);

        // Update the block with the viewingNoteId
        savedBlock.data.viewingNoteId = item._id;
        await savedBlock.save();
        return savedBlock;
    }

    await block.save();
    return block;
};

const getBlocks = async (user, array) => {
    const blocks = await Block.find({
        user,
        array
    })
    if (!blocks) {
        throw new Error('Blocks not found');
    }
    return blocks;
};

const deleteBlock = async (id, array, user) => {
    const block = await Block.findOneAndDelete({ _id: id, user, array });

    if (!block) {
        throw new Error('Block not found');
    }
    return block;
};

const getBlock = async (user, id, array) => {
    const block = await Block.findOne({
        _id: id,
        user,
        array
    }).populate({
        path: 'data.item',
        model: 'Item'
    })
    if (!block) {
        throw new Error('Block not found');
    }
    return block;
};

const updateBlock = async (id, updateData, array, user) => {
    const updatedBlock = await Block.findOneAndUpdate({
        _id: id,
        user,
        array
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
