import { Schema } from "mongoose";
import { v4 as uuid } from "uuid";
import { Block } from "../lib/block.model.js";

const noteBlockSchema = new Schema({
    uuid: {
        type: String,
        default: () => uuid()
    },
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
