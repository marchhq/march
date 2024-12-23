import { Schema } from "mongoose";
import { v4 as uuid } from "uuid";
import { db } from "../../loaders/db.loader.js";

const TypeSchema = new Schema({
    uuid: {
        type: String,
        default: () => uuid()
    },
    slug: {
        type: String,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
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

// Pre-save middleware
TypeSchema.pre("save", async function (next) {
    const type = this;

    type.slug = type.slug.replace(/\s+/g, '-').toLowerCase();

    const existingType = await Type.findOne({
        slug: type.slug,
        user: type.user
    });

    if (existingType && existingType._id.toString() !== type._id.toString()) {
        let suffix = 1;
        let newSlug;
        do {
            newSlug = `${type.slug}-${suffix}`;
            suffix++;
        } while (await Type.findOne({ slug: newSlug, user: type.user }));
        type.slug = newSlug;
    }

    next();
});

// Compound index to ensure uniqueness of slug and user combination
TypeSchema.index({ slug: 1, user: 1 }, { unique: true });

const Type = db.model('Type', TypeSchema, 'types');

export {
    Type
}
