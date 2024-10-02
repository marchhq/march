import { Schema } from "mongoose";
import { v4 as uuid } from "uuid";
import { db } from "../../loaders/db.loader.js";

const statusChoices = ["inbox", "todo", "in progress", "done"];

const RecordSchema = new Schema({
    uuid: {
        type: String,
        default: () => uuid()
    },
    title: {
        type: String
    },
    content: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        enum: statusChoices,
        default: "inbox"
    },
    dueDate: {
        type: Date,
        default: null
    },
    spaces: [{
        type: Schema.Types.ObjectId,
        ref: 'Space'
    }],
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
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

const Record = db.model('Record', RecordSchema, 'records')

export {
    Record
}
