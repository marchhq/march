import { verifyJWTToken } from "../utils/jwt.service.js";
import { BlackList } from "../models/core/black-list.model.js";
import { getUserById } from "../services/core/user.service.js";
import moment from 'moment-timezone';

const JWTMiddleware = async (req, res, next) => {
    try {
        const { authorization: header } = req.headers;
        if (!header) {
            throw new Error("Unauthorized")
        }
        const token = header.split(' ')[1]
        const checkIfBlacklisted = await BlackList.findOne({ token });
        if (checkIfBlacklisted) {
            return res
                .status(401)
                .json({ message: "This token has expired. Please login" });
        }
        const payload = await verifyJWTToken(token);
        const user = await getUserById(payload.id)
        req.user = user;
        if (user) {
            moment.tz.setDefault(user.timezone);
        }
        next();
    } catch (err) {
        const error = new Error(err.message);
        error.statusCode = 401;
        next(error);
    }
};

const AdminJWTMiddleware = async (req, res, next) => {
    try {
        const { authorization: header } = req.headers;
        if (!header) {
            throw new Error("Unauthorized")
        }
        const token = header.split(' ')[1]
        const payload = await verifyJWTToken(token);
        if (!payload.roles.includes("admin")) {
            const error = new Error("Unauthorized")
            throw error
        }
        req.user = payload;
        next();
    } catch (err) {
        const error = new Error(err.message);
        error.statusCode = 401;
        next(error);
    }
};

export {
    JWTMiddleware,
    AdminJWTMiddleware
};
