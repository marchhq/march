import { Schema } from "mongoose";
import { v4 as uuid } from "uuid";
import { db } from "../../loaders/db.loader.js";

const effortChoices = ["none", "large", "medium", "small"];
// const statusChoices = ["inbox", "todo", "in progress", "done"];

const ItemSchema = new Schema({
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
    description: {
        type: String,
        default: ''
    },
    effort: {
        type: String,
        enum: effortChoices
    },
    dueDate: {
        type: Date,
        default: null
    },
    id: {
        type: String
    },
    metadata: {
        type: Schema.Types.Mixed
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
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    isCompleted: {
        type: Boolean,
        default: false
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

const Item = db.model('Item', ItemSchema, 'items')

export {
    Item
}

// old code
// import { Schema } from "mongoose";
// import { v4 as uuid } from "uuid";
// import { db } from "../../loaders/db.loader.js";

// const effortChoices = ["none", "large", "medium", "small"];
// const statusChoices = ["inbox", "todo", "in progress", "done"];

// const ItemSchema = new Schema({
//     uuid: {
//         type: String,
//         default: () => uuid()
//     },
//     title: {
//         type: String
//     },
//     description: {
//         type: String,
//         default: ''
//     },
//     status: {
//         type: String,
//         enum: statusChoices,
//         default: "inbox"
//     },
//     effort: {
//         type: String,
//         enum: effortChoices
//     },
//     date: {
//         type: Date,
//         default: null
//     },
//     sequenceId: {
//         type: Number,
//         required: true,
//         default: 1
//     },
//     page: [{
//         type: Schema.Types.ObjectId,
//         ref: 'Page'
//     }],
//     user: {
//         type: Schema.Types.String
//         // ref: 'User'
//     },
//     labels: [{
//         type: Schema.Types.ObjectId,
//         ref: 'Label'
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

// ItemSchema.pre('save', async function (next) {
//     if (this.isNew) {
//         try {
//             // Get the maximum sequenceId value from the database specific to space
//             const lastIssue = await Item.findOne({ space: this.space }).sort({ sequenceId: -1 }).limit(1);

//             this.sequenceId = lastIssue ? lastIssue.sequenceId + 1 : 1;
//         } catch (error) {
//             console.error(error);
//         }
//     }

//     next();
// });

// const Item = db.model('Item', ItemSchema, 'items')

// export {
//     Item
// }
