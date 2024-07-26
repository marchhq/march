import Joi from "joi";
import moment from 'moment-timezone';

const allTimezones = moment.tz.names();
const USER_TIMEZONE_CHOICES = allTimezones.map(timezone => timezone);

const UpdateUserPayload = Joi.object({
    fullName: Joi.string().optional(),
    userName: Joi.string().optional(),
    avatar: Joi.string().optional(),
    timezone: Joi.string().valid(...USER_TIMEZONE_CHOICES).optional()
});

export {
    UpdateUserPayload
}
