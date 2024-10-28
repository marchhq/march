import { Schema } from "mongoose";
import { v4 as uuid } from "uuid";
import { db } from "../../loaders/db.loader.js";

const statusChoices = ["null", "todo", "in progress", "done", "archive"];

const ItemSchema = new Schema(
    {
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
            default: ""
        },
        dueDate: {
            type: Date,
            default: null
        },
        cycleDate: {
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
        spaces: [
            {
                type: Schema.Types.ObjectId,
                ref: "Space"
            }
        ],
        blocks: [
            {
                type: Schema.Types.ObjectId,
                ref: "Block"
            }
        ],
        user: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        labels: [
            {
                type: Schema.Types.ObjectId,
                ref: "Label"
            }
        ],
        lastVisitedSpace: {
            type: Schema.Types.ObjectId,
            ref: 'Space',
            default: null
        },
        isFavourited: {
            type: Boolean,
            default: false
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
    },
    {
        timestamps: true
    }
);

ItemSchema.pre("save", function (next) {
    if (this.status === "done") {
        this.isCompleted = true;
    } else {
        this.isCompleted = false;
    }
    next();
});

ItemSchema.pre("findOneAndUpdate", function (next) {
    const update = this.getUpdate();
    if (update.$set && update.$set.status === "done") {
        update.$set.isCompleted = true;
    } else if (update.$set && update.$set.status) {
        update.$set.isCompleted = false;
    }

    next();
});

const Item = db.model("Item", ItemSchema, "items");

export {
    Item
}
