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
        type: String
    },
    userName: {
        type: String
    },
    avatar: {
        type: String,
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
                type: String,
                validate: {
                    validator: (e) => {
                        return /^[a-z0-9][a-z0-9-_.]+@([a-z]|[a-z0-9]?[a-z0-9-]+[a-z0-9])\.[a-z0-9]{2,10}(?:\.[a-z]{2,10})?$/.test(e)
                    }
                }
            },
            password: {
                type: String
            },
            isVerified: {
                type: Boolean,
                default: false
            }
        },
        google: {
            email: {
                type: String,
                validate: {
                    validator: (e) => {
                        return /^[a-z0-9][a-z0-9-_.]+@([a-z]|[a-z0-9]?[a-z0-9-]+[a-z0-9])\.[a-z0-9]{2,10}(?:\.[a-z]{2,10})?$/.test(e)
                    }
                }
            },
            id: {
                type: String
            },
            isVerified: {
                type: Boolean,
                default: false
            },
            hasAuthorizedEmail: {
                type: Boolean,
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
            userId: String
        },
        googleCalendar: {
            accessToken: String,
            refreshToken: String
        },
        gmail: {
            accessToken: String,
            refreshToken: String
        }
    }
}, {
    timestamps: true
})
const User = db.model('User', UserSchema, 'users')

export {
    User
};
