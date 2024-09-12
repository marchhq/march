import { Schema } from "mongoose";
import { db } from "../../loaders/db.loader.js";

// Define the FileAsset schema
const FileAssetSchema = new Schema({
    attributes: {
        type: Map,
        of: String,
        default: {}
    },
    asset: {
        type: String, // S3 file URL
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

const FileAsset = db.model('FileAsset', FileAssetSchema, 'fileAssets');

export {
    FileAsset
};
