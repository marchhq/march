import AuthRouter from "./core/auth.route.js";
import UserRouter from "./core/user.route.js";
import { JWTMiddleware } from "../middlewares/jwt.middleware.js";
import PageRouter from "../routers/lib/page.route.js";
import LinearRoute from "../routers/integration/linear.route.js";
import CalenderRoute from "../routers/integration/calendar.route.js";
import EmailRoute from "../routers/integration/email.route.js"
import GithubRoute from "../routers/integration/github.route.js"

/**
 * @param {import('express').Application} app
**/

const initRoutes = (app) => {
    app.use("/auth", AuthRouter);
    app.use("/users", JWTMiddleware, UserRouter);
    app.use("/api", JWTMiddleware, PageRouter);
    app.use('/', JWTMiddleware, LinearRoute);
    app.use('/calendar', JWTMiddleware, CalenderRoute);
    app.use('/gmail', JWTMiddleware, EmailRoute);
    app.use('/github', JWTMiddleware, GithubRoute);

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
