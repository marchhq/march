// import AuthRouter from "./core/auth.route.js";
import UserRouter from "./core/user.route.js";
import { ClerkUserData } from "../middlewares/clerk.middleware.js";
import PageRouter from "../routers/lib/page.route.js";
import LinearRoute from "../routers/integration/linear.route.js";
import CalenderRoute from "../routers/integration/calendar.route.js";
import EmailRoute from "../routers/integration/email.route.js"
import GithubRoute from "../routers/integration/github.route.js"

/**
 * @param {import('express').Application} app
**/

const initRoutes = (app) => {
    // app.use("/auth", AuthRouter);
    app.use("/users", ClerkUserData, UserRouter);
    app.use("/api", PageRouter);
    app.use('/', LinearRoute);
    app.use('/calendar', CalenderRoute);
    app.use('/gmail', EmailRoute);
    app.use('/github', GithubRoute);

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
