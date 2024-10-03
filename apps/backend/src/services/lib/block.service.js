import { Block } from "../../models/lib/block.model.js";
import { createNote } from "./note.service.js"

const createBlock = async (user, blockData) => {
    const type = blockData.data.type;
    let block;

    switch (type) {
    case 'note': {
        const note = await createNote(user, {});
        block = new Block({
            name: "Note",
            user,
            data: { ...blockData.data, viewingNoteId: note._id }
        });
        break;
    }
    case 'list': {
        block = new Block({
            name: "List",
            user,
            data: { ...blockData.data }
        });
        break;
    }
    default:
        block = new Block({
            name: blockData.name ? blockData.name : type,
            user,
            data: { ...blockData.data }
        });
    }

    await block.save();
    return block;
};

const getBlocks = async (user) => {
    const blocks = await Block.find({
        user
    })
    if (!blocks) {
        throw new Error('Block not found');
    }
    return blocks;
};

const deleteBlock = async (id) => {
    const block = await Block.findOneAndDelete({ _id: id });

    if (!block) {
        throw new Error('Block not found');
    }
    return block;
};

const getBlock = async (user, id) => {
    const block = await Block.findOne({
        _id: id,
        user
    })
    if (!block) {
        throw new Error('Block not found');
    }
    return block;
};

const updateBlock = async (id, updateData) => {
    const updatedBlock = await Block.findOneAndUpdate({
        _id: id
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
