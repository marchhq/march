import { app } from "./src/index.js";
import { environment } from "./src/loaders/environment.loader.js";
import { createServer } from "http";
import { initializeWebSocket } from "./src/loaders/websocket.loader.js";

(async function init () {
    const server = createServer(app);
    server.listen(environment.PORT, () => {
        console.log(`Server listening on port ${environment.PORT}`);
    });

    initializeWebSocket(server);
})();

// for webhook testing
// import { app } from "./src/index.js";
// import { environment } from "./src/loaders/environment.loader.js";
// import { createServer } from "http";
// import { initializeWebSocket } from "./src/loaders/websocket.loader.js"; // Ensure the path is correct
// import ngrok from '@ngrok/ngrok';

// let listener;

// (async function init () {
//     const server = createServer(app);
//     server.listen(environment.PORT, async () => {
//         console.log(`Server listening on port ${environment.PORT}`);
//         // Await ngrok forwarding outside the listen callback
//         listener = await ngrok.forward({ addr: `http://localhost:${environment.PORT}`, authtoken: environment.NGROK_AUTH_TOKEN });
//         console.log(`Ingress established at: ${listener.url()}`);
//     });

//     initializeWebSocket(server);
// })();
