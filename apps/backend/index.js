import { app } from "./src/index.js";
import { environment } from "./src/loaders/environment.loader.js";

(async function init () {
    app.listen(environment.PORT, () => {
        console.log(`Server listening on port ${environment.PORT}`)
    })
})()
