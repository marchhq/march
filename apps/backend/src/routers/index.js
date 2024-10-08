import AuthRouter from "./core/auth.route.js";
import UserRouter from "./core/user.route.js";
import { JWTMiddleware } from "../middlewares/jwt.middleware.js";
import SpaceRouter from "../routers/lib/space.route.js";
import LinearRoute from "../routers/integration/linear.route.js";
import CalenderRoute from "../routers/integration/calendar.route.js";
import EmailRoute from "../routers/integration/email.route.js";
import GithubRoute from "../routers/integration/github.route.js";
import NotionRoute from "../routers/integration/notion.route.js";

/**
 * @param {import('express').Application} app
 */

const initRoutes = (app) => {
    app.use("/auth", AuthRouter);
    app.use("/users", JWTMiddleware, UserRouter);
    app.use("/api", JWTMiddleware, SpaceRouter);
    app.use('/linear', JWTMiddleware, LinearRoute);
    app.use('/calendar', JWTMiddleware, CalenderRoute);
    app.use('/gmail', JWTMiddleware, EmailRoute);
    app.use('/github', JWTMiddleware, GithubRoute);
    app.use('/notion', JWTMiddleware, NotionRoute);

    app.use('/protected-route/', JWTMiddleware, (req, res) => {
        res.status(200).json({ message: "You are authorized", verified: true });
    });

    app.get("/", async (req, res) => {
        res.json({
            "message": "Welcome to March Developers Portal"
        })
    })

    app.use("*", (req, res) => {
        res.status(404).json({
            "status": 404,
            "message": "Invalid route"
        })
    })
}

export {
    initRoutes
}
