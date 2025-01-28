import { Schema } from "mongoose";
import { v4 as uuid } from "uuid";
import { db } from "../../loaders/db.loader.js";

const ArraySchema = new Schema({
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
    blockes: [{
        type: Schema.Types.ObjectId,
        ref: 'Block'
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

ArraySchema.pre("save", async function (next) {
    const array = this;

    array.identifier = array.identifier.replace(/\s+/g, '-');

    const existingArrayByIdentifier = await Array.findOne({
        identifier: array.identifier,
        users: { $in: array.users }
    });

    if (existingArrayByIdentifier) {
        let suffix = 1;
        let newIdentifier;
        do {
            newIdentifier = `${array.identifier}${suffix}`;
            suffix++;
        } while (await Array.findOne({ identifier: newIdentifier, users: { $in: array.users } }));
        array.identifier = newIdentifier;
    }

    next();
});

const Array = db.model('Array', ArraySchema, 'arrays');

export {
    Array
}
