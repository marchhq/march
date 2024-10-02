import { Schema } from "mongoose";
import { v4 as uuid } from "uuid";
import { db } from "../../loaders/db.loader.js";

const meetingSchema = new Schema({
    uuid: {
        type: String,
        default: () => uuid()
    },
    title: {
        type: String
    },
    description: {
        type: String,
        default: ''
    },
    metadata: {
        type: Schema.Types.Mixed
    },
    id: {
        type: String
    },
    createdAt: {
        type: Date
    },
    updatedAt: {
        type: Date
    },
    Spaces: [{
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

const Meeting = db.model('Meeting', meetingSchema, 'meetings')

export {
    Meeting
}
