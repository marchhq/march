import { Schema } from "mongoose";
import { v4 as uuid } from "uuid";
import { db } from "../../loaders/db.loader.js";

const BlockSchema = new Schema({
    uuid: {
        type: String,
        default: () => uuid()
    },
    name: {
        type: String,
        default: ''
    },
    data: {
        type: Schema.Types.Mixed
    },
    user: {
        type: Schema.Types.String,
        required: true
    },
    page: {
        type: Schema.Types.ObjectId,
        ref: 'Page'
    }
}, {
    timestamps: true
});

const Block = db.model('Block', BlockSchema, 'blocks');

export {
    Block
}
