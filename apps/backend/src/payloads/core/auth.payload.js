import Joi from "joi";

const RegisterPayload = Joi.object({
    fullName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required()
})

const LoginPayload = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
})

export {
    LoginPayload,
    RegisterPayload
};
