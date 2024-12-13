import { getSpace } from "../services/lib/space.service.js";

const SpaceMiddleware = async (req, res, next) => {
    try {
        const user = req.user._id;
        const space = await getSpace(user, req.params.space);
        res.locals.space = space;
        next();
    } catch (err) {
        const error = new Error(err.message);
        error.statusCode = 403;
        next(error);
    }
};

export {
    SpaceMiddleware
};
