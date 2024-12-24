import { Schema } from "mongoose";
import { v4 as uuid } from "uuid";
import { db } from "../../loaders/db.loader.js";

const SourceSchema = new Schema({
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
SourceSchema.pre("save", async function (next) {
    const source = this;

    source.slug = source.slug.replace(/\s+/g, '-').toLowerCase();

    const existingSource = await Source.findOne({
        slug: source.slug,
        user: source.user
    });

    if (existingSource && existingSource._id.toString() !== source._id.toString()) {
        let suffix = 1;
        let newSlug;
        do {
            newSlug = `${source.slug}-${suffix}`;
            suffix++;
        } while (await Source.findOne({ slug: newSlug, user: source.user }));
        source.slug = newSlug;
    }

    next();
});

// Compound index to ensure uniqueness of slug and user combination
SourceSchema.index({ slug: 1, user: 1 }, { unique: true });

const Source = db.model('Source', SourceSchema, 'sources');

export {
    Source
}
