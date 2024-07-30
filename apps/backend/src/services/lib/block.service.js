import { Block } from "../../models/lib/block.model.js";
import { createNote } from "./note.service.js"

const createBlock = async (user, blockData) => {
    const type = blockData.data.type;
    let block;

    switch (type) {
    case 'notes': {
        const note = await createNote(user, {});
        console.log("sajda: ", note._id);
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
        throw new Error('Invalid block type');
    }

    await block.save();
    return block;
};

export {
    createBlock
};
