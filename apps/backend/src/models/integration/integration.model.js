import { Schema } from "mongoose";
import { v4 as uuid } from "uuid";
import { db } from "../../loaders/db.loader.js";

const integrationSchema = new Schema({
    uuid: {
        type: String,
        default: () => uuid()
    },
    title: {
        type: String
    },
    type: {
        type: String
    },
    url: {
        type: String
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
    pages: [{
        type: Schema.Types.ObjectId,
        ref: 'Page'
    }],
    user: {
        type: Schema.Types.String
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

const Integration = db.model('Integration', integrationSchema, 'integrations')

export {
    Integration
}
