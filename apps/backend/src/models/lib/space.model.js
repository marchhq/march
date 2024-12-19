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
        default: '',
        required: true
    },
    identifier: {
        type: String,
        required: true
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

SpaceSchema.pre("save", async function (next) {
    const space = this;

    space.identifier = space.identifier.replace(/\s+/g, '-');

    const existingSpaceByIdentifier = await Space.findOne({
        identifier: space.identifier,
        users: { $in: space.users }
    });

    if (existingSpaceByIdentifier) {
        let suffix = 1;
        let newIdentifier;
        do {
            newIdentifier = `${space.identifier}${suffix}`;
            suffix++;
        } while (await Space.findOne({ identifier: newIdentifier, users: { $in: space.users } }));
        space.identifier = newIdentifier;
    }

    next();
});

const Space = db.model('Space', SpaceSchema, 'spaces');

export {
    Space
}
