// import { Schema } from "mongoose";
// import { v4 as uuid } from "uuid";
// import { db } from "../../loaders/db.loader.js";

// const SpaceSchema = new Schema({
//     uuid: {
//         type: String,
//         default: () => uuid()
//     },
//     name: {
//         type: String,
//         default: ''
//     },
//     icon: {
//         type: String,
//         default: 'home'
//     },
//     users: [{
//         type: Schema.Types.ObjectId,
//         ref: 'User',
//         required: true
//     }],
//     blocks: [{
//         type: Schema.Types.String,
//         ref: 'Block'
//     }],
//     isArchived: {
//         type: Boolean,
//         default: false
//     },
//     isDeleted: {
//         type: Boolean,
//         default: false
//     }
// }, {
//     timestamps: true
// });

// SpaceSchema.pre("save", async function (next) {
//     const space = this;

//     const existingSpace = await Space.findOne({
//         $or: [
//             { name: space.name }
//         ],
//         users: space.users
//     });

//     if (existingSpace) {
//         if (existingSpace.name === space.name) {
//             const error = new Error("The Space name is already taken.");
//             error.statusCode = 400;
//             return next(error);
//         }
//     }

//     next();
// });

// const Space = db.model('Space', SpaceSchema, 'spaces');

// export {
//     Space
// }

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
    icon: {
        type: String,
        default: 'home'
    },
    users: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }],
    blocks: [{
        type: Schema.Types.String,
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

SpaceSchema.pre("save", async function (next) {
    const space = this;

    const existingSpace = await Space.findOne({
        name: space.name,
        users: { $in: space.users }
    });

    if (existingSpace) {
        const error = new Error("The Space name is already taken.");
        error.statusCode = 400;
        return next(error);
    }

    next();
});

const Space = db.model('Space', SpaceSchema, 'spaces');

export {
    Space
}
