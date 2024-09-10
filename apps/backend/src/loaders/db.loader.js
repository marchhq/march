import { createConnection } from "mongoose";
import { environment } from "./environment.loader.js";

/**
 * Creating a connection below. For now going with a apporach of username and password
 * Later will move to certificate based authentication
 * TODO: Add certificate based authentication
 **/

const db = createConnection(`mongodb+srv://${environment.DB_USER}:${environment.DB_PASS}@${environment.DB_HOST}/${environment.DB_NAME}`, {
    autoIndex: false
})

export { db }
