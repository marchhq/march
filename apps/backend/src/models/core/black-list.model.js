import { Schema } from "mongoose";
import { db } from "../../loaders/db.loader.js";

const BlacklistSchema = new Schema(
    {
        token: {
            type: String,
            required: true,
            ref: "User"
        }
    },
    { timestamps: true }
);

const BlackList = db.model('BlackList', BlacklistSchema, 'black-lists')

export {
    BlackList
};
