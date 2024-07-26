import { Schema } from "mongoose";
import { v4 as uuid } from "uuid";
import { db } from "../../loaders/db.loader.js";

const LoginLinkSchema = new Schema({
    uuid: {
        type: Schema.Types.String,
        default: () => uuid(),
        unique: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    type: {
        type: String
    },
    token: {
        type: String
    },
    isRevoked: {
        type: Boolean,
        default: false
    },
    expiresAt: {
        type: Schema.Types.Date
    }
}, {
    timestamps: true
})

const LoginLink = db.model('LoginLink', LoginLinkSchema, "login-links");

export {
    LoginLink
}
