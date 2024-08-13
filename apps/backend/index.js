// import { app } from "./src/index.js";
// import { environment } from "./src/loaders/environment.loader.js";

// (async function init () {
//     app.listen(environment.PORT, () => {
//         console.log(`Server listening on port ${environment.PORT}`)
//     })
// })()

// for webhook testing in local
import { app } from "./src/index.js";
import { environment } from "./src/loaders/environment.loader.js";
import ngrok from '@ngrok/ngrok'

const PORT = 8080;
let listener;
(async function init () {
    app.listen(PORT, async () => {
        console.log(`Server is running on http://localhost:${PORT}`);

        try {
            listener = await ngrok.forward({ addr: `http://localhost:${PORT}`, authtoken: environment.NGROK_AUTH_TOKEN });
            console.log(`Ingress established at: ${listener.url()}`);
        } catch (error) {
            console.error('Error starting ngrok:', error);
        }
    });
})()

export {
    listener
}
