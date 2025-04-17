import { Schema } from "mongoose";
import { v4 as uuid } from "uuid";
import { db } from "../../loaders/db.loader.js";

const JournalSchema = new Schema({
    uuid: {
        type: String,
        default: () => uuid()
    },
    content: {
        type: String,
        default: ''
    },
    date: {
        type: Date,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    array: {
        type: Schema.Types.ObjectId,
        ref: 'Array'
    }
}, {
    timestamps: true
});

JournalSchema.index({ date: 1, user: 1 }, { unique: true })
const Journal = db.model('Journal', JournalSchema, 'journals')

export {
    Journal
}
