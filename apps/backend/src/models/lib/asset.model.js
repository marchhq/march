import { Schema } from "mongoose";
import { v4 as uuid } from "uuid";
import { db } from "../../loaders/db.loader.js";
const path = require('path');
const fs = require('fs');

function getUploadPath(filename) {
    return `user-${uuid()}-${filename}`;
}

function fileSizeValidator(value) {
    const stats = fs.statSync(value);
    if (stats.size > process.env.FILE_SIZE_LIMIT) {
        throw new Error("File too large. Size should not exceed 5 MB.");
    }
}

const FileAssetSchema = new mongoose.Schema({
    attributes: {
        type: Map,
        of: String,
        default: {},
    },
    asset: {
        type: String,
        required: true,
        validate: [fileSizeValidator, "File size exceeds the limit"],
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


FileAssetSchema.pre('save', function (next) {
    if (this.isModified('asset')) {
        const filename = path.basename(this.asset);
        this.asset = getUploadPath(this, filename);
    }
    next();
});

const FileAsset = db.model('FileAsset', FileAssetSchema, 'fileAssets');

export {
    FileAsset
}
