import { Schema } from "mongoose";
import { v4 as uuid } from "uuid";
import { db } from "../../loaders/db.loader.js";

const SpaceSchema = new Schema({
    uuid: {
        type: String,
        default: () => uuid()
    },
    name: {
        type: String,
        default: ''
    },
    icon: {
        type: String,
        default: 'home'
    },
    users: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }],
    blocks: [{
        type: Schema.Types.String
    }],
    isArchived: {
        type: Boolean,
        default: false
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

SpaceSchema.index({ date: 1, user: 1 }, { unique: true });
const Space = db.model('Space', SpaceSchema, 'spaces');

export {
    Space
}
