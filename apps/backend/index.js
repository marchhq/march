import { app } from "./src/index.js";
import { environment } from "./src/loaders/environment.loader.js";
import { WebSocketServer, WebSocket } from "ws";
import http from "http";

let wss;

(async function init () {
    const server = http.createServer(app);
    server.listen(environment.PORT, async () => {
        console.log(`Server listening on port ${environment.PORT}`);
    });

    wss = new WebSocketServer({ server });

    wss.on("connection", function connection (ws) {
        ws.on("error", console.error);

        ws.on("message", function message (data, isBinary) {
            wss.clients.forEach(function each (client) {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(data, { binary: isBinary });
                }
            });
        });

        ws.send("Hello! Message From Server!!");
    });
})();

// Define the broadcastUpdate function inside index.js
export const broadcastUpdate = (data, isBinary = false) => {
    if (!wss) {
        console.log("WebSocket server is not initialized");
        return;
    }

    console.log("Broadcasting update: ", data);

    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            // Send the data to all connected clients
            client.send(JSON.stringify(data), { binary: isBinary });
        }
    });
};

// import { app } from "./src/index.js";
// import { environment } from "./src/loaders/environment.loader.js";
// import { WebSocketServer, WebSocket } from 'ws';
// import http from 'http';
// import ngrok from '@ngrok/ngrok';

// let listener;
// let wss;

// (async function init () {
//     const server = http.createServer(app);
//     server.listen(environment.PORT, async () => {
//         console.log(`Server listening on port ${environment.PORT}`);
//         listener = await ngrok.forward({ addr: `http://localhost:8080`, authtoken: environment.NGROK_AUTH_TOKEN });
//         console.log(`Ingress established at: ${listener.url()}`);
//     });

//     wss = new WebSocketServer({ server });

//     wss.on('connection', function connection (ws) {
//         ws.on('error', console.error);

//         ws.on('message', function message (data, isBinary) {
//             wss.clients.forEach(function each (client) {
//                 if (client.readyState === WebSocket.OPEN) {
//                     client.send(data, { binary: isBinary });
//                 }
//             });
//         });

//         ws.send('Hello! Message From Server!!');
//     });
// })();

// // Define the broadcastUpdate function inside index.js
// export const broadcastUpdate = (data, isBinary = false) => {
//     if (!wss) {
//         console.log("WebSocket server is not initialized");
//         return;
//     }

//     console.log("Broadcasting update: ", data);

//     wss.clients.forEach(client => {
//         if (client.readyState === WebSocket.OPEN) {
//             // Send the data to all connected clients
//             client.send(JSON.stringify(data), { binary: isBinary });
//         }
//     });
// };
