import { Block } from "../../models/lib/block.model.js";
import { createNote } from "./note.service.js"

const createBlock = async (user, blockData, space) => {
    const type = blockData.data.type;
    let block;

    switch (type) {
    case 'note': {
        const note = await createNote(user, {});
        block = new Block({
            name: "Note",
            user,
            space,
            data: { ...blockData.data, viewingNoteId: note._id }
        });
        break;
    }
    case 'list': {
        block = new Block({
            name: "List",
            user,
            space,
            data: { ...blockData.data }
        });
        break;
    }
    default:
        block = new Block({
            name: blockData.name ? blockData.name : type,
            user,
            space,
            data: { ...blockData.data }
        });
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
