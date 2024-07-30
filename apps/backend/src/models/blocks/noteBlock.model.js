import { Schema } from "mongoose";
import { Block } from "../lib/block.model.js";

const noteBlockSchema = new Schema({
    name: {
        type: String,
        default: ''
    },
    viewingNoteId: {
        type: Schema.Types.ObjectId,
        ref: 'Note'
    }
}, {
    timestamps: true
});

const NoteBlock = Block.discriminator('note', new Schema({
    data: noteBlockSchema
}));

export {
    NoteBlock
}
