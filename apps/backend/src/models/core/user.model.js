import { Schema } from "mongoose";
import { v4 as uuid } from "uuid";
import { db } from "../../loaders/db.loader.js";
import moment from 'moment-timezone';

const allTimezones = moment.tz.names();
const USER_TIMEZONE_CHOICES = allTimezones.map(timezone => timezone);

const UserSchema = new Schema({
    uuid: {
        type: String,
        default: () => uuid()
    },
    fullName: {
        type: Schema.Types.String
    },
    userName: {
        type: Schema.Types.String
    },
    avatar: {
        type: Schema.Types.String,
        default: ''
    },
    roles: {
        type: Schema.Types.Array,
        default: ["user"]
    },
    timezone: {
        type: String,
        default: 'UTC',
        enum: USER_TIMEZONE_CHOICES
    },
    accounts: {
        local: {
            email: {
                type: Schema.Types.String,
                validate: {
                    validator: (e) => {
                        return /^[a-z0-9][a-z0-9-_.]+@([a-z]|[a-z0-9]?[a-z0-9-]+[a-z0-9])\.[a-z0-9]{2,10}(?:\.[a-z]{2,10})?$/.test(e)
                    }
                }
            },
            password: {
                type: Schema.Types.String
            },
            isVerified: {
                type: Schema.Types.Boolean,
                default: false
            }
        },
        google: {
            email: {
                type: Schema.Types.String,
                validate: {
                    validator: (e) => {
                        return /^[a-z0-9][a-z0-9-_.]+@([a-z]|[a-z0-9]?[a-z0-9-]+[a-z0-9])\.[a-z0-9]{2,10}(?:\.[a-z]{2,10})?$/.test(e)
                    }
                }
            },
            id: {
                type: Schema.Types.String
            },
            isVerified: {
                type: Schema.Types.Boolean,
                default: false
            },
            hasAuthorizedEmail: {
                type: Schema.Types.Boolean,
                default: false
            }
        },
        github: {
            email: {
                type: String,
                validate: {
                    validator: (e) => {
                        return /^[a-z0-9][a-z0-9-_.]+@([a-z]|[a-z0-9]?[a-z0-9-]+[a-z0-9])\.[a-z0-9]{2,10}(?:\.[a-z]{2,10})?$/.test(e)
                    }
                }
            },
            id: String,
            isVerified: {
                type: Boolean,
                default: false
            },
            hasAuthorizedEmail: {
                type: Boolean,
                default: false
            }
        }
    },
    integration: {
        linear: {
            accessToken: String,
            userId: String,
            linearTeam: { type: Schema.Types.Mixed },
            connected: { type: Boolean, default: false }
        },
        googleCalendar: {
            accessToken: String,
            refreshToken: String,
            connected: { type: Boolean, default: false }
        },
        gmail: {
            email: String,
            accessToken: String,
            refreshToken: String,
            labelId: String,
            historyId: String,
            connected: { type: Boolean, default: false }
        },
        github: {
            installationId: String,
            userName: String,
            connected: { type: Boolean, default: false }
        },
        x: {
            accessToken: String,
            refreshToken: String,
            connected: { type: Boolean, default: false }
        },
        notion: {
            accessToken: String,
            userId: String,
            workspaceId: String,
            connected: { type: Boolean, default: false }
        }
    }
}, {
    timestamps: true
})
const User = db.model('User', UserSchema, 'users')

export {
    User
};
