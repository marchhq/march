import { Schema } from "mongoose";
import { v4 as uuid } from "uuid";
import { db } from "../../loaders/db.loader.js";

const statusChoices = ["null", "todo", "in progress", "done", "archive"];

const ItemSchema = new Schema({
    uuid: {
        type: String,
        default: () => uuid()
    },
    title: {
        type: String
    },
    type: {
        type: String,
        default: "Issue"
    },
    source: {
        type: String,
        default: "march"
    },
    description: {
        type: String,
        default: ''
    },
    dueDate: {
        type: Date,
        default: null
    },
    status: {
        type: String,
        enum: statusChoices,
        default: "null"
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
    spaces: [{
        type: Schema.Types.ObjectId,
        ref: 'Space'
    }],
    blocks: [{
        type: Schema.Types.ObjectId,
        ref: 'Block'
    }],
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    labels: [{
        type: Schema.Types.ObjectId,
        ref: 'Label'
    }],
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

ItemSchema.pre('save', function (next) {
    if (this.status === 'done') {
        this.isCompleted = true;
    } else {
        this.isCompleted = false;
    }
    next();
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
