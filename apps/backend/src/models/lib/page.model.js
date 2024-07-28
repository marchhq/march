import { Schema } from "mongoose";
import { v4 as uuid } from "uuid";
import { db } from "../../loaders/db.loader.js";

const PageSchema = new Schema({
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
        type: Schema.Types.String,
        // ref: 'User',
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

PageSchema.index({ date: 1, user: 1 }, { unique: true });
const Page = db.model('Page', PageSchema, 'pages');

export {
    Page
}
