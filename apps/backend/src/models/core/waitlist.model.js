import { Schema } from "mongoose";
import { db } from "../../loaders/db.loader.js";

const WaitlistSchema = new Schema(
    {
        token: {
            type: String,
            required: true,
            ref: "User"
        }
    },
    { timestamps: true }
);

const WaitList = db.model('WaitList', WaitlistSchema, 'wait-lists')

export {
    WaitList
};
